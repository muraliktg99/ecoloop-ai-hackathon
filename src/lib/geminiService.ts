// src/lib/geminiService.ts — Multimodal Gemini Vision Analyzer & Fallback Engine

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { ClassificationResult, WasteCategory, UncertaintyLevel } from "@/types";
import {
  KERALA_WASTE_CATEGORIES,
  getGuidanceForCategory,
  getEligiblePartners,
} from "./keralaWasteRules";

// Schema for validating structured Gemini JSON output
const GeminiRawOutputSchema = z.object({
  itemDescriptionEn: z.string().min(2),
  itemDescriptionMl: z.string().min(2),
  category: z.enum([
    "dry_recyclable_plastic",
    "dry_recyclable_paper",
    "dry_recyclable_glass",
    "dry_recyclable_metal",
    "dry_multilayer_plastic",
    "wet_biodegradable",
    "domestic_hazardous_ewaste",
    "sanitary_medical",
    "other_unclassified",
  ]),
  confidenceScore: z.number().min(0).max(1),
  uncertaintyLevel: z.enum(["low", "medium", "high"]),
  uncertaintyReasonEn: z.string().nullable().optional(),
  uncertaintyReasonMl: z.string().nullable().optional(),
  contaminationDetected: z.boolean(),
  contaminationNotesEn: z.string().nullable().optional(),
  contaminationNotesMl: z.string().nullable().optional(),
  requiresHumanReview: z.boolean(),
  materialComposition: z.string(),
});

type GeminiRawOutput = z.infer<typeof GeminiRawOutputSchema>;

/**
 * Curated Pre-set Scenarios for Quick Demos and Fallback Simulation
 */
export const SAMPLE_WASTE_ITEMS: Array<{
  id: string;
  nameEn: string;
  nameMl: string;
  category: WasteCategory;
  description: string;
  imageUrl: string;
  mockRaw: GeminiRawOutput;
}> = [
  {
    id: "sample-milk-packet",
    nameEn: "Milma Milk Pouch (Empty)",
    nameMl: "മിൽമ പാൽ കവർ (കാലി)",
    category: "dry_multilayer_plastic",
    description: "Multi-layer LDPE/polymer milk packet with dairy residue inside.",
    imageUrl: "/samples/milma_packet.svg",
    mockRaw: {
      itemDescriptionEn: "Milma Pasteurized Milk Pouch (500ml flexible plastic packet)",
      itemDescriptionMl: "മിൽമ പാൽ കവർ (500ml ഫ്ലെക്സിബിൾ പോളിമർ പാക്കറ്റ്)",
      category: "dry_multilayer_plastic",
      confidenceScore: 0.94,
      uncertaintyLevel: "low",
      uncertaintyReasonEn: null,
      uncertaintyReasonMl: null,
      contaminationDetected: true,
      contaminationNotesEn: "Traces of sour milk residue detected inside pouch. Requires thorough rinsing.",
      contaminationNotesMl: "കവറിന്റെ ഉൾഭാഗത്ത് പാലിന്റെ അംശം ഉണ്ട്. സോപ്പുപയോഗിച്ച് കഴുകണം.",
      requiresHumanReview: false,
      materialComposition: "Low Density Polyethylene (LDPE) Multi-layer Polymer Film",
    },
  },
  {
    id: "sample-pet-bottle",
    nameEn: "Clear Water / Beverage Bottle (PET)",
    nameMl: "വെള്ളക്കുപ്പി (PET പ്ലാസ്റ്റിക്)",
    category: "dry_recyclable_plastic",
    description: "Transparent polyethylene terephthalate water bottle with PP screw cap.",
    imageUrl: "/samples/pet_bottle.svg",
    mockRaw: {
      itemDescriptionEn: "Clear 1-Liter Polyethylene Terephthalate (PET-1) Drinking Bottle",
      itemDescriptionMl: "ശുദ്ധജലത്തിന്റെ 1 ലിറ്റർ പ്ലാസ്റ്റിക് കുപ്പി (PET ഗ്രേഡ് 1)",
      category: "dry_recyclable_plastic",
      confidenceScore: 0.98,
      uncertaintyLevel: "low",
      uncertaintyReasonEn: null,
      uncertaintyReasonMl: null,
      contaminationDetected: false,
      contaminationNotesEn: null,
      contaminationNotesMl: null,
      requiresHumanReview: false,
      materialComposition: "High-grade PET body with HDPE/PP screw cap",
    },
  },
  {
    id: "sample-cardboard-oily",
    nameEn: "Cardboard Box with Oil Stains",
    nameMl: "എണ്ണക്കറയുള്ള കാർഡ്ബോർഡ് പെട്ടി",
    category: "dry_recyclable_paper",
    description: "Corrugated takeaway delivery carton with food oil absorption.",
    imageUrl: "/samples/cardboard_box.svg",
    mockRaw: {
      itemDescriptionEn: "Corrugated Paper Cardboard Delivery Box with Heavy Oil Staining",
      itemDescriptionMl: "ഭക്ഷണത്തിന്റെ എണ്ണ പുരണ്ട കാർഡ്ബോർഡ് ഡെലിവറി പെട്ടി",
      category: "dry_recyclable_paper",
      confidenceScore: 0.82,
      uncertaintyLevel: "medium",
      uncertaintyReasonEn: "Grease and food oils weaken cellulose fibers and cannot be chemically removed during pulping.",
      uncertaintyReasonMl: "എണ്ണക്കറ പേപ്പർ റീസൈക്ലിംഗിനെ തടസ്സപ്പെടുത്തുന്നു.",
      contaminationDetected: true,
      contaminationNotesEn: "Oil saturation on bottom quadrant. Cut away clean flaps for paper recycling; compost oily floor.",
      contaminationNotesMl: "എണ്ണയുള്ള ഭാഗം മുറിച്ചുമാറ്റി കമ്പോസ്റ്റിലിടുക. വൃത്തിയുള്ള ഭാഗം പേപ്പർ ശേഖരണത്തിന് നൽകാം.",
      requiresHumanReview: true,
      materialComposition: "Cellulose Kraft Corrugated Fiberboard with lipid contaminants",
    },
  },
  {
    id: "sample-battery",
    nameEn: "AA Alkaline / Lithium Battery",
    nameMl: "ഉപയോഗിച്ച ബാറ്ററി (ഇ-മാലിന്യം)",
    category: "domestic_hazardous_ewaste",
    description: "Discharged cylindrical AA battery cell with metallic casing.",
    imageUrl: "/samples/battery.svg",
    mockRaw: {
      itemDescriptionEn: "1.5V AA Cylindrical Household Battery Cell",
      itemDescriptionMl: "1.5V AA സിലിണ്ടർ ബാറ്ററി സെൽ (ഇ-മാലിന്യം)",
      category: "domestic_hazardous_ewaste",
      confidenceScore: 0.96,
      uncertaintyLevel: "low",
      uncertaintyReasonEn: null,
      uncertaintyReasonMl: null,
      contaminationDetected: false,
      contaminationNotesEn: "Potentially corrosive electrolyte chemicals inside. Terminal short circuit risk.",
      contaminationNotesMl: "ഉള്ളിൽ രാസവസ്തുക്കൾ ഉള്ളതിനാൽ തുറക്കാനോ തീയിലെറിയാനോ പാടില്ല.",
      requiresHumanReview: false,
      materialComposition: "Zinc-Manganese Dioxide / Steel Casing with KOH Electrolyte",
    },
  },
  {
    id: "sample-coconut-shell",
    nameEn: "Coconut Shells & Food Scrap",
    nameMl: "ചിരട്ട & അടുക്കള ജൈവമാലിന്യം",
    category: "wet_biodegradable",
    description: "Organic coconut shell halves and kitchen vegetable trimmings.",
    imageUrl: "/samples/coconut_shell.svg",
    mockRaw: {
      itemDescriptionEn: "Natural Coconut Endocarp Shells and Kitchen Vegetable Peels",
      itemDescriptionMl: "തേങ്ങയുടെ ചിരട്ടയും പച്ചക്കറി അവശിഷ്ടങ്ങളും",
      category: "wet_biodegradable",
      confidenceScore: 0.99,
      uncertaintyLevel: "low",
      uncertaintyReasonEn: null,
      uncertaintyReasonMl: null,
      contaminationDetected: false,
      contaminationNotesEn: null,
      contaminationNotesMl: null,
      requiresHumanReview: false,
      materialComposition: "100% Lignocellulosic Natural Organic Biomass",
    },
  },
];

/**
 * Analyzes waste image using Gemini 2.5 Flash with fallback to intelligent local simulation.
 */
export async function analyzeWasteItem(params: {
  imageBase64?: string;
  imageMimeType?: string;
  userDescription?: string;
  selectedSampleId?: string;
}): Promise<ClassificationResult> {
  const scanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

  // Check if user selected one of the curated demo samples directly
  if (params.selectedSampleId) {
    const sample = SAMPLE_WASTE_ITEMS.find((s) => s.id === params.selectedSampleId);
    if (sample) {
      return formatResult(scanId, sample.mockRaw, "simulated_demo");
    }
  }

  // If a valid Gemini API key is present and image or text description is provided, execute real model inference
  if (apiKey && apiKey.length > 10 && (params.imageBase64 || (params.userDescription && params.userDescription !== "ping"))) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are EcoLoop AI, a specialized circular economy waste classification expert operating in Kerala, India.
Analyze the user's waste item image and optional text description according to Kerala municipal rules (Suchitwa Mission, Haritha Karma Sena, Clean Kerala Company Ltd).

Classification Categories:
- "dry_recyclable_plastic": Clean rigid PET/HDPE bottles, containers, buckets, hard plastics.
- "dry_multilayer_plastic": Multi-layer packaging (MLP), milk pouches (e.g. Milma), chip wrappers, biscuit packets, sachets, flexible pouches.
- "dry_recyclable_paper": Clean cardboard, boxes, newspapers, magazines, office paper.
- "dry_recyclable_glass": Glass bottles, jars, cullet.
- "dry_recyclable_metal": Tin cans, beverage aluminium cans, metal lids, scrap metal.
- "wet_biodegradable": Food scraps, vegetable peels, fruit waste, coconut shells, garden waste.
- "domestic_hazardous_ewaste": Batteries, CFL/LED bulbs, electronic gadgets, circuit boards, wires, chargers.
- "sanitary_medical": Diapers, sanitary pads, band-aids, medicine blisters.
- "other_unclassified": Composite or unknown materials that cannot be identified with high confidence.

Crucial instructions:
1. Distinguish between rigid recyclable plastic and flexible multilayer plastic (MLP). Milk packets and metallized chip wrappers are strictly "dry_multilayer_plastic".
2. Check for contamination: grease/oil on cardboard or food residue on plastic/paper.
3. Be honest about uncertainty: if resolution or angle does not reveal exact polymer or layer composition, set uncertaintyLevel to "medium" or "high", explain reasons, and set requiresHumanReview to true.
4. Provide both English and Malayalam descriptions and reasons.

Respond ONLY with a valid JSON object matching this schema:
{
  "itemDescriptionEn": "string",
  "itemDescriptionMl": "string",
  "category": "dry_recyclable_plastic" | "dry_multilayer_plastic" | "dry_recyclable_paper" | "dry_recyclable_glass" | "dry_recyclable_metal" | "wet_biodegradable" | "domestic_hazardous_ewaste" | "sanitary_medical" | "other_unclassified",
  "confidenceScore": number between 0.0 and 1.0,
  "uncertaintyLevel": "low" | "medium" | "high",
  "uncertaintyReasonEn": "string or null",
  "uncertaintyReasonMl": "string or null",
  "contaminationDetected": boolean,
  "contaminationNotesEn": "string or null",
  "contaminationNotesMl": "string or null",
  "requiresHumanReview": boolean,
  "materialComposition": "string"
}`;

      const contentParts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
        { text: systemPrompt },
      ];

      if (params.imageBase64) {
        contentParts.push({
          inlineData: {
            data: params.imageBase64.replace(/^data:image\/[a-z]+;base64,/, ""),
            mimeType: params.imageMimeType || "image/jpeg",
          },
        });
      }

      if (params.userDescription) {
        contentParts.push({ text: `User note / description: ${params.userDescription}` });
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: contentParts,
          },
        ],
      });

      const responseText = response.text || "";
      // Strip markdown code fence if wrapped
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
      const parsedData = JSON.parse(cleanJson);
      const validatedOutput = GeminiRawOutputSchema.parse(parsedData);

      return formatResult(scanId, validatedOutput, "live_gemini");
    } catch (err: unknown) {
      console.warn("Live Gemini API call failed or timed out. Falling back to simulated analysis:", err);
      // Fallback gracefully below
    }
  }

  // Offline Simulation / Fallback Mode
  // If user provided a text description, match against smart heuristics
  const textDesc = (params.userDescription || "").toLowerCase();
  let matchedSample = SAMPLE_WASTE_ITEMS[0]; // Default Milma packet

  if (textDesc.includes("bottle") || textDesc.includes("pet") || textDesc.includes("water") || textDesc.includes("plastic")) {
    matchedSample = SAMPLE_WASTE_ITEMS[1];
  } else if (textDesc.includes("box") || textDesc.includes("cardboard") || textDesc.includes("paper") || textDesc.includes("carton")) {
    matchedSample = SAMPLE_WASTE_ITEMS[2];
  } else if (textDesc.includes("battery") || textDesc.includes("electronic") || textDesc.includes("wire") || textDesc.includes("cell")) {
    matchedSample = SAMPLE_WASTE_ITEMS[3];
  } else if (textDesc.includes("food") || textDesc.includes("organic") || textDesc.includes("coconut") || textDesc.includes("peel")) {
    matchedSample = SAMPLE_WASTE_ITEMS[4];
  }

  return formatResult(scanId, matchedSample.mockRaw, "simulated_demo");
}

function formatResult(
  scanId: string,
  raw: GeminiRawOutput,
  mode: "live_gemini" | "simulated_demo"
): ClassificationResult {
  const categoryInfo = KERALA_WASTE_CATEGORIES[raw.category] || KERALA_WASTE_CATEGORIES.other_unclassified;
  const guidance = getGuidanceForCategory(raw.category, raw.contaminationDetected);
  const eligiblePartners = getEligiblePartners(raw.category);

  return {
    scanId,
    itemDescriptionEn: raw.itemDescriptionEn,
    itemDescriptionMl: raw.itemDescriptionMl,
    category: raw.category,
    categoryNameEn: categoryInfo.nameEn,
    categoryNameMl: categoryInfo.nameMl,
    confidenceScore: raw.confidenceScore,
    uncertaintyLevel: raw.uncertaintyLevel as UncertaintyLevel,
    uncertaintyReasonEn: raw.uncertaintyReasonEn || null,
    uncertaintyReasonMl: raw.uncertaintyReasonMl || null,
    contaminationDetected: raw.contaminationDetected,
    contaminationNotesEn: raw.contaminationNotesEn || null,
    contaminationNotesMl: raw.contaminationNotesMl || null,
    requiresHumanReview: raw.requiresHumanReview,
    materialComposition: raw.materialComposition,
    guidance,
    eligiblePartners,
    analyzedAt: new Date().toISOString(),
    analysisMode: mode,
  };
}
