// src/components/RequestsSection.tsx — User Collection & Handover Requests List

"use client";

import React from "react";
import { CollectionRequest } from "@/types";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Scale,
  FileCheck,
  Plus,
  ShieldCheck,
  AlertOctagon,
  Building2,
} from "lucide-react";

interface RequestsSectionProps {
  requests: CollectionRequest[];
  lang: "en" | "ml";
  onOpenCreateModal: () => void;
}

export const RequestsSection: React.FC<RequestsSectionProps> = ({
  requests,
  lang,
  onOpenCreateModal,
}) => {
  const getStatusBadge = (status: CollectionRequest["status"]) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "Verified Accepted" : "സ്ഥിരീകരിച്ചു"}</span>
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "Scheduled" : "തീയതി നിശ്ചയിച്ചു"}</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "Pending Pickup" : "തീർപ്പുകൽപ്പിച്ചിട്ടില്ല"}</span>
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "Doorstep Rejected" : "നിരസിച്ചു"}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {lang === "en" ? "Waste Handover Requests" : "മാലിന്യ ശേഖരണ അഭ്യർത്ഥനകൾ"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lang === "en"
              ? "Track items from initial registration to physical collector scale weighing and verified certificate receipt."
              : "രജിസ്റ്റർ ചെയ്തത് മുതൽ തൂക്കി തിട്ടപ്പെടുത്തി രസീത് നൽകുന്നത് വരെയുള്ള സ്റ്റാറ്റസ്."}
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-emerald-600/25 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "en" ? "New Handover Request" : "പുതിയ അഭ്യർത്ഥന"}</span>
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold">
              {lang === "en" ? "No handover requests yet." : "അഭ്യർത്ഥനകളൊന്നും ലഭ്യമല്ല."}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "en"
                ? "Scan an item or click 'New Handover Request' to get started."
                : "സ്കാൻ ചെയ്ത ശേഷം പുതിയ അഭ്യർത്ഥന ആരംഭിക്കുക."}
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="glass-panel rounded-2xl p-5 border shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{req.id.slice(-6).toUpperCase()}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {lang === "en" ? req.categoryNameEn : req.categoryNameMl}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {req.itemDescription}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {req.userName} • {req.locality}, {req.district} • {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-1.5">
                  {getStatusBadge(req.status)}
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Est: {req.estimatedWeightKg} kg
                  </span>
                </div>
              </div>

              {/* Verified Evidence Box (if accepted) */}
              {req.status === "accepted" && req.evidence && (
                <div className="mt-2 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-200 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{lang === "en" ? "Verified Handover Certificate" : "പരിശോധനാ സർട്ടിഫിക്കറ്റ്"}</span>
                    </span>
                    <span className="font-mono text-[11px] bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded">
                      {req.evidence.receiptNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700 dark:text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-500 block">Verified Net Weight:</span>
                      <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">
                        {req.evidence.netAcceptedWeightKg} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Gross Scale Reading:</span>
                      <span className="font-bold">{req.evidence.scaleReadingKg} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Contamination Deducted:</span>
                      <span className="font-bold text-amber-600">
                        {req.evidence.contaminationDeductionKg} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Collector:</span>
                      <span className="font-bold">{req.evidence.collectorName}</span>
                    </div>
                  </div>

                  {req.evidence.verificationNotes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-1 border-t border-emerald-200 dark:border-emerald-900">
                      Note: &quot;{req.evidence.verificationNotes}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Rejection notice (if rejected) */}
              {req.status === "rejected" && req.rejectionReason && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-start space-x-2">
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Rejection Reason: </span>
                    {req.rejectionReason}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
