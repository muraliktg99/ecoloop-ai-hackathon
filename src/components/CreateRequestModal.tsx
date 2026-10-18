// src/components/CreateRequestModal.tsx — Handover Request Form Modal

"use client";

import React, { useState } from "react";
import { ClassificationResult, WasteCategory } from "@/types";
import { KERALA_RECOVERY_PARTNERS } from "@/lib/keralaWasteRules";
import { X, Send, CheckCircle2, Building2 } from "lucide-react";

interface CreateRequestModalProps {
  initialData?: ClassificationResult | null;
  lang: "en" | "ml";
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  initialData,
  lang,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [userName, setUserName] = useState("Anjali Menon");
  const [userPhone, setUserPhone] = useState("+91 98470 11223");
  const [district, setDistrict] = useState("Ernakulam");
  const [locality, setLocality] = useState("Marine Drive, Ward 14");
  const [category, setCategory] = useState<WasteCategory>(
    initialData?.category || "dry_recyclable_plastic"
  );
  const [itemDescription, setItemDescription] = useState(
    initialData?.itemDescriptionEn || "Household clean recyclable waste"
  );
  const [estimatedWeightKg, setEstimatedWeightKg] = useState("2.5");
  const [selectedPartnerId, setSelectedPartnerId] = useState(
    initialData?.eligiblePartners[0]?.id || "hks-ernakulam-central"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const partner = KERALA_RECOVERY_PARTNERS.find((p) => p.id === selectedPartnerId);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userPhone,
          district,
          locality,
          category,
          categoryNameEn: initialData?.categoryNameEn || "Recyclable Waste",
          categoryNameMl: initialData?.categoryNameMl || "മാലിന്യം",
          itemDescription,
          estimatedWeightKg: parseFloat(estimatedWeightKg) || 1.0,
          partnerId: partner?.id,
          partnerName: partner?.name,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create request.");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Submission error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel rounded-2xl max-w-lg w-full p-6 sm:p-8 border shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="flex items-center space-x-2 text-emerald-600 mb-1">
          <Building2 className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {lang === "en" ? "Haritha Karma Sena Collection Booking" : "ഹരിത കർമ്മ സേന ശേഖരണ ബുക്കിംഗ്"}
          </span>
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          {lang === "en" ? "Create Handover Request" : "മാലിന്യ ശേഖരണ അഭ്യർത്ഥന"}
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          {lang === "en"
            ? "Your request will be recorded for pickup or drop-off at your local Ward MCF."
            : "നിങ്ങളുടെ പ്രദേശത്തെ വാർഡ് ശേഖരണ കേന്ദ്രത്തിലേക്ക് അഭ്യർത്ഥന രേഖപ്പെടുത്തുന്നു."}
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === "en" ? "Resident Name:" : "പേര്:"}
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === "en" ? "Phone Number:" : "ഫോൺ നമ്പർ:"}
              </label>
              <input
                type="tel"
                required
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === "en" ? "District:" : "ജില്ല:"}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
              >
                <option value="Ernakulam">Ernakulam (എറണാകുളം)</option>
                <option value="Thiruvananthapuram">Thiruvananthapuram (തിരുവനന്തപുരം)</option>
                <option value="Kozhikode">Kozhikode (കോഴിക്കോട്)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === "en" ? "Locality / Ward:" : "പ്രദേശം / വാർഡ്:"}
              </label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {lang === "en" ? "Item Description:" : "വിവരണം:"}
            </label>
            <input
              type="text"
              required
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === "en" ? "Estimated Weight (kg):" : "കണക്കാക്കുന്ന ഭാരം (കി.ഗ്രാം):"}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={estimatedWeightKg}
                onChange={(e) => setEstimatedWeightKg(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === "en" ? "Target Recovery Partner:" : "ശേഖരണ ഏജൻസി:"}
              </label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80"
              >
                {KERALA_RECOVERY_PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === "en" ? "Cancel" : "റദ്ദാക്കുക"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting..." : lang === "en" ? "Submit Request" : "സമർപ്പിക്കുക"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
