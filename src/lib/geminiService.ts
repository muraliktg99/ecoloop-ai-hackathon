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
  clientApiKey?: string;
}): Promise<ClassificationResult> {
  const scanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const apiKey = params.clientApiKey?.trim() || process.env.GEMINI_API_KEY?.trim();
  const configuredModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";

  // Check if user selected one of the curated demo samples directly
  if (params.selectedSampleId) {
    const sample = SAMPLE_WASTE_ITEMS.find((s) => s.id === params.selectedSampleId);
    if (sample) {
      return formatResult(scanId, sample.mockRaw, "simulated_demo");
    }
  }

  // If a valid Gemini API key is present and image or text description is provided, execute real model inference
  if (apiKey && apiKey.length > 10 && (params.imageBase64 || (params.userDescription && params.userDescription !== "ping"))) {
    let lastError: Error | null = null;

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Build model priority queue: configured model -> verified active quota models
      const defaultCandidates = [
        configuredModel,
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest",
        "gemini-3.8-flash",
      ];

      let modelsToTry: string[] = [];

      try {
        const pager = await ai.models.list();
        const available: string[] = [];
        for await (const m of pager) {
          const mName = (m.name || "").replace(/^models\//, "");
          const anyM = m as Record<string, unknown>;
          const actions = Array.isArray(anyM.supportedActions)
            ? anyM.supportedActions
            : Array.isArray(anyM.supportedGenerationMethods)
            ? anyM.supportedGenerationMethods
            : [];
          if (
            (!actions.length || actions.includes("generateContent")) &&
            !mName.includes("embedding") &&
            mName.includes("gemini")
          ) {
            available.push(mName);
          }
        }
        if (available.length > 0) {
          // Sort available models prioritizing 3.5-flash-lite and 3.1-flash-lite (15 RPM / 500 RPD active quota)
          const score = (name: string) => {
            if (name === configuredModel) return 100;
            if (name.includes("3.5-flash-lite") || name.includes("3.5-lite")) return 98;
            if (name.includes("3.1-flash-lite") || name.includes("3.1-lite")) return 95;
            if (name.includes("flash-latest")) return 90;
            if (name.includes("3.8-flash")) return 85;
            if (name.includes("flash")) return 70;
            return 50;
          };
          modelsToTry = available.sort((a, b) => score(b) - score(a));
        }
      } catch (listErr) {
        console.warn("Dynamic model discovery bypassed, using curated 2026 model candidates:", listErr);
      }

      if (modelsToTry.length === 0) {
        modelsToTry = Array.from(new Set(defaultCandidates));
      }

      const systemPrompt = `You are EcoLoop AI, a specialized circular economy waste classification expert operating in Kerala, India.
Analyze the user's waste item image and optional text description according to Kerala municipal rules (Suchitwa Mission, Haritha Karma Sena, Clean Kerala Company Ltd).

Classification Categories:
- "dry_recyclable_plastic": Clean rigid PET/HDPE bottles, containers, buckets, hard plastics.
- "dry_multilayer_plastic": Multi-layer packaging (MLP), milk pouches (e.g. Milma), chip wrappers, biscuit packets, sachets, flexible pouches.
- "dry_recyclable_paper": Clean cardboard, corrugated packaging/delivery boxes (Amazon/Flipkart cartons), newspapers, magazines, office paper, paper bags.
- "dry_recyclable_glass": Glass bottles, jars, cullet.
- "dry_recyclable_metal": Tin cans, beverage aluminium cans, metal lids, scrap metal.
- "wet_biodegradable": Food scraps, vegetable peels, fruit waste, coconut shells, garden waste.
- "domestic_hazardous_ewaste": Batteries, CFL/LED bulbs, electronic gadgets, circuit boards, wires, chargers.
- "sanitary_medical": Diapers, sanitary pads, band-aids, medicine blisters.
- "other_unclassified": Non-waste items, human portraits, selfies, living beings, animals, furniture, or unidentifiable items.

CRITICAL RULES:
1. SELFIES / FACES / LIVING BEINGS / NON-WASTE:
   If the photo depicts a person, human face, selfie, animal, or non-waste household furniture/landscape, you MUST classify it as "other_unclassified", set confidenceScore to 0.05, uncertaintyLevel to "high", requiresHumanReview to true, and explain in itemDescriptionEn: "Human Portrait / Non-waste Item Detected: The uploaded photo appears to be a person or non-waste object rather than recyclable material. Please scan household waste or recyclables for recovery routing." Provide Malayalam translation in itemDescriptionMl.
2. CARDBOARD / DELIVERY BOXES:
   If the photo shows corrugated cardboard, shipping/delivery cartons (e.g. Amazon, Flipkart), brown paper boxes, or packaging cartons, you MUST classify as "dry_recyclable_paper". NEVER classify cardboard as "dry_multilayer_plastic".
   Check for contamination: if clear plastic packing tape or shipping labels are attached, set contaminationDetected to true, contaminationNotesEn to "Plastic shipping tape/labels present on cardboard. Please peel off packing tape and flatten box before Haritha Karma Sena collection."
3. RIGID PLASTIC vs MULTILAYER PACKAGING (MLP):
   - Rigid containers (PET water/soda bottles, shampoo bottles, buckets, food tubs) = "dry_recyclable_plastic".
   - Flexible sachets, laminated chip wrappers, milk pouches = "dry_multilayer_plastic".
4. CONFIDENCE & CONTAMINATION:
   - Always assess contamination honestly (food residue, grease, liquids).
   - If clean, set contaminationDetected to false.
5. Provide both English and Malayalam descriptions and guidance.

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
        const cleanBase64 = params.imageBase64.replace(/^data:[^;]+;base64,/, "");
        contentParts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: params.imageMimeType || "image/jpeg",
          },
        });
      }

      if (params.userDescription) {
        contentParts.push({ text: `User note / description: ${params.userDescription}` });
      }

      for (const modelToCall of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelToCall,
            contents: [
              {
                role: "user",
                parts: contentParts,
              },
            ],
            config: {
              responseMimeType: "application/json",
            },
          });

          const responseText = response.text || "";
          const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
          const parsedData = JSON.parse(cleanJson);
          const validatedOutput = GeminiRawOutputSchema.parse(parsedData);

          return formatResult(scanId, validatedOutput, "live_gemini", modelToCall);
        } catch (err: unknown) {
          lastError = err instanceof Error ? err : new Error(String(err));
          console.warn(`Model ${modelToCall} attempt failed:`, lastError.message);
          // Try next model candidate
        }
      }

      // If all models failed
      console.error("All Gemini model attempts failed:", lastError?.message);
      const errMsg = lastError?.message || "Gemini inference unavailable";
      return formatResult(
        scanId,
        {
          itemDescriptionEn: "Live Gemini Analysis Encountered Error",
          itemDescriptionMl: "തത്സമയ ജെമിനി വിശകലനം പരാജയപ്പെട്ടു",
          category: "other_unclassified",
          confidenceScore: 0.1,
          uncertaintyLevel: "high",
          uncertaintyReasonEn: `Gemini API reported: ${errMsg.substring(0, 160)}. Please verify your API key and quota in Google AI Studio.`,
          uncertaintyReasonMl: "ജെമിനി API കണക്ഷൻ പരാജയപ്പെട്ടു. API കീ പരിശോധിക്കുക.",
          contaminationDetected: false,
          contaminationNotesEn: null,
          contaminationNotesMl: null,
          requiresHumanReview: true,
          materialComposition: "Unverified (API Error)",
        },
        "simulated_demo"
      );
    } catch (err: unknown) {
      console.error("Gemini SDK initialization error:", err);
    }
  }

  // If a custom image was uploaded, but no Gemini API key is configured:
  if (params.imageBase64) {
    return formatResult(
      scanId,
      {
        itemDescriptionEn: "Custom Waste Image Uploaded (Gemini API Key Required for Live Vision)",
        itemDescriptionMl: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്തു (തത്സമയ വിശകലനത്തിന് API കീ നൽകുക)",
        category: "other_unclassified",
        confidenceScore: 0.2,
        uncertaintyLevel: "high",
        uncertaintyReasonEn: "Live multimodal reasoning requires a Google Gemini API Key. Click 'Configure Gemini API Key' in the header to connect your free key from Google AI Studio.",
        uncertaintyReasonMl: "ഈ ചിത്രം വിശകലനം ചെയ്യാൻ ഗൂഗിൾ ജെമിനി API കീ നൽകുക.",
        contaminationDetected: false,
        contaminationNotesEn: null,
        contaminationNotesMl: null,
        requiresHumanReview: true,
        materialComposition: "Awaiting Gemini Vision API Key",
      },
      "simulated_demo"
    );
  }

  // Offline Simulation / Text Heuristics Fallback Mode
  const textDesc = (params.userDescription || "").toLowerCase();
  let matchedSample = SAMPLE_WASTE_ITEMS[0]; // Milma packet

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
  mode: "live_gemini" | "simulated_demo",
  modelUsed?: string
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
    modelUsed,
  };
}
