// src/components/CollectorPortal.tsx — Haritha Karma Sena / Municipal Verification Portal

"use client";

import React, { useState } from "react";
import { CollectionRequest } from "@/types";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Building2,
  Receipt,
  FileCheck2,
} from "lucide-react";

interface CollectorPortalProps {
  requests: CollectionRequest[];
  lang: "en" | "ml";
  onRefresh: () => void;
}

export const CollectorPortal: React.FC<CollectorPortalProps> = ({
  requests,
  lang,
  onRefresh,
}) => {
  const [pin, setPin] = useState("1234");
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Pre-authenticated for frictionless hackathon demo
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Form states for verification
  const [scaleReading, setScaleReading] = useState<string>("3.5");
  const [contaminationDeduction, setContaminationDeduction] = useState<string>("0.3");
  const [collectorName, setCollectorName] = useState("Saritha Kumari (HKS Ward Lead)");
  const [wardCenter, setWardCenter] = useState("Ward 14 MCF Centre, Kochi");
  const [notes, setNotes] = useState("Certified clean and dry material. Baled for road-tarring shredder.");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const pendingRequests = requests.filter(
    (r) => r.status === "pending" || r.status === "scheduled"
  );
  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId) return;

    setIsProcessing(true);
    setFeedbackMsg(null);

    try {
      const gross = parseFloat(scaleReading) || 0;
      const deduction = parseFloat(contaminationDeduction) || 0;

      const res = await fetch(`/api/requests/${selectedRequestId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          pin,
          scaleReadingKg: gross,
          contaminationDeductionKg: deduction,
          collectorName,
          collectorWardOrCenter: wardCenter,
          verificationNotes: notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to verify collection.");
      }

      // Trigger celebratory confetti for real landfill diversion!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#059669", "#34d399", "#047857"],
        });
      } catch {
        // Safe fallback if canvas not available
      }

      setFeedbackMsg({
        type: "success",
        text: `Successfully verified ${(gross - deduction).toFixed(2)} kg diverted from landfill! Evidence recorded.`,
      });

      setSelectedRequestId(null);
      onRefresh();
    } catch (err: unknown) {
      setFeedbackMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Verification error.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequestId || !rejectionReason.trim()) {
      setFeedbackMsg({
        type: "error",
        text: "Please provide a valid doorstep rejection reason.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/requests/${selectedRequestId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          pin,
          rejectionReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reject collection.");
      }

      setFeedbackMsg({
        type: "success",
        text: "Collection request formally rejected to preserve clean recycling stream.",
      });

      setSelectedRequestId(null);
      setRejectionReason("");
      onRefresh();
    } catch (err: unknown) {
      setFeedbackMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Rejection error.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black border border-amber-300 dark:border-amber-800 uppercase tracking-wider">
              Authorized Role
            </span>
            <span className="text-xs text-slate-500 font-mono">Demo PIN: 1234</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {lang === "en" ? "Haritha Karma Sena Collector Portal" : "ഹരിത കർമ്മ സേന അഡ്മിൻ പോർട്ടൽ"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lang === "en"
              ? "Weigh items on certified scales, inspect contamination, issue tamper-evident receipts, and authorize landfill diversion."
              : "തൂക്കം തിട്ടപ്പെടുത്തി, അഴുക്ക് കുറവ് ചെയ്ത്, യഥാർത്ഥ റീസൈക്ലിംഗ് രസീത് നൽകുന്ന പോർട്ടൽ."}
          </p>
        </div>

        {/* Auth lock toggle */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          {isAuthenticated ? (
            <>
              <Unlock className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300">Authorized Session</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-16 px-1.5 py-0.5 rounded border text-xs"
              />
              <button
                onClick={() => setIsAuthenticated(pin === "1234")}
                className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold"
              >
                Unlock
              </button>
            </>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center space-x-2 ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
              : "bg-rose-50 text-rose-800 border border-rose-300"
          }`}
        >
          {feedbackMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Grid: Pending Requests Queue on Left, Verification Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Pending Scale Verification ({pendingRequests.length})
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-slate-500 text-xs">
              All incoming requests have been verified or resolved!
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => {
                  setSelectedRequestId(req.id);
                  setScaleReading(req.estimatedWeightKg.toString());
                  setContaminationDeduction("0.2");
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRequestId === req.id
                    ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 shadow-sm ring-1 ring-emerald-500"
                    : "border-slate-200 dark:border-slate-800 glass-panel hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{req.id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">
                    {req.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                  {lang === "en" ? req.categoryNameEn : req.categoryNameMl}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {req.itemDescription}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span>{req.userName} ({req.locality})</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Est: {req.estimatedWeightKg} kg
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Physical Weighing & Evidence Record */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="glass-panel rounded-2xl p-6 border shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Physical Handover Inspection
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedRequest.categoryNameEn}
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  #{selectedRequest.id.slice(-6).toUpperCase()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Resident: </span>
                  {selectedRequest.userName} ({selectedRequest.userPhone})
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Declared Item: </span>
                  {selectedRequest.itemDescription}
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Location: </span>
                  {selectedRequest.locality}, {selectedRequest.district}
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-4 text-xs">
                {/* Weights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center space-x-1">
                      <Scale className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified Scale Reading (kg):</span>
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      required
                      value={scaleReading}
                      onChange={(e) => setScaleReading(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Contamination Deduction (kg):</span>
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={contaminationDeduction}
                      onChange={(e) => setContaminationDeduction(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 font-bold text-sm"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Non-recyclable caps, liquid, dirt
                    </span>
                  </div>
                </div>

                {/* Net Accepted Computed Live */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 font-bold text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Net Verified Weight to Divert:</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {Math.max(0, (parseFloat(scaleReading) || 0) - (parseFloat(contaminationDeduction) || 0)).toFixed(2)} kg
                  </span>
                </div>

                {/* Officer & Center Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Collector / Operator Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={collectorName}
                      onChange={(e) => setCollectorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      MCF Center / Ward:
                    </label>
                    <input
                      type="text"
                      required
                      value={wardCenter}
                      onChange={(e) => setWardCenter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Auditable Handover Notes:
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Rejection input popover toggle */}
                  <div className="w-full sm:w-auto flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Reason to reject (if dirty)..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs w-48"
                    />
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={isProcessing || !rejectionReason.trim()}
                      className="px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold hover:bg-rose-200 disabled:opacity-50 cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>

                  {/* Accept & Verify Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isProcessing ? "Recording Audit..." : "Verify & Issue Receipt"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 border">
              <FileCheck2 className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Select a collection request from the queue
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Select any pending or scheduled item on the left to inspect its declared weight, record certified scale readings, and authorize real landfill diversion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
