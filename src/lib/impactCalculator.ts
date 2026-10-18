// src/lib/impactCalculator.ts — Transparent, Documented Environmental Impact Calculations

import { CollectionRequest, ImpactMetrics, WasteCategory } from "@/types";

/**
 * Environmental Conversion Factors per kg of VERIFIED accepted material
 * Sources:
 * - Central Pollution Control Board (CPCB) India Plastic Waste Management Rules 2022
 * - US EPA Waste Reduction Model (WARM) v16
 * - Bureau of Energy Efficiency (BEE) India Industrial Conservation Benchmarks
 */
export const IMPACT_FACTORS: Record<
  WasteCategory,
  {
    co2eKgPerKg: number; // Avoided Greenhouse Gas (kg CO2 equivalent)
    energyKwhPerKg: number; // Conserved electrical/thermal energy
    waterLitersPerKg: number; // Conserved freshwater
    citation: string;
  }
> = {
  dry_recyclable_plastic: {
    co2eKgPerKg: 1.8,
    energyKwhPerKg: 5.7,
    waterLitersPerKg: 18.0,
    citation: "CPCB / EPA WARM v16 (PET/HDPE mechanical recycling vs virgin resin)",
  },
  dry_multilayer_plastic: {
    co2eKgPerKg: 1.2,
    energyKwhPerKg: 2.1,
    waterLitersPerKg: 4.5,
    citation: "Clean Kerala Co. road-tar polymer substitution & landfill avoidance",
  },
  dry_recyclable_paper: {
    co2eKgPerKg: 1.1,
    energyKwhPerKg: 4.0,
    waterLitersPerKg: 26.0,
    citation: "Indian Pulp and Paper Technical Association (IPPTA) Lifecycle Audit",
  },
  dry_recyclable_glass: {
    co2eKgPerKg: 0.31,
    energyKwhPerKg: 0.42,
    waterLitersPerKg: 1.2,
    citation: "Glass Packaging Institute / EPA WARM Cullet Remelt Model",
  },
  dry_recyclable_metal: {
    co2eKgPerKg: 8.9,
    energyKwhPerKg: 14.0,
    waterLitersPerKg: 40.0,
    citation: "International Aluminium Institute & CPCB Scrap Metals Audit",
  },
  wet_biodegradable: {
    co2eKgPerKg: 0.5,
    energyKwhPerKg: 0.1,
    waterLitersPerKg: 0.0,
    citation: "Suchitwa Mission Aerobic Composting vs Anaerobic Landfill Methane Avoidance",
  },
  domestic_hazardous_ewaste: {
    co2eKgPerKg: 3.2,
    energyKwhPerKg: 8.5,
    waterLitersPerKg: 12.0,
    citation: "E-Waste Management Rules 2022 Heavy Metal Leaching Prevention & Precious Metal Recovery",
  },
  sanitary_medical: {
    co2eKgPerKg: 0.0, // High-temperature incineration required for biosecurity; no recycling claim
    energyKwhPerKg: 0.0,
    waterLitersPerKg: 0.0,
    citation: "Bio-Medical Waste Rules 2016 (Biosecure Disposal; Zero Recycle Claim)",
  },
  other_unclassified: {
    co2eKgPerKg: 0.0,
    energyKwhPerKg: 0.0,
    waterLitersPerKg: 0.0,
    citation: "Zero impact credited until material composition is verified by laboratory or HKS sorting",
  },
};

/**
 * Calculates auditable impact metrics ONLY from verified accepted collection events.
 * CRITICAL RULE: Unverified scans, pending requests, and rejected items NEVER contribute to diverted kg or avoided CO2e.
 */
export function calculateImpactMetrics(
  totalScansCount: number,
  requests: CollectionRequest[]
): ImpactMetrics {
  let totalEstimatedKg = 0;
  let verifiedAcceptedKg = 0;
  let divertedLandfillKg = 0;
  let avoidedGhgKgCo2e = 0;
  let waterSavedLiters = 0;
  let energySavedKwh = 0;

  const categoryBreakdown: Record<WasteCategory, { count: number; weightKg: number }> = {
    dry_recyclable_plastic: { count: 0, weightKg: 0 },
    dry_multilayer_plastic: { count: 0, weightKg: 0 },
    dry_recyclable_paper: { count: 0, weightKg: 0 },
    dry_recyclable_glass: { count: 0, weightKg: 0 },
    dry_recyclable_metal: { count: 0, weightKg: 0 },
    wet_biodegradable: { count: 0, weightKg: 0 },
    domestic_hazardous_ewaste: { count: 0, weightKg: 0 },
    sanitary_medical: { count: 0, weightKg: 0 },
    other_unclassified: { count: 0, weightKg: 0 },
  };

  for (const req of requests) {
    totalEstimatedKg += req.estimatedWeightKg || 0;

    // Only count verified accepted requests
    if (req.status === "accepted" && req.evidence) {
      const netWeight = req.evidence.netAcceptedWeightKg || 0;
      verifiedAcceptedKg += netWeight;
      divertedLandfillKg += netWeight;

      const factors = IMPACT_FACTORS[req.category] || IMPACT_FACTORS.other_unclassified;
      avoidedGhgKgCo2e += netWeight * factors.co2eKgPerKg;
      energySavedKwh += netWeight * factors.energyKwhPerKg;
      waterSavedLiters += netWeight * factors.waterLitersPerKg;

      if (categoryBreakdown[req.category]) {
        categoryBreakdown[req.category].count += 1;
        categoryBreakdown[req.category].weightKg += netWeight;
      }
    }
  }

  const verificationRatePercent =
    totalEstimatedKg > 0 ? Math.min(100, (verifiedAcceptedKg / totalEstimatedKg) * 100) : 0;

  return {
    totalScans: totalScansCount,
    totalRequests: requests.length,
    totalEstimatedKg: Number(totalEstimatedKg.toFixed(2)),
    verifiedAcceptedKg: Number(verifiedAcceptedKg.toFixed(2)),
    divertedLandfillKg: Number(divertedLandfillKg.toFixed(2)),
    avoidedGhgKgCo2e: Number(avoidedGhgKgCo2e.toFixed(2)),
    waterSavedLiters: Number(waterSavedLiters.toFixed(1)),
    energySavedKwh: Number(energySavedKwh.toFixed(1)),
    verificationRatePercent: Number(verificationRatePercent.toFixed(1)),
    categoryBreakdown,
    lastCalculatedAt: new Date().toISOString(),
  };
}
