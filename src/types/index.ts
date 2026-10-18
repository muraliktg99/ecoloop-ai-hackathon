// src/types/index.ts — EcoLoop AI Domain Models & Schemas

export type WasteCategory =
  | 'dry_recyclable_plastic'
  | 'dry_recyclable_paper'
  | 'dry_recyclable_glass'
  | 'dry_recyclable_metal'
  | 'dry_multilayer_plastic'
  | 'wet_biodegradable'
  | 'domestic_hazardous_ewaste'
  | 'sanitary_medical'
  | 'other_unclassified';

export type UncertaintyLevel = 'low' | 'medium' | 'high';

export type RequestStatus =
  | 'pending'
  | 'scheduled'
  | 'collected'
  | 'accepted'
  | 'rejected'
  | 'cancelled';

export interface RecoveryPartner {
  id: string;
  name: string;
  nameMl: string;
  type: 'haritha_karma_sena' | 'clean_kerala_co' | 'mcf_rrf' | 'scrap_dealer' | 'community_compost';
  district: string;
  locality: string;
  acceptedCategories: WasteCategory[];
  collectionScheduleEn: string;
  collectionScheduleMl: string;
  contactNumber?: string;
  address: string;
  isOfficialPartner: boolean;
  notes: string;
}

export interface HandlingGuidance {
  cleaningRequired: boolean;
  dryingRequired: boolean;
  storageMethodEn: string;
  storageMethodMl: string;
  actionStepEn: string;
  actionStepMl: string;
  localAcceptanceRuleEn: string;
  localAcceptanceRuleMl: string;
  ruleProvenance: string; // e.g. "Suchitwa Mission Protocol 2024"
  dangerWarning?: string;
}

export interface ClassificationResult {
  scanId: string;
  itemDescriptionEn: string;
  itemDescriptionMl: string;
  category: WasteCategory;
  categoryNameEn: string;
  categoryNameMl: string;
  confidenceScore: number; // 0.0 to 1.0 (model-reported)
  uncertaintyLevel: UncertaintyLevel;
  uncertaintyReasonEn: string | null;
  uncertaintyReasonMl: string | null;
  contaminationDetected: boolean;
  contaminationNotesEn: string | null;
  contaminationNotesMl: string | null;
  requiresHumanReview: boolean;
  materialComposition: string;
  guidance: HandlingGuidance;
  eligiblePartners: RecoveryPartner[];
  analyzedAt: string;
  analysisMode: 'live_gemini' | 'simulated_demo';
  modelUsed?: string;
}

export interface VerificationEvidence {
  verifiedAt: string;
  verifiedBy: string; // Collector / Admin ID
  collectorName: string;
  collectorWardOrCenter: string;
  receiptNumber: string;
  scaleReadingKg: number;
  contaminationDeductionKg: number;
  netAcceptedWeightKg: number;
  verificationNotes: string;
  photoProofUrl?: string;
}

export interface CollectionRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  district: string;
  locality: string;
  category: WasteCategory;
  categoryNameEn: string;
  categoryNameMl: string;
  itemDescription: string;
  estimatedWeightKg: number;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  partnerId?: string;
  partnerName?: string;
  rejectionReason?: string;
  evidence?: VerificationEvidence;
}

export interface ImpactMetrics {
  totalScans: number;
  totalRequests: number;
  totalEstimatedKg: number;
  verifiedAcceptedKg: number;
  divertedLandfillKg: number;
  avoidedGhgKgCo2e: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  verificationRatePercent: number;
  categoryBreakdown: Record<WasteCategory, { count: number; weightKg: number }>;
  lastCalculatedAt: string;
}
