// src/components/GuidanceCard.tsx — Classification Results, Uncertainty & Kerala Guidance Card

"use client";

import React from "react";
import { ClassificationResult } from "@/types";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  Droplets,
  Wind,
} from "lucide-react";

interface GuidanceCardProps {
  result: ClassificationResult;
  lang: "en" | "ml";
  onCreateRequest: (result: ClassificationResult) => void;
}

export const GuidanceCard: React.FC<GuidanceCardProps> = ({
  result,
  lang,
  onCreateRequest,
}) => {
  const isCertain = result.uncertaintyLevel === "low";
  const confidencePercent = Math.round(result.confidenceScore * 100);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header: Category & Certainty */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>
                {result.analysisMode === "live_gemini" ? "Gemini 2.5 Vision" : "AI Verification Engine"}
              </span>
            </span>

            {result.contaminationDetected && (
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{lang === "en" ? "Contamination Alert" : "അഴുക്ക് കണ്ടെത്തി"}</span>
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {lang === "en" ? result.categoryNameEn : result.categoryNameMl}
          </h3>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
            {lang === "en" ? result.itemDescriptionEn : result.itemDescriptionMl}
          </p>
        </div>

        {/* Confidence & Uncertainty Score Card */}
        <div className="text-right">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-semibold">
              {lang === "en" ? "Certainty:" : "കൃത്യത:"}
            </span>
            <span
              className={`text-sm font-black ${
                isCertain
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {confidencePercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 capitalize">
            {lang === "en" ? `${result.uncertaintyLevel} Uncertainty` : `${result.uncertaintyLevel} സംശയം`}
          </p>
        </div>
      </div>

      {/* Uncertainty Notice / Explanation */}
      {result.uncertaintyReasonEn && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {lang === "en" ? "Uncertainty Explanation: " : "പരിശോധനാ വിശദീകരണം: "}
            </span>
            {lang === "en" ? result.uncertaintyReasonEn : result.uncertaintyReasonMl}
          </div>
        </div>
      )}

      {/* Preparation Instructions Grid */}
      <div className="mt-6">
        <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{lang === "en" ? "Mandatory Preparation Protocol" : "തയ്യാറാക്കേണ്ട രീതി"}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Cleaning card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>{lang === "en" ? "Cleaning & Washing" : "കഴുകി വൃത്തിയാക്കൽ"}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              {result.guidance.cleaningRequired
                ? lang === "en"
                  ? "Required: Rinse away food, sugar, or oil residue completely. Unwashed items contaminate collection sacks."
                  : "നിർബന്ധം: എണ്ണ, പാൽ, ഭക്ഷണ അവശിഷ്ടങ്ങൾ പൂർണ്ണമായി കഴുകി മാറ്റുക."
                : lang === "en"
                ? "Not required: Keep dry and clean from external moisture."
                : "കഴുകേണ്ടതില്ല: നനവ് തട്ടാതെ സൂക്ഷിക്കുക."}
            </p>
          </div>

          {/* Drying & Storage card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Wind className="w-4 h-4 text-teal-500" />
              <span>{lang === "en" ? "Drying & Safe Storage" : "ഉണക്കി സൂക്ഷിക്കൽ"}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              {lang === "en" ? result.guidance.storageMethodEn : result.guidance.storageMethodMl}
            </p>
          </div>
        </div>
      </div>

      {/* Kerala Local Self Government Acceptance Rule & Provenance */}
      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
          <span className="flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === "en" ? "Kerala Municipal Acceptance Rule" : "തദ്ദേശ സ്വയംഭരണ ചട്ടം"}</span>
          </span>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded font-mono">
            {result.guidance.ruleProvenance}
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
          {lang === "en"
            ? result.guidance.localAcceptanceRuleEn
            : result.guidance.localAcceptanceRuleMl}
        </p>
      </div>

      {/* Eligible Recovery Partners in Kerala */}
      {result.eligiblePartners.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === "en"
                ? "Authorized Kerala Recovery Facilities"
                : "അംഗീകൃത പുനരുപയോഗ കേന്ദ്രങ്ങൾ"}
            </span>
          </h4>

          <div className="space-y-2.5">
            {result.eligiblePartners.slice(0, 2).map((partner) => (
              <div
                key={partner.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {lang === "en" ? partner.name : partner.nameMl}
                    </span>
                    {partner.isOfficialPartner && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold dark:bg-emerald-950 dark:text-emerald-300">
                        Official LSGD
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {lang === "en" ? partner.collectionScheduleEn : partner.collectionScheduleMl}
                    </span>
                  </p>
                </div>

                {partner.contactNumber && (
                  <a
                    href={`tel:${partner.contactNumber}`}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 self-start sm:self-auto font-medium"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{partner.contactNumber}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer: Create Handover Request */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 max-w-md">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {lang === "en" ? "Next Practical Step: " : "തുടർനടപടി: "}
          </span>
          {lang === "en" ? result.guidance.actionStepEn : result.guidance.actionStepMl}
        </div>

        <button
          onClick={() => onCreateRequest(result)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all hover:scale-102 cursor-pointer"
        >
          <span>{lang === "en" ? "Schedule Handover Request" : "ശേഖരണത്തിനായി ബുക്ക് ചെയ്യുക"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
