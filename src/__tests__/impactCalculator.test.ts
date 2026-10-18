// src/__tests__/impactCalculator.test.ts — Unit tests for verified environmental impact calculations

import { describe, it, expect } from "vitest";
import { calculateImpactMetrics, IMPACT_FACTORS } from "@/lib/impactCalculator";
import { CollectionRequest } from "@/types";

describe("Impact Calculator Engine", () => {
  it("must NEVER credit impact for pending or unverified collection requests", () => {
    const unverifiedRequests: CollectionRequest[] = [
      {
        id: "req-1",
        userId: "u1",
        userName: "Test User",
        userPhone: "123",
        district: "Ernakulam",
        locality: "Kochi",
        category: "dry_recyclable_plastic",
        categoryNameEn: "Plastic",
        categoryNameMl: "പ്ലാസ്റ്റിക്",
        itemDescription: "Plastic bottles",
        estimatedWeightKg: 10.0,
        status: "pending", // NOT accepted
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "req-2",
        userId: "u2",
        userName: "Test User 2",
        userPhone: "123",
        district: "Ernakulam",
        locality: "Kochi",
        category: "dry_recyclable_metal",
        categoryNameEn: "Metal",
        categoryNameMl: "മെറ്റൽ",
        itemDescription: "Aluminium cans",
        estimatedWeightKg: 5.0,
        status: "scheduled", // NOT accepted
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "req-3",
        userId: "u3",
        userName: "Test User 3",
        userPhone: "123",
        district: "Ernakulam",
        locality: "Kochi",
        category: "dry_recyclable_paper",
        categoryNameEn: "Paper",
        categoryNameMl: "പേപ്പർ",
        itemDescription: "Dirty boxes",
        estimatedWeightKg: 8.0,
        status: "rejected", // REJECTED
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rejectionReason: "Contaminated with grease",
      },
    ];

    const metrics = calculateImpactMetrics(15, unverifiedRequests);

    expect(metrics.totalScans).toBe(15);
    expect(metrics.totalRequests).toBe(3);
    expect(metrics.totalEstimatedKg).toBe(23.0);
    // Crucial rule: zero verified impact
    expect(metrics.verifiedAcceptedKg).toBe(0);
    expect(metrics.divertedLandfillKg).toBe(0);
    expect(metrics.avoidedGhgKgCo2e).toBe(0);
    expect(metrics.verificationRatePercent).toBe(0);
  });

  it("should accurately compute diverted mass and avoided emissions from verified evidence", () => {
    const verifiedRequests: CollectionRequest[] = [
      {
        id: "req-verified-plastic",
        userId: "u1",
        userName: "Resident 1",
        userPhone: "123",
        district: "Ernakulam",
        locality: "Kochi",
        category: "dry_recyclable_plastic",
        categoryNameEn: "Plastic",
        categoryNameMl: "പ്ലാസ്റ്റിക്",
        itemDescription: "PET Bottles",
        estimatedWeightKg: 5.0,
        status: "accepted",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        evidence: {
          verifiedAt: new Date().toISOString(),
          verifiedBy: "HKS-OFFICER-01",
          collectorName: "Saritha",
          collectorWardOrCenter: "Ward 12",
          receiptNumber: "RCP-1001",
          scaleReadingKg: 5.2,
          contaminationDeductionKg: 0.2,
          netAcceptedWeightKg: 5.0, // 5 kg net
          verificationNotes: "Clean bottles",
        },
      },
      {
        id: "req-verified-metal",
        userId: "u2",
        userName: "Resident 2",
        userPhone: "456",
        district: "Ernakulam",
        locality: "Kochi",
        category: "dry_recyclable_metal",
        categoryNameEn: "Metal",
        categoryNameMl: "മെറ്റൽ",
        itemDescription: "Aluminium Cans",
        estimatedWeightKg: 2.0,
        status: "accepted",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        evidence: {
          verifiedAt: new Date().toISOString(),
          verifiedBy: "SCRAP-REC-02",
          collectorName: "Farooq",
          collectorWardOrCenter: "Kaloor Hub",
          receiptNumber: "RCP-1002",
          scaleReadingKg: 2.0,
          contaminationDeductionKg: 0.0,
          netAcceptedWeightKg: 2.0, // 2 kg net
          verificationNotes: "Aluminium",
        },
      },
    ];

    const metrics = calculateImpactMetrics(10, verifiedRequests);

    // 5kg plastic + 2kg metal = 7kg verified accepted
    expect(metrics.verifiedAcceptedKg).toBe(7.0);
    expect(metrics.divertedLandfillKg).toBe(7.0);

    // Expected CO2e: (5 * 1.8) + (2 * 8.9) = 9.0 + 17.8 = 26.8 kg CO2e
    const expectedCo2e =
      5.0 * IMPACT_FACTORS.dry_recyclable_plastic.co2eKgPerKg +
      2.0 * IMPACT_FACTORS.dry_recyclable_metal.co2eKgPerKg;

    expect(metrics.avoidedGhgKgCo2e).toBeCloseTo(expectedCo2e, 1);
  });
});
