// src/components/RecoveryDirectory.tsx — Curated Directory of Kerala Waste Recovery Hubs

"use client";

import React, { useState } from "react";
import { KERALA_RECOVERY_PARTNERS, KERALA_WASTE_CATEGORIES } from "@/lib/keralaWasteRules";
import { WasteCategory } from "@/types";
import {
  Building2,
  Calendar,
  MapPin,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface RecoveryDirectoryProps {
  lang: "en" | "ml";
}

export const RecoveryDirectory: React.FC<RecoveryDirectoryProps> = ({ lang }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPartners = KERALA_RECOVERY_PARTNERS.filter((partner) => {
    if (selectedDistrict !== "all" && partner.district !== selectedDistrict) {
      return false;
    }
    if (
      selectedCategory !== "all" &&
      !partner.acceptedCategories.includes(selectedCategory as WasteCategory)
    ) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName =
        partner.name.toLowerCase().includes(q) || partner.nameMl.toLowerCase().includes(q);
      const matchLocality = partner.locality.toLowerCase().includes(q);
      if (!matchName && !matchLocality) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          {lang === "en" ? "Kerala Waste Recovery Directory" : "കേരള മാലിന്യ സംസ്കരണ കേന്ദ്രങ്ങൾ"}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {lang === "en"
            ? "Official Haritha Karma Sena (HKS) Ward Collection Centers, Clean Kerala Company (CKCL) Resource Recovery Facilities (RRF), and authorized private scrap recyclers."
            : "ഹരിത കർമ്മ സേന ശേഖരണ കേന്ദ്രങ്ങൾ, ക്ലീൻ കേരള കമ്പനി റിസോഴ്സ് റിക്കവറി ഫെസിലിറ്റി (RRF), അംഗീകൃത ആക്രി റീസൈക്ലിംഗ് കേന്ദ്രങ്ങൾ."}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "en" ? "Search facility or ward..." : "കേന്ദ്രമോ വാർഡോ തിരയുക..."}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70"
            >
              <option value="all">{lang === "en" ? "All Districts" : "എല്ലാ ജില്ലകളും"}</option>
              <option value="Ernakulam">Ernakulam (എറണാകുളം)</option>
              <option value="Thiruvananthapuram">Thiruvananthapuram (തിരുവനന്തപുരം)</option>
            </select>
          </div>

          {/* Material Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70"
            >
              <option value="all">{lang === "en" ? "All Material Categories" : "എല്ലാ വിഭാഗങ്ങളും"}</option>
              {Object.entries(KERALA_WASTE_CATEGORIES).map(([catKey, catInfo]) => (
                <option key={catKey} value={catKey}>
                  {lang === "en" ? catInfo.nameEn : catInfo.nameMl}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Facility Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="glass-panel rounded-2xl p-5 border shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {lang === "en" ? partner.name : partner.nameMl}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{partner.locality}, {partner.district}</span>
                  </div>
                </div>

                {partner.isOfficialPartner ? (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Official LSGD</span>
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Private Recycler
                  </span>
                )}
              </div>

              {/* Schedule Info */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div className="flex items-start space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {lang === "en" ? partner.collectionScheduleEn : partner.collectionScheduleMl}
                  </span>
                </div>
              </div>

              {/* Accepted Badges */}
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  {lang === "en" ? "Accepted Materials:" : "സ്വീകരിക്കുന്നവ:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {partner.acceptedCategories.map((cat) => {
                    const info = KERALA_WASTE_CATEGORIES[cat];
                    return (
                      <span
                        key={cat}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          info ? info.badgeBg + " " + info.badgeText : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {info ? (lang === "en" ? info.nameEn.split(" ")[0] : info.nameMl.split(" ")[0]) : cat}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer with phone and address */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 line-clamp-1">{partner.address}</span>
              {partner.contactNumber && (
                <a
                  href={`tel:${partner.contactNumber}`}
                  className="px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-bold flex items-center space-x-1 shrink-0 ml-2"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
