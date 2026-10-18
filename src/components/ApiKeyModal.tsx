// src/components/ApiKeyModal.tsx — Gemini AI Key Configuration Modal

"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, Sparkles, CheckCircle2, AlertTriangle, ExternalLink, X, Shield, RefreshCw } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "ml";
  isLiveGemini: boolean;
  onKeyUpdated: (isLive: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  lang,
  isLiveGemini,
  onKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ecoloop_gemini_api_key") || "";
      setApiKey(stored);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    const trimmedKey = apiKey.trim();

    try {
      // Test the key against /api/classify ping
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": trimmedKey,
        },
        body: JSON.stringify({
          userDescription: "ping",
          clientApiKey: trimmedKey,
        }),
      });

      const data = await res.json();

      if (data.result?.analysisMode === "live_gemini") {
        localStorage.setItem("ecoloop_gemini_api_key", trimmedKey);
        setTestResult({
          success: true,
          message: lang === "en" ? "Gemini 2.5 Flash connected successfully!" : "ഗൂഗിൾ ജെമിനി വിജയകരമായി ബന്ധിപ്പിച്ചു!",
        });
        onKeyUpdated(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setTestResult({
          success: false,
          message: lang === "en" ? "API key could not be verified. Please verify your Google AI Studio key." : "API കീ പരിശോധിക്കാൻ സാധിച്ചില്ല. ദയവായി പരിശോധിക്കുക.",
        });
      }
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Connection failed.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("ecoloop_gemini_api_key");
    setApiKey("");
    setTestResult(null);
    onKeyUpdated(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {lang === "en" ? "Google Gemini AI Settings" : "ഗൂഗിൾ ജെമിനി ക്രമീകരണങ്ങൾ"}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === "en" ? "Multimodal Vision & Real-time Reasoning" : "തത്സമയ എ.ഐ വിശകലന ക്രമീകരണം"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status Pill */}
        <div
          className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs font-semibold ${
            isLiveGemini
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300"
          }`}
        >
          {isLiveGemini ? (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                {lang === "en"
                  ? "Status: Live Gemini 2.5 Flash active"
                  : "സ്ഥിതി: തത്സമയ ജെമിനി 2.5 സജീവം"}
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                {lang === "en"
                  ? "Status: Demo Simulation Mode (Add key below for dynamic live vision)"
                  : "സ്ഥിതി: ഡെമോ മോഡ് (തത്സമയ വിശകലനത്തിന് കീ നൽകുക)"}
              </span>
            </>
          )}
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>{lang === "en" ? "Gemini API Key" : "ജെമിനി API കീ"}</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-600 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>{lang === "en" ? "Get Free Key" : "സൗജന്യ കീ നേടുക"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-[11px] text-slate-500 leading-tight">
            {lang === "en"
              ? "Your key is stored securely in your browser's localStorage and passed only to the official Gemini API for waste classification."
              : "നിങ്ങളുടെ API കീ സുരക്ഷിതമായി ബ്രൗസറിൽ സൂക്ഷിക്കപ്പെടുന്നു."}
          </p>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
              testResult.success
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300"
                : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300"
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
            >
              {lang === "en" ? "Clear Key" : "മായ്ക്കുക"}
            </button>
          )}
          <button
            onClick={handleSaveAndTest}
            disabled={isTesting || !apiKey.trim()}
            className={`flex-1 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              isTesting || !apiKey.trim()
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"
            }`}
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{lang === "en" ? "Verifying..." : "പരിശോധിക്കുന്നു..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "Save & Activate" : "സേവ് ചെയ്തു സജീവമാക്കുക"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
