// src/__tests__/keralaWasteRules.test.ts — Unit tests for Kerala waste rules & partner matching

import { describe, it, expect } from "vitest";
import {
  KERALA_WASTE_CATEGORIES,
  getGuidanceForCategory,
  getEligiblePartners,
} from "@/lib/keralaWasteRules";

describe("Kerala Waste Rules Knowledge Base", () => {
  it("should have comprehensive rules for all defined waste categories", () => {
    const categories = Object.keys(KERALA_WASTE_CATEGORIES);
    expect(categories).toContain("dry_recyclable_plastic");
    expect(categories).toContain("dry_multilayer_plastic");
    expect(categories).toContain("dry_recyclable_paper");
    expect(categories).toContain("domestic_hazardous_ewaste");
    expect(categories).toContain("wet_biodegradable");
  });

  it("should return clean handling instructions and provenance for PET plastic", () => {
    const guidance = getGuidanceForCategory("dry_recyclable_plastic", false);
    expect(guidance.cleaningRequired).toBe(true);
    expect(guidance.dryingRequired).toBe(true);
    expect(guidance.ruleProvenance).toContain("Suchitwa Mission");
    expect(guidance.storageMethodMl).toBeDefined();
  });

  it("should inject contamination warning when contamination is detected", () => {
    const normalGuidance = getGuidanceForCategory("dry_recyclable_paper", false);
    const contaminatedGuidance = getGuidanceForCategory("dry_recyclable_paper", true);

    expect(contaminatedGuidance.cleaningRequired).toBe(true);
    expect(contaminatedGuidance.storageMethodEn).toContain("CONTAMINATION ALERT");
    expect(contaminatedGuidance.localAcceptanceRuleEn).toContain("rejected by Haritha Karma Sena");
  });

  it("should correctly identify eligible partners for Multilayer Plastics (MLP)", () => {
    const partners = getEligiblePartners("dry_multilayer_plastic");
    expect(partners.length).toBeGreaterThan(0);
    const partnerIds = partners.map((p) => p.id);
    expect(partnerIds).toContain("ckcl-kalamassery-rrf"); // Clean Kerala Co. RRF accepts MLP
  });

  it("should prohibit regular dry waste collectors from accepting wet biodegradable waste", () => {
    const wetPartners = getEligiblePartners("wet_biodegradable");
    const hksKochi = wetPartners.find((p) => p.id === "hks-ernakulam-central");
    expect(hksKochi).toBeUndefined(); // HKS dry collection does not accept wet waste
    const compostCluster = wetPartners.find((p) => p.id === "kudumbashree-community-compost");
    expect(compostCluster).toBeDefined();
  });
});
