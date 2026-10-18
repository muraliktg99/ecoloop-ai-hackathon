// src/lib/storage.ts — In-Memory State & Auditable Repository for EcoLoop AI

import { CollectionRequest, ImpactMetrics, VerificationEvidence, WasteCategory } from "@/types";
import { calculateImpactMetrics } from "./impactCalculator";

// Seeded real-world demonstration data for Kerala context
const INITIAL_DEMO_REQUESTS: CollectionRequest[] = [
  {
    id: "req-kerala-101",
    userId: "user-kochi-01",
    userName: "Anjali Menon",
    userPhone: "+91 98470 11223",
    district: "Ernakulam",
    locality: "Marine Drive, Ward 14",
    category: "dry_recyclable_plastic",
    categoryNameEn: "Recyclable Rigid Plastic (PET / HDPE)",
    categoryNameMl: "പുനരുപയോഗിക്കാവുന്ന പ്ലാസ്റ്റിക്",
    itemDescription: "Cleaned and crushed transparent water bottles and milk cans (approx 35 pcs)",
    estimatedWeightKg: 3.0,
    status: "accepted",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    partnerId: "hks-ernakulam-central",
    partnerName: "Haritha Karma Sena — Kochi Municipal Corporation",
    evidence: {
      verifiedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      verifiedBy: "HKS-WARD14-OFFICER-07",
      collectorName: "Saritha Kumari (HKS Lead)",
      collectorWardOrCenter: "Ward 14 MCF Centre, Marine Drive",
      receiptNumber: "HKS-KMC-2026-8812",
      scaleReadingKg: 3.1,
      contaminationDeductionKg: 0.3,
      netAcceptedWeightKg: 2.8,
      verificationNotes: "300g oily cap liners deducted. Bottles fully clean and baled for recycling.",
    },
  },
  {
    id: "req-kerala-102",
    userId: "user-kalamassery-02",
    userName: "Rahul Varma",
    userPhone: "+91 94471 99887",
    district: "Ernakulam",
    locality: "South Kalamassery",
    category: "dry_multilayer_plastic",
    categoryNameEn: "Multilayer Packaging / Flexible Plastic (MLP)",
    categoryNameMl: "മൾട്ടിലെയർ പ്ലാസ്റ്റിക് / കവറുകൾ",
    itemDescription: "Washed and dried Milma milk packets and snack wrappers collected over 1 month",
    estimatedWeightKg: 4.0,
    status: "accepted",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    partnerId: "ckcl-kalamassery-rrf",
    partnerName: "Clean Kerala Company Ltd (CKCL) — Resource Recovery Facility",
    evidence: {
      verifiedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      verifiedBy: "CKCL-RRF-INSPECTOR-02",
      collectorName: "Biju P. (Weighbridge In-charge)",
      collectorWardOrCenter: "Kalamassery RRF Facility",
      receiptNumber: "CKCL-RRF-POLY-4091",
      scaleReadingKg: 3.7,
      contaminationDeductionKg: 0.2,
      netAcceptedWeightKg: 3.5,
      verificationNotes: "Certified clean dry polymer film. Routed to shredding hopper for PWD road tarring project.",
    },
  },
  {
    id: "req-kerala-103",
    userId: "user-kaloor-03",
    userName: "Thomas Joseph",
    userPhone: "+91 98950 55443",
    district: "Ernakulam",
    locality: "Banerji Road, Kaloor",
    category: "dry_recyclable_metal",
    categoryNameEn: "Metal & Aluminium Cans",
    categoryNameMl: "മെറ്റൽ & അലുമിനിയം ടിന്നുകൾ",
    itemDescription: "Crushed beverage cans and tin food cans",
    estimatedWeightKg: 4.5,
    status: "accepted",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    partnerId: "scrap-guild-ernakulam",
    partnerName: "Kerala Scrap Recyclers Guild — Authorised Collection Hub",
    evidence: {
      verifiedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      verifiedBy: "GUILD-SCALE-OPERATOR-19",
      collectorName: "M. A. Farooq (Licensed Recycler)",
      collectorWardOrCenter: "Kaloor Scrap Exchange Yard",
      receiptNumber: "SCRAP-REC-2026-1904",
      scaleReadingKg: 4.2,
      contaminationDeductionKg: 0.0,
      netAcceptedWeightKg: 4.2,
      verificationNotes: "100% clean aluminium and tin scrap. Immediate payout ₹252 issued at ₹60/kg.",
    },
  },
  {
    id: "req-kerala-104",
    userId: "user-edappally-04",
    userName: "Geetha Nair",
    userPhone: "+91 97455 33221",
    district: "Ernakulam",
    locality: "Edappally Toll",
    category: "dry_recyclable_paper",
    categoryNameEn: "Paper & Cardboard",
    categoryNameMl: "പേപ്പർ & കാർഡ്ബോർഡ്",
    itemDescription: "Amazon shipping boxes, flattened and bound with jute thread",
    estimatedWeightKg: 5.5,
    status: "scheduled",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    partnerId: "hks-ernakulam-central",
    partnerName: "Haritha Karma Sena — Kochi Municipal Corporation",
  },
  {
    id: "req-kerala-105",
    userId: "user-palayam-05",
    userName: "Deepak S.",
    userPhone: "+91 94460 77889",
    district: "Thiruvananthapuram",
    locality: "Palayam",
    category: "dry_recyclable_paper",
    categoryNameEn: "Paper & Cardboard",
    categoryNameMl: "പേപ്പർ & കാർഡ്ബോർഡ്",
    itemDescription: "Cardboard pizza cartons heavily soaked with cheese oil and tomato sauce",
    estimatedWeightKg: 2.0,
    status: "rejected",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    partnerId: "hks-tvm-corporation",
    partnerName: "Haritha Karma Sena — Thiruvananthapuram Corporation",
    rejectionReason: "REJECTED AT DOORSTEP: Deep grease oil saturation cannot be pulped. Advised household to compost oily sections.",
  },
  {
    id: "req-kerala-106",
    userId: "user-kakkanad-06",
    userName: "Nandini R.",
    userPhone: "+91 99955 88112",
    district: "Ernakulam",
    locality: "Infopark, Kakkanad",
    category: "domestic_hazardous_ewaste",
    categoryNameEn: "E-Waste & Domestic Hazardous",
    categoryNameMl: "ഇ-മാലിന്യം & അപകടകരമായ വസ്തുക്കൾ",
    itemDescription: "Dead laptop charger adapter and 8 AA drained batteries with taped terminals",
    estimatedWeightKg: 1.2,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    partnerId: "hks-ernakulam-central",
    partnerName: "Haritha Karma Sena — Kochi Municipal Corporation",
  },
];

// Global in-memory singleton for server execution
class EcoLoopDataStore {
  private requests: CollectionRequest[];
  private totalScansCount: number;

  constructor() {
    this.requests = [...INITIAL_DEMO_REQUESTS];
    this.totalScansCount = 28; // Cumulative scans recorded
  }

  public getRequests(): CollectionRequest[] {
    return [...this.requests].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getRequestById(id: string): CollectionRequest | undefined {
    return this.requests.find((r) => r.id === id);
  }

  public createRequest(data: {
    userName: string;
    userPhone: string;
    district: string;
    locality: string;
    category: WasteCategory;
    categoryNameEn: string;
    categoryNameMl: string;
    itemDescription: string;
    estimatedWeightKg: number;
    partnerId?: string;
    partnerName?: string;
    imageUrl?: string;
  }): CollectionRequest {
    const id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newReq: CollectionRequest = {
      id,
      userId: `user-${Date.now()}`,
      userName: data.userName || "Resident",
      userPhone: data.userPhone || "Not specified",
      district: data.district || "Ernakulam",
      locality: data.locality || "Kerala",
      category: data.category,
      categoryNameEn: data.categoryNameEn,
      categoryNameMl: data.categoryNameMl,
      itemDescription: data.itemDescription,
      estimatedWeightKg: data.estimatedWeightKg || 1.0,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      partnerId: data.partnerId,
      partnerName: data.partnerName,
      imageUrl: data.imageUrl,
    };

    this.requests.unshift(newReq);
    return newReq;
  }

  public updateStatus(
    id: string,
    status: CollectionRequest["status"],
    rejectionReason?: string
  ): CollectionRequest | null {
    const req = this.requests.find((r) => r.id === id);
    if (!req) return null;

    req.status = status;
    req.updatedAt = new Date().toISOString();
    if (rejectionReason) {
      req.rejectionReason = rejectionReason;
    }
    return req;
  }

  public verifyCollection(
    id: string,
    evidence: {
      verifiedBy: string;
      collectorName: string;
      collectorWardOrCenter: string;
      scaleReadingKg: number;
      contaminationDeductionKg: number;
      receiptNumber?: string;
      verificationNotes?: string;
    }
  ): CollectionRequest | null {
    const req = this.requests.find((r) => r.id === id);
    if (!req) return null;

    const netWeight = Math.max(
      0,
      Number((evidence.scaleReadingKg - evidence.contaminationDeductionKg).toFixed(2))
    );

    const fullEvidence: VerificationEvidence = {
      verifiedAt: new Date().toISOString(),
      verifiedBy: evidence.verifiedBy,
      collectorName: evidence.collectorName,
      collectorWardOrCenter: evidence.collectorWardOrCenter,
      receiptNumber:
        evidence.receiptNumber ||
        `RCP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
      scaleReadingKg: evidence.scaleReadingKg,
      contaminationDeductionKg: evidence.contaminationDeductionKg,
      netAcceptedWeightKg: netWeight,
      verificationNotes: evidence.verificationNotes || "Verified on certified physical scale.",
    };

    req.status = "accepted";
    req.evidence = fullEvidence;
    req.updatedAt = new Date().toISOString();
    return req;
  }

  public recordScan(): void {
    this.totalScansCount += 1;
  }

  public getImpactMetrics(): ImpactMetrics {
    return calculateImpactMetrics(this.totalScansCount, this.requests);
  }

  public resetDemoData(): void {
    this.requests = [...INITIAL_DEMO_REQUESTS];
    this.totalScansCount = 28;
  }
}

// Global variable to survive hot-reloading in dev mode
const globalForStore = globalThis as unknown as {
  ecoLoopStore: EcoLoopDataStore | undefined;
};

export const dataStore = globalForStore.ecoLoopStore ?? new EcoLoopDataStore();

if (process.env.NODE_ENV !== "production") {
  globalForStore.ecoLoopStore = dataStore;
}
