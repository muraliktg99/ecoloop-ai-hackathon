// src/components/Navbar.tsx — Bulletproof Responsive Navigation Header

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
  onOpenApiKeyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isLiveGemini,
  onOpenApiKeyModal,
}) => {
  const navItems = [
    {
      id: "scanner" as ActiveTab,
      shortEn: "Scanner",
      fullEn: "AI Scanner",
      shortMl: "സ്കാനർ",
      fullMl: "AI സ്കാനർ",
      icon: Sparkles,
    },
    {
      id: "directory" as ActiveTab,
      shortEn: "Hubs",
      fullEn: "Recovery Hubs",
      shortMl: "കേന്ദ്രങ്ങൾ",
      fullMl: "ശേഖരണ കേന്ദ്രങ്ങൾ",
      icon: MapPin,
    },
    {
      id: "requests" as ActiveTab,
      shortEn: "Requests",
      fullEn: "Handover Requests",
      shortMl: "അഭ്യർത്ഥനകൾ",
      fullMl: "കൈമാറ്റ അഭ്യർത്ഥനകൾ",
      icon: ClipboardList,
    },
    {
      id: "collector" as ActiveTab,
      shortEn: "Portal",
      fullEn: "Collector Portal",
      shortMl: "പോർട്ടൽ",
      fullMl: "കലക്ടർ പോർട്ടൽ",
      icon: ShieldCheck,
      badge: "Admin",
    },
    {
      id: "impact" as ActiveTab,
      shortEn: "Impact",
      fullEn: "Impact Dashboard",
      shortMl: "ഇംപാക്ട്",
      fullMl: "ഇംപാക്ട് ഡാഷ്ബോർഡ്",
      icon: BarChart3,
    },
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Logo & Title */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
            onClick={() => setActiveTab("scanner")}
          >
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-linear-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform shrink-0">
              <Recycle className="w-5 h-5 animate-spin-slow shrink-0" />
            </div>
            <div className="flex flex-col shrink-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg lg:text-xl tracking-tight bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent whitespace-nowrap">
                  EcoLoop AI
                </span>
                <span className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap">
                  Kerala
                </span>
              </div>
              <p className="hidden 2xl:block text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                {lang === "en" ? "From Waste to Verified Value" : "മാലിന്യത്തിൽ നിന്ന് ഉറപ്പായ മൂല്യത്തിലേക്ക്"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links — Responsive Adaptive Labels */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-2 rounded-xl text-xs lg:text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"}`} />
                  <span className="whitespace-nowrap">
                    <span className="inline lg:hidden">{lang === "en" ? item.shortEn : item.shortMl}</span>
                    <span className="hidden lg:inline">{lang === "en" ? item.fullEn : item.fullMl}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-black ml-0.5 shrink-0 ${
                        isActive
                          ? "bg-emerald-800 text-emerald-100"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language Switch & Status Pill */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* AI Status Badge on wide screens */}
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-100/90 dark:bg-slate-900/90 hover:border-emerald-500 border-slate-200 dark:border-slate-800 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              title="Click to configure Gemini API Key"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveGemini ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                {isLiveGemini ? "Gemini 2.5 Live" : "Demo Mode"}
              </span>
            </button>

            {/* Compact live status dot on medium/large screens */}
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              className="hidden md:flex 2xl:hidden items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shrink-0 transition-colors cursor-pointer"
              title={isLiveGemini ? "Gemini 2.5 Live — Click to configure" : "Demo Simulation Mode — Click to configure API Key"}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveGemini ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(lang === "en" ? "ml" : "en")}
              className="flex items-center space-x-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:border-emerald-500 text-xs font-black transition-all shadow-2xs hover:shadow-xs cursor-pointer group shrink-0"
              title="Toggle English / Malayalam"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="text-slate-800 dark:text-slate-200 whitespace-nowrap">
                {lang === "en" ? "മലയാളം" : "English"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Dock Navigation */}
      <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
                isActive
                  ? "text-emerald-600 font-extrabold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 font-medium"
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? "text-emerald-600 scale-110" : "text-slate-400"}`} />
              <span className="text-[10px] leading-tight whitespace-nowrap">
                {lang === "en" ? item.shortEn : item.shortMl}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
