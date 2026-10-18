// src/components/Navbar.tsx — Application Header with Navigation & Language Toggle

"use client";

import React from "react";
import {
  Recycle,
  Sparkles,
  MapPin,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  Languages,
} from "lucide-react";

export type ActiveTab = "scanner" | "directory" | "requests" | "collector" | "impact";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: "en" | "ml";
  setLang: (lang: "en" | "ml") => void;
  isLiveGemini: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isLiveGemini,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab("scanner")}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-linear-to-r from-emerald-600 to-teal-800 dark:from-emerald-400 dark:to-teal-200 bg-clip-text text-transparent">
                  EcoLoop AI
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Kerala Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {lang === "en" ? "From Waste to Verified Value" : "മാലിന്യത്തിൽ നിന്ന് ഉറപ്പായ മൂല്യത്തിലേക്ക്"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab("scanner")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "scanner"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === "en" ? "AI Scanner" : "സ്കാനർ"}</span>
            </button>

            <button
              onClick={() => setActiveTab("directory")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "directory"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{lang === "en" ? "Recovery Hubs" : "ശേഖരണ കേന്ദ്രങ്ങൾ"}</span>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "requests"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>{lang === "en" ? "Handover Requests" : "അഭ്യർത്ഥനകൾ"}</span>
            </button>

            <button
              onClick={() => setActiveTab("collector")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "collector"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === "en" ? "Collector Portal" : "കലക്ടർ പോർട്ടൽ"}</span>
              <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded font-bold">
                Admin
              </span>
            </button>

            <button
              onClick={() => setActiveTab("impact")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "impact"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{lang === "en" ? "Impact Dashboard" : "ഇംപാക്ട്"}</span>
            </button>
          </nav>

          {/* Right Action: Language Switch & Status Pill */}
          <div className="flex items-center space-x-3">
            {/* AI Status Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveGemini ? "bg-emerald-500 animate-pulse" : "bg-cyan-500"
                }`}
              />
              <span className="text-slate-700 dark:text-slate-300">
                {isLiveGemini ? "Gemini 2.5 Live" : "Demo Simulation"}
              </span>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ml" : "en")}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
              title="Toggle English / Malayalam"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === "en" ? "മലയാളം" : "English"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 text-xs font-medium">
        <button
          onClick={() => setActiveTab("scanner")}
          className={`px-2 py-1 rounded ${
            activeTab === "scanner" ? "font-bold text-emerald-600" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          {lang === "en" ? "Scan" : "സ്കാൻ"}
        </button>
        <button
          onClick={() => setActiveTab("directory")}
          className={`px-2 py-1 rounded ${
            activeTab === "directory" ? "font-bold text-emerald-600" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          {lang === "en" ? "Hubs" : "കേന്ദ്രങ്ങൾ"}
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-2 py-1 rounded ${
            activeTab === "requests" ? "font-bold text-emerald-600" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          {lang === "en" ? "Requests" : "ലിസ്റ്റ്"}
        </button>
        <button
          onClick={() => setActiveTab("collector")}
          className={`px-2 py-1 rounded ${
            activeTab === "collector" ? "font-bold text-emerald-600" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          {lang === "en" ? "Admin" : "അഡ്മിൻ"}
        </button>
        <button
          onClick={() => setActiveTab("impact")}
          className={`px-2 py-1 rounded ${
            activeTab === "impact" ? "font-bold text-emerald-600" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          {lang === "en" ? "Impact" : "ഇംപാക്ട്"}
        </button>
      </div>
    </header>
  );
};
