// src/app/page.tsx — Main EcoLoop AI Application Container

"use client";

import React, { useState, useEffect } from "react";
import { Navbar, ActiveTab } from "@/components/Navbar";
import { ScannerSection } from "@/components/ScannerSection";
import { RecoveryDirectory } from "@/components/RecoveryDirectory";
import { RequestsSection } from "@/components/RequestsSection";
import { CollectorPortal } from "@/components/CollectorPortal";
import { ImpactDashboard } from "@/components/ImpactDashboard";
import { CreateRequestModal } from "@/components/CreateRequestModal";
import { ClassificationResult, CollectionRequest } from "@/types";
import { Recycle, Heart, ShieldCheck, ExternalLink } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as ActiveTab;
      if (tabParam && ["scanner", "directory", "requests", "collector", "impact"].includes(tabParam)) {
        return tabParam;
      }
    }
    return "scanner";
  });

  const [lang, setLang] = useState<"en" | "ml">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get("lang");
      if (langParam === "ml" || langParam === "en") {
        return langParam;
      }
    }
    return "en";
  });
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeScanResult, setActiveScanResult] = useState<ClassificationResult | null>(null);
  const [isLiveGemini, setIsLiveGemini] = useState(false);

  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  useEffect(() => {
    // Parse deep-link query parameters
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as ActiveTab;
      if (tabParam && ["scanner", "directory", "requests", "collector", "impact"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
      const langParam = params.get("lang");
      if (langParam === "ml" || langParam === "en") {
        setLang(langParam);
      }
    }

    fetchRequests();
    // Check if Gemini API key is configured
    fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userDescription: "ping" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result?.analysisMode === "live_gemini") {
          setIsLiveGemini(true);
        }
      })
      .catch(() => {});
  }, []);

  // Update URL search parameters when tab or language changes
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleLangChange = (newLang: "en" | "ml") => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", newLang);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleCreateRequest = (result: ClassificationResult) => {
    setActiveScanResult(result);
    setModalOpen(true);
  };

  const handleOpenManualRequest = () => {
    setActiveScanResult(null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        lang={lang}
        setLang={handleLangChange}
        isLiveGemini={isLiveGemini}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === "scanner" && (
          <ScannerSection lang={lang} onCreateRequest={handleCreateRequest} />
        )}

        {activeTab === "directory" && <RecoveryDirectory lang={lang} />}

        {activeTab === "requests" && (
          <RequestsSection
            requests={requests}
            lang={lang}
            onOpenCreateModal={handleOpenManualRequest}
          />
        )}

        {activeTab === "collector" && (
          <CollectorPortal
            requests={requests}
            lang={lang}
            onRefresh={fetchRequests}
          />
        )}

        {activeTab === "impact" && (
          <ImpactDashboard requests={requests} lang={lang} />
        )}
      </main>

      {/* Create Request Modal */}
      <CreateRequestModal
        initialData={activeScanResult}
        lang={lang}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          fetchRequests();
          setActiveTab("requests");
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 glass-panel mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Recycle className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              EcoLoop AI — From Waste to Verified Value
            </span>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p>
              Developed for the <strong>AI Builder Cup Sustainability Hackathon</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Powered by Google Gemini 2.5, Vertex AI &amp; Google Cloud Platform • Kerala LSGD &amp; Suchitwa Mission Rules
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
