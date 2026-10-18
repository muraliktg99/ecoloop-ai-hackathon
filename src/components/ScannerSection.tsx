// src/components/ScannerSection.tsx — AI Waste Scanner & Multimodal Vision Interface

"use client";

import React, { useState, useRef } from "react";
import { ClassificationResult } from "@/types";
import { SAMPLE_WASTE_ITEMS } from "@/lib/geminiService";
import { GuidanceCard } from "./GuidanceCard";
import {
  Upload,
  Camera,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileText,
  X,
  Check,
} from "lucide-react";

interface ScannerSectionProps {
  lang: "en" | "ml";
  onCreateRequest: (result: ClassificationResult) => void;
}

export const ScannerSection: React.FC<ScannerSectionProps> = ({
  lang,
  onCreateRequest,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [userDescription, setUserDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and conversion to base64 preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Image file exceeds 10MB limit. Please upload a smaller photo.");
        return;
      }
      setSelectedFile(file);
      setSelectedSampleId(null);
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick selection of curated Kerala waste samples
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_WASTE_ITEMS.find((s) => s.id === sampleId);
    if (!sample) return;

    setSelectedSampleId(sampleId);
    setSelectedFile(null);
    setPreviewUrl(sample.imageUrl);
    setUserDescription(sample.description);
    setErrorMessage(null);
    setResult(null);
  };

  // Reset scanner state
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedSampleId(null);
    setUserDescription("");
    setResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Execute classification API call
  const handleAnalyze = async () => {
    if (!previewUrl && !userDescription.trim() && !selectedSampleId) {
      setErrorMessage("Please select a sample item or upload a waste photograph first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setResult(null);

    // Dynamic reasoning steps
    setAnalysisStep(
      lang === "en" ? "Processing image features & resin cues..." : "ചിത്രത്തിലെ ഘടകങ്ങൾ പരിശോധിക്കുന്നു..."
    );

    try {
      setTimeout(() => {
        setAnalysisStep(
          lang === "en"
            ? "Running Google Gemini 2.5 multimodal reasoning..."
            : "ഗൂഗിൾ ജെമിനി എ.ഐ വിശകലനം നടത്തുന്നു..."
        );
      }, 700);

      setTimeout(() => {
        setAnalysisStep(
          lang === "en"
            ? "Verifying Kerala Suchitwa Mission & HKS protocols..."
            : "കേരള ശുചിത്വ മിഷൻ ചട്ടങ്ങൾ പരിശോധിക്കുന്നു..."
        );
      }, 1400);

      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: previewUrl?.startsWith("data:") ? previewUrl : undefined,
          imageMimeType: selectedFile?.type || "image/jpeg",
          userDescription: userDescription.trim() || undefined,
          selectedSampleId: selectedSampleId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze waste item.");
      }

      setResult(data.result);
    } catch (err: unknown) {
      console.error("Analysis error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Error analyzing waste item. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {lang === "en"
              ? "Multimodal Waste Identification & Verified Recovery"
              : "എ.ഐ മാലിന്യ വർഗ്ഗീകരണവും ഉറപ്പായ പുനരുപയോഗവും"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          {lang === "en" ? (
            <>
              Turn Household Waste into{" "}
              <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Verified Value
              </span>
            </>
          ) : (
            <>
              മാലിന്യങ്ങൾ തരംതിരിച്ച്{" "}
              <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                മൂല്യമുള്ളതാക്കാം
              </span>
            </>
          )}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
          {lang === "en"
            ? "Upload a photo or select an item. Gemini analyzes the polymer/material composition, warns of contamination, applies Kerala municipal guidelines, and routes to verified recovery."
            : "മാലിന്യത്തിന്റെ ഫോട്ടോ എടുക്കുക. ജെമിനി എ.ഐ ഘടന പരിശോധിക്കുകയും, തദ്ദേശ സ്ഥാപനങ്ങളുടെ (ഹരിത കർമ്മ സേന) ചട്ടങ്ങൾക്കനുസരിച്ച് നിർദ്ദേശം നൽകുകയും ചെയ്യുന്നു."}
        </p>
      </div>

      {/* Quick Curated Samples Selector */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
            {lang === "en"
              ? "Try Curated Kerala Demonstration Items:"
              : "സാമ്പിൾ മാലിന്യങ്ങൾ തിരഞ്ഞെടുക്കാം:"}
          </span>
          {previewUrl && (
            <button
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{lang === "en" ? "Clear" : "മാറ്റുക"}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SAMPLE_WASTE_ITEMS.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample.id)}
                className={`p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-between space-y-2 group cursor-pointer ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 shadow-md ring-2 ring-emerald-500 scale-[1.02]"
                    : "border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 bg-white/60 dark:bg-slate-900/60 hover:-translate-y-0.5 hover:shadow-sm"
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex items-center justify-center bg-slate-100/90 dark:bg-slate-800/90 p-1.5 group-hover:scale-108 transition-transform">
                  <img
                    src={sample.imageUrl}
                    alt={sample.nameEn}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-full">
                  <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[32px] flex items-center justify-center leading-tight">
                    {lang === "en" ? sample.nameEn : sample.nameMl}
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block uppercase">
                    {sample.category.replace("dry_", "").replace("recyclable_", "").replace("_", " ")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Upload / Camera Box */}
      <div className="glass-panel rounded-2xl p-6 border shadow-sm space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          id="waste-file-upload"
        />

        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-white/40 dark:bg-slate-900/40 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {lang === "en"
                ? "Click or drag & drop to upload a waste photograph"
                : "ഫോട്ടോ എടുക്കുകയോ അപ്‌ലോഡ് ചെയ്യുകയോ ചെയ്യുക"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports JPEG, PNG, WebP up to 10MB
            </p>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 dark:border-emerald-500/20 bg-linear-to-b from-emerald-500/5 to-transparent dark:bg-slate-900/60 flex items-center justify-center p-6 min-h-[240px]">
            <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>{lang === "en" ? "Ready for Analysis" : "പരിശോധനയ്ക്ക് തയ്യാർ"}</span>
            </span>
            <img
              src={previewUrl}
              alt="Selected waste item"
              className="max-h-64 max-w-full object-contain rounded-xl shadow-md transition-transform duration-300 hover:scale-102"
            />
            <button
              onClick={handleReset}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800/80 hover:bg-rose-600 text-white transition-all shadow-md cursor-pointer hover:scale-110"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text description input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            {lang === "en"
              ? "Optional Item Details / Observations:"
              : "കൂടുതൽ വിവരങ്ങൾ (നിർബന്ധമില്ല):"}
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              placeholder={
                lang === "en"
                  ? "e.g. Empty Milma 500ml milk packet, washed but has greasy cap"
                  : "ഉദാ: മിൽമ പാൽ കവർ, കഴുകി വൃത്തിയാക്കിയത്"
              }
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full py-3.5 rounded-xl text-white font-black text-sm shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer relative overflow-hidden ${
              isAnalyzing
                ? "bg-slate-500 cursor-not-allowed opacity-80"
                : "bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{analysisStep || (lang === "en" ? "Analyzing with Gemini..." : "പരിശോധിക്കുന്നു...")}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
                <span>
                  {lang === "en"
                    ? "Classify with Google Gemini AI"
                    : "ഗൂഗിൾ ജെമിനി വഴി തരംതിരിക്കുക"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Render Classification Result Card */}
      {result && (
        <GuidanceCard
          result={result}
          lang={lang}
          onCreateRequest={onCreateRequest}
        />
      )}
    </div>
  );
};
