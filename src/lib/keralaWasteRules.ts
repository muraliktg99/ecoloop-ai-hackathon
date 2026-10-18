// src/lib/keralaWasteRules.ts — Curated Kerala Waste Management Rules & Directory

import { WasteCategory, HandlingGuidance, RecoveryPartner } from "@/types";

export interface CategoryInfo {
  category: WasteCategory;
  nameEn: string;
  nameMl: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  defaultGuidance: HandlingGuidance;
}

export const KERALA_WASTE_CATEGORIES: Record<WasteCategory, CategoryInfo> = {
  dry_recyclable_plastic: {
    category: "dry_recyclable_plastic",
    nameEn: "Recyclable Rigid Plastic (PET / HDPE)",
    nameMl: "പുനരുപയോഗിക്കാവുന്ന പ്ലാസ്റ്റിക് (കുപ്പികൾ, കാനുകൾ)",
    color: "#059669",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/50",
    badgeText: "text-emerald-800 dark:text-emerald-300",
    defaultGuidance: {
      cleaningRequired: true,
      dryingRequired: true,
      storageMethodEn: "Rinse clean, compress/flatten to save space, store dry in dedicated dry-waste sack.",
      storageMethodMl: "കഴുകി വൃത്തിയാക്കി ഉണക്കി പരത്തി വയ്ക്കുക. ഉണങ്ങിയ ചാക്കിൽ സൂക്ഷിക്കുക.",
      actionStepEn: "Hand over to Haritha Karma Sena during monthly plastic collection or drop at ward MCF.",
      actionStepMl: "മാസത്തിലെ പ്ലാസ്റ്റിക് ശേഖരണ ദിനത്തിൽ ഹരിത കർമ്മ സേനയ്ക്ക് കൈമാറുക.",
      localAcceptanceRuleEn: "Must be free from milk, oil, and food residue. Caps and labels can remain attached.",
      localAcceptanceRuleMl: "എണ്ണ, പാൽ അംശങ്ങൾ പാടില്ല. മൂടിയും ലേബലും മാറ്റേണ്ടതില്ല.",
      ruleProvenance: "Suchitwa Mission Kerala Dry Waste Protocol 2024 (Section 3.1)",
    },
  },
  dry_multilayer_plastic: {
    category: "dry_multilayer_plastic",
    nameEn: "Multilayer Packaging / Flexible Plastic (MLP)",
    nameMl: "മൾട്ടിലെയർ പ്ലാസ്റ്റിക് / കവറുകൾ (ചിപ്സ്, പാൽ കവർ)",
    color: "#d97706",
    badgeBg: "bg-amber-100 dark:bg-amber-950/50",
    badgeText: "text-amber-800 dark:text-amber-300",
    defaultGuidance: {
      cleaningRequired: true,
      dryingRequired: true,
      storageMethodEn: "Wash inside with soap water, cut open, dry thoroughly before bundling.",
      storageMethodMl: "അകം സോപ്പ് വെള്ളത്തിൽ കഴുകി, കീറി വെയിലത്ത് വെച്ച് ഉണക്കുക.",
      actionStepEn: "Clean Kerala Company accepts clean MLP for shredding and road-surfacing (tar-plastic blending).",
      actionStepMl: "റോഡ് ടാറിംഗിനായുള്ള ഷ്രെഡ്ഡിംഗിന് ക്ലീൻ കേരള കമ്പനി ശേഖരിക്കുന്നു.",
      localAcceptanceRuleEn: "Wet or unwashed milk packets and food wrappers cause foul odor and will be rejected at MCF.",
      localAcceptanceRuleMl: "കഴുകാത്തതോ ഈർപ്പമുള്ളതോ ആയ കവറുകൾ ദുർഗന്ധം വമിക്കുന്നതിനാൽ സ്വീകരിക്കില്ല.",
      ruleProvenance: "Clean Kerala Company Ltd (CKCL) Shredded Polymer Road-Tar Guidelines",
    },
  },
  dry_recyclable_paper: {
    category: "dry_recyclable_paper",
    nameEn: "Paper & Cardboard",
    nameMl: "പേപ്പർ & കാർഡ്ബോർഡ്",
    color: "#2563eb",
    badgeBg: "bg-blue-100 dark:bg-blue-950/50",
    badgeText: "text-blue-800 dark:text-blue-300",
    defaultGuidance: {
      cleaningRequired: false,
      dryingRequired: true,
      storageMethodEn: "Flatten corrugated boxes, bundle newspapers tightly with string, keep away from rain/moisture.",
      storageMethodMl: "കാർഡ്ബോർഡ് പെട്ടികൾ പരത്തി കെട്ടിവെക്കുക. നനവ് തട്ടാതെ സൂക്ഷിക്കുക.",
      actionStepEn: "Handover to authorized scrap merchants or Haritha Karma Sena paper collection week.",
      actionStepMl: "ഹരിത കർമ്മ സേനയ്ക്കോ അംഗീകൃത ആക്രിക്കടകൾക്കോ നൽകുക.",
      localAcceptanceRuleEn: "Pizza boxes soaked with oil/cheese cannot be recycled; tear off and compost oily sections.",
      localAcceptanceRuleMl: "എണ്ണ പുരണ്ട പിസ്സ ബോക്സുകൾ റീസൈക്കിൾ ചെയ്യാൻ കഴിയില്ല; അവ കമ്പോസ്റ്റിലേക്ക് മാറ്റുക.",
      ruleProvenance: "Kerala State Pollution Control Board Recycling Directives",
    },
  },
  dry_recyclable_glass: {
    category: "dry_recyclable_glass",
    nameEn: "Glass Bottles & Jars",
    nameMl: "ഗ്ലാസ് കുപ്പികൾ",
    color: "#0891b2",
    badgeBg: "bg-cyan-100 dark:bg-cyan-950/50",
    badgeText: "text-cyan-800 dark:text-cyan-300",
    defaultGuidance: {
      cleaningRequired: true,
      dryingRequired: false,
      storageMethodEn: "Rinse bottles, remove metal caps, store unbroken in sturdy crates or carton boxes.",
      storageMethodMl: "കുപ്പികൾ കഴുകി അടപ്പുകൾ മാറ്റി സൂക്ഷിക്കുക. പൊട്ടാതെ പെട്ടിയിൽ വെക്കുക.",
      actionStepEn: "Hand over during designated glass collection drives (held once every 3 months in most LSGIs).",
      actionStepMl: "തദ്ദേശ സ്ഥാപനങ്ങളിൽ 3 മാസത്തിലൊരിക്കൽ നടക്കുന്ന ഗ്ലാസ് ശേഖരണത്തിൽ നൽകുക.",
      localAcceptanceRuleEn: "Broken glass must be safely wrapped in newspaper and labeled clearly to protect sanitation workers.",
      localAcceptanceRuleMl: "പൊട്ടിയ കുപ്പികൾ തൊഴിലാളികൾക്ക് അപകടമുണ്ടാക്കാത്ത വിധം പേപ്പറിൽ പൊതിഞ്ഞു നൽകുക.",
      ruleProvenance: "Suchitwa Mission Glass Waste Handling Standard Operating Procedure",
    },
  },
  dry_recyclable_metal: {
    category: "dry_recyclable_metal",
    nameEn: "Metal & Aluminium Cans",
    nameMl: "മെറ്റൽ & അലുമിനിയം ടിന്നുകൾ",
    color: "#475569",
    badgeBg: "bg-slate-200 dark:bg-slate-800",
    badgeText: "text-slate-800 dark:text-slate-200",
    defaultGuidance: {
      cleaningRequired: true,
      dryingRequired: true,
      storageMethodEn: "Rinse tin/aluminium cans clean. Flatten if possible. High commercial scrap value.",
      storageMethodMl: "ടിന്നുകൾ കഴുകി വൃത്തിയാക്കുക. കൂടുതൽ മൂല്യമുള്ള ആക്രി വിഭാഗമാണ്.",
      actionStepEn: "Direct sale to registered scrap merchants or handover to Haritha Karma Sena metal drive.",
      actionStepMl: "രജിസ്റ്റർ ചെയ്ത ആക്രിക്കടകളിലോ ഹരിത കർമ്മ സേനയ്ക്കോ നൽകാം.",
      localAcceptanceRuleEn: "Paint cans and chemical containers must be completely dry and devoid of solvent fumes.",
      localAcceptanceRuleMl: "പെയിന്റ് ടിന്നുകളിൽ രാസവസ്തുക്കളുടെ അംശം പൂർണ്ണമായും ഉണങ്ങിയിരിക്കണം.",
      ruleProvenance: "Kerala Scrap Merchants Association & Municipal Recycling Manual",
    },
  },
  wet_biodegradable: {
    category: "wet_biodegradable",
    nameEn: "Biodegradable Organic Waste",
    nameMl: "ജൈവമാലിന്യം (ഭക്ഷണാവശിഷ്ടങ്ങൾ)",
    color: "#16a34a",
    badgeBg: "bg-green-100 dark:bg-green-950/50",
    badgeText: "text-green-800 dark:text-green-300",
    defaultGuidance: {
      cleaningRequired: false,
      dryingRequired: false,
      storageMethodEn: "Do not store for more than 24 hours. Manage at source.",
      storageMethodMl: "24 മണിക്കൂറിൽ കൂടുതൽ സൂക്ഷിക്കരുത്. ഉറവിടത്തിൽ തന്നെ സംസ്കരിക്കുക.",
      actionStepEn: "Process at source using household Pipe Compost, Pot Compost, Ring Compost, or Kitchen Bio-gas plant.",
      actionStepMl: "പൈപ്പ് കമ്പോസ്റ്റ്, പോട്ട് കമ്പോസ്റ്റ് അല്ലെങ്കിൽ ബയോഗ്യാസ് വഴി ഉറവിടത്തിൽ സംസ്കരിക്കുക.",
      localAcceptanceRuleEn: "Municipal collection of wet waste is strictly prohibited in most Kerala Panchayats/Municipalities under decentralized waste laws.",
      localAcceptanceRuleMl: "കേരളത്തിൽ ജൈവമാലിന്യം റോഡിലോ പൊതുസ്ഥലത്തോ തള്ളുന്നത് കടുത്ത നിയമലംഘനമാണ്.",
      ruleProvenance: "Kerala Solid Waste Management Rules 2016 (Source Treatment Mandatory)",
    },
  },
  domestic_hazardous_ewaste: {
    category: "domestic_hazardous_ewaste",
    nameEn: "E-Waste & Domestic Hazardous",
    nameMl: "ഇ-മാലിന്യം & അപകടകരമായ വസ്തുക്കൾ (ബാറ്ററി, സി.എഫ്.എൽ)",
    color: "#dc2626",
    badgeBg: "bg-red-100 dark:bg-red-950/50",
    badgeText: "text-red-800 dark:text-red-300",
    defaultGuidance: {
      cleaningRequired: false,
      dryingRequired: false,
      storageMethodEn: "Store in a dry box out of reach of children. Tape battery terminals with tape to prevent short circuits.",
      storageMethodMl: "കുട്ടികൾക്ക് കിട്ടാത്ത വിധം സുരക്ഷിതമായി വെക്കുക. ബാറ്ററി ടെർമിനലുകളിൽ ടേപ്പ് ഒട്ടിക്കുക.",
      actionStepEn: "Deposit at Clean Kerala Company authorized E-waste collection bins or semi-annual HKS collection.",
      actionStepMl: "ക്ലീൻ കേരള കമ്പനിയുടെ ഇ-വേസ്റ്റ് ശേഖരണ കേന്ദ്രത്തിലോ ഹരിതകർമ്മസേനക്കോ നൽകുക.",
      localAcceptanceRuleEn: "Never mix with regular dry waste or burn. Lithium batteries present high fire risk.",
      localAcceptanceRuleMl: "തീയിടാനോ സാധാരണ മാലിന്യത്തിൽ കലർത്താനോ പാടില്ല. ബാറ്ററി കത്താൻ സാധ്യതയുണ്ട്.",
      ruleProvenance: "E-Waste (Management) Rules 2022 & CPCB Guidelines",
      dangerWarning: "Hazardous: Contains heavy metals/electrolyte. Do not puncture or burn.",
    },
  },
  sanitary_medical: {
    category: "sanitary_medical",
    nameEn: "Sanitary & Medical Waste",
    nameMl: "സാനിറ്ററി & മെഡിക്കൽ മാലിന്യം",
    color: "#9333ea",
    badgeBg: "bg-purple-100 dark:bg-purple-950/50",
    badgeText: "text-purple-800 dark:text-purple-300",
    defaultGuidance: {
      cleaningRequired: false,
      dryingRequired: false,
      storageMethodEn: "Wrap securely in multiple layers of newspaper and mark with a red cross indicator.",
      storageMethodMl: "പത്രക്കടലാസിൽ ഭംഗിയായി പൊതിഞ്ഞ് ചുവന്ന അടയാളം രേഖപ്പെടുത്തുക.",
      actionStepEn: "Handover to authorized biomedical waste incinerator operators (IMAGE / Suchitwa Mission sanctioned units).",
      actionStepMl: "ഇമേജ് (IMAGE) അല്ലെങ്കിൽ അംഗീകൃത മെഡിക്കൽ മാലിന്യ നിർമ്മാർജ്ജന സേവനങ്ങൾക്ക് നൽകുക.",
      localAcceptanceRuleEn: "Must never be discarded with regular recyclables. Sanitary waste requires high-temperature incineration.",
      localAcceptanceRuleMl: "സാധാരണ പ്ലാസ്റ്റിക്കിനൊപ്പം നൽകരുത്. ഇൻസിനറേറ്റർ വഴി മാത്രമേ സംസ്കരിക്കാവൂ.",
      ruleProvenance: "Bio-Medical Waste Management Rules 2016 (IMAGE Kerala Protocol)",
      dangerWarning: "Biohazard: Wrap tightly in paper, never touch without gloves.",
    },
  },
  other_unclassified: {
    category: "other_unclassified",
    nameEn: "Unclassified / Composite Material",
    nameMl: "തിരിച്ചറിയാത്ത / സമ്മിശ്ര വസ്തുക്കൾ",
    color: "#6b7280",
    badgeBg: "bg-gray-100 dark:bg-gray-800",
    badgeText: "text-gray-800 dark:text-gray-300",
    defaultGuidance: {
      cleaningRequired: false,
      dryingRequired: true,
      storageMethodEn: "Keep isolated and dry until material components can be identified.",
      storageMethodMl: "വസ്തുവിന്റെ ഘടന വ്യക്തമാകുന്നതുവരെ ഉണക്കി വെക്കുക.",
      actionStepEn: "Consult the local Haritha Karma Sena supervisor or Ward Member for inspection.",
      actionStepMl: "വാർഡ് ഹരിത കർമ്മ സേന സൂപ്പർവൈസറുമായി ബന്ധപ്പെട്ട് പരിശോധിക്കുക.",
      localAcceptanceRuleEn: "When composition is uncertain, verify acceptance before booking collection.",
      localAcceptanceRuleMl: "സ്വീകാര്യത സ്ഥിരീകരിച്ച ശേഷം മാത്രം ശേഖരണം ബുക്ക് ചെയ്യുക.",
      ruleProvenance: "Kerala Local Self Government Department (LSGD) Advisory",
    },
  },
};

export const KERALA_RECOVERY_PARTNERS: RecoveryPartner[] = [
  {
    id: "hks-ernakulam-central",
    name: "Haritha Karma Sena — Kochi Municipal Corporation",
    nameMl: "ഹരിത കർമ്മ സേന — കൊച്ചി കോർപ്പറേഷൻ",
    type: "haritha_karma_sena",
    district: "Ernakulam",
    locality: "Marine Drive & Central Kochi (Ward 12-16)",
    acceptedCategories: [
      "dry_recyclable_plastic",
      "dry_multilayer_plastic",
      "dry_recyclable_paper",
      "dry_recyclable_glass",
      "dry_recyclable_metal",
      "domestic_hazardous_ewaste",
    ],
    collectionScheduleEn: "Door-to-door on 1st & 3rd Wednesday of every month. User fee: ₹50/month.",
    collectionScheduleMl: "എല്ലാ മാസവും 1, 3 ബുധനാഴ്ചകളിൽ വീടുകളിൽ നിന്ന് ശേഖരിക്കുന്നു. പ്രതിമാസ ഫീസ്: ₹50.",
    contactNumber: "+91 484 2369007",
    address: "Kochi Municipal Corporation Ward Office, Ernakulam, Kerala 682011",
    isOfficialPartner: true,
    notes: "Official LSGD women empowerment waste collection consortium under Kudumbashree.",
  },
  {
    id: "ckcl-kalamassery-rrf",
    name: "Clean Kerala Company Ltd (CKCL) — Resource Recovery Facility",
    nameMl: "ക്ലീൻ കേരള കമ്പനി ലിമിറ്റഡ് — റിസോഴ്സ് റിക്കവറി ഫെസിലിറ്റി",
    type: "clean_kerala_co",
    district: "Ernakulam",
    locality: "Kalamassery Industrial Estate",
    acceptedCategories: [
      "dry_multilayer_plastic",
      "dry_recyclable_plastic",
      "domestic_hazardous_ewaste",
    ],
    collectionScheduleEn: "Bulk drop-off Mon-Sat: 9:00 AM - 5:00 PM. Baling & shredding operations.",
    collectionScheduleMl: "തിങ്കൾ-ശനി രാവിലെ 9 മുതൽ വൈകിട്ട് 5 വരെ ബൾക്ക് ഡ്രോപ്പ്-ഓഫ് സൗകര്യം.",
    contactNumber: "+91 484 2555123",
    address: "Plot 42, HMT Industrial Area, Kalamassery, Ernakulam, Kerala 683503",
    isOfficialPartner: true,
    notes: "State Government undertaking processing non-recyclable plastics for road tarring.",
  },
  {
    id: "hks-tvm-corporation",
    name: "Haritha Karma Sena — Thiruvananthapuram Corporation",
    nameMl: "ഹരിത കർമ്മ സേന — തിരുവനന്തപുരം നഗരസഭ",
    type: "haritha_karma_sena",
    district: "Thiruvananthapuram",
    locality: "Palayam & Kowdiar Wards",
    acceptedCategories: [
      "dry_recyclable_plastic",
      "dry_multilayer_plastic",
      "dry_recyclable_paper",
      "dry_recyclable_glass",
      "dry_recyclable_metal",
      "domestic_hazardous_ewaste",
    ],
    collectionScheduleEn: "Door-to-door alternate Thursdays. Specialized glass collection on quarter end.",
    collectionScheduleMl: "രണ്ട് ആഴ്ചയിലൊരിക്കൽ വ്യാഴാഴ്ചകളിൽ. 3 മാസത്തിലൊരിക്കൽ ഗ്ലാസ് ശേഖരണം.",
    contactNumber: "+91 471 2377700",
    address: "Corporation Building, LMS Compound, Palayam, Thiruvananthapuram 695033",
    isOfficialPartner: true,
    notes: "Zero Waste Capital campaign partner with centralized Material Collection Facility (MCF).",
  },
  {
    id: "scrap-guild-ernakulam",
    name: "Kerala Scrap Recyclers Guild — Authorised Collection Hub",
    nameMl: "കേരള സ്ക്രാപ്പ് റീസൈക്ലേഴ്സ് ഗിൽഡ് — അംഗീകൃത ആക്രി കേന്ദ്രം",
    type: "scrap_dealer",
    district: "Ernakulam",
    locality: "Kaloor & Edappally",
    acceptedCategories: [
      "dry_recyclable_metal",
      "dry_recyclable_paper",
      "dry_recyclable_plastic",
      "dry_recyclable_glass",
    ],
    collectionScheduleEn: "Immediate cash payout per kg on verified scales. Mon-Sun: 8:00 AM - 8:00 PM.",
    collectionScheduleMl: "കൃത്യമായ തുലാസിൽ തൂക്കി ഉടനടി പണം നൽകുന്നു. ദിവസവും 8:00 AM - 8:00 PM.",
    contactNumber: "+91 94470 12345",
    address: "Near Kaloor Metro Station, Banerji Road, Ernakulam, Kerala 682017",
    isOfficialPartner: false,
    notes: "Verified private scrap merchant network supporting commercial recovery with fair weight rates.",
  },
  {
    id: "kudumbashree-community-compost",
    name: "Kudumbashree Community Aerobic Composting Cluster",
    nameMl: "കുടുംബശ്രീ എയറോബിക് കമ്പോസ്റ്റിംഗ് ക്ലസ്റ്റർ",
    type: "community_compost",
    district: "Ernakulam",
    locality: "Kakkanad & Thrikkakara",
    acceptedCategories: ["wet_biodegradable"],
    collectionScheduleEn: "Drop-off daily: 6:30 AM - 9:30 AM for residential organic kitchen waste.",
    collectionScheduleMl: "ദിവസവും രാവിലെ 6:30 മുതൽ 9:30 വരെ വീടുകളിലെ ജൈവമാലിന്യം സ്വീകരിക്കുന്നു.",
    contactNumber: "+91 484 2422001",
    address: "Near Civil Station Park, Kakkanad, Kochi, Kerala 682030",
    isOfficialPartner: true,
    notes: "Aerobic compost bins producing organic nutrient compost for local kitchen farming.",
  },
];

export function getGuidanceForCategory(
  category: WasteCategory,
  contaminationDetected: boolean = false
): HandlingGuidance {
  const info = KERALA_WASTE_CATEGORIES[category] || KERALA_WASTE_CATEGORIES.other_unclassified;
  const baseGuidance = { ...info.defaultGuidance };

  if (contaminationDetected) {
    baseGuidance.cleaningRequired = true;
    baseGuidance.storageMethodEn = `CONTAMINATION ALERT: Food, grease, or chemical residue detected! ${baseGuidance.storageMethodEn}`;
    baseGuidance.storageMethodMl = `ശ്രദ്ധിക്കുക: മാലിന്യത്തിൽ അഴുക്കോ എണ്ണയോ കണ്ടെത്തി! പൂർണ്ണമായി കഴുകി വൃത്തിയാക്കിയ ശേഷം മാത്രം മാറ്റുക.`;
    baseGuidance.localAcceptanceRuleEn = `Uncleaned contaminated items will be strictly rejected by Haritha Karma Sena collectors to prevent contamination of the entire collection batch.`;
    baseGuidance.localAcceptanceRuleMl = `കഴുകാത്ത വസ്തുക്കൾ ഹരിത കർമ്മ സേന നിരസിക്കുന്നതാണ്.`;
  }

  return baseGuidance;
}

export function getEligiblePartners(category: WasteCategory): RecoveryPartner[] {
  return KERALA_RECOVERY_PARTNERS.filter((partner) =>
    partner.acceptedCategories.includes(category)
  );
}
