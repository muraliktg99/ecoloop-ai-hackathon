// src/__tests__/storage.test.ts — Unit tests for In-Memory Storage & Status Transitions

import { describe, it, expect, beforeEach } from "vitest";
import { dataStore } from "@/lib/storage";

describe("EcoLoop Data Repository & Workflow Lifecycle", () => {
  beforeEach(() => {
    dataStore.resetDemoData();
  });

  it("should initialize with curated demo requests", () => {
    const requests = dataStore.getRequests();
    expect(requests.length).toBeGreaterThanOrEqual(5);

    // Verify presence of accepted, scheduled, and rejected items
    const statuses = requests.map((r) => r.status);
    expect(statuses).toContain("accepted");
    expect(statuses).toContain("scheduled");
    expect(statuses).toContain("rejected");
  });

  it("should create a new pending request", () => {
    const newReq = dataStore.createRequest({
      userName: "Suresh Kumar",
      userPhone: "+91 98460 00111",
      district: "Ernakulam",
      locality: "Aluva",
      category: "dry_recyclable_plastic",
      categoryNameEn: "PET Plastic",
      categoryNameMl: "പ്ലാസ്റ്റിക്",
      itemDescription: "20 plastic soft drink bottles",
      estimatedWeightKg: 1.5,
    });

    expect(newReq.id).toBeDefined();
    expect(newReq.status).toBe("pending");

    const fetched = dataStore.getRequestById(newReq.id);
    expect(fetched).toBeDefined();
    expect(fetched?.estimatedWeightKg).toBe(1.5);
  });

  it("should transition request through verification and deduct contamination", () => {
    const newReq = dataStore.createRequest({
      userName: "Ramesh Babu",
      userPhone: "+91 98460 22334",
      district: "Ernakulam",
      locality: "Vyttila",
      category: "dry_recyclable_plastic",
      categoryNameEn: "PET Plastic",
      categoryNameMl: "പ്ലാസ്റ്റിക്",
      itemDescription: "Plastic containers",
      estimatedWeightKg: 4.0,
    });

    // Collector weighs item: scale reads 4.2 kg, deducts 0.4 kg contamination
    const verified = dataStore.verifyCollection(newReq.id, {
      verifiedBy: "HKS-COLLECTOR-11",
      collectorName: "Latha M.",
      collectorWardOrCenter: "Ward 18 MCF",
      scaleReadingKg: 4.2,
      contaminationDeductionKg: 0.4,
      verificationNotes: "400g wet silt deducted.",
    });

    expect(verified).toBeDefined();
    expect(verified?.status).toBe("accepted");
    expect(verified?.evidence).toBeDefined();
    expect(verified?.evidence?.netAcceptedWeightKg).toBe(3.8); // 4.2 - 0.4 = 3.8
  });
});
