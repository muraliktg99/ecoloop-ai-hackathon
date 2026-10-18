// src/app/api/impact/route.ts — Auditable Environmental Impact Dashboard Metrics API

import { NextResponse } from "next/server";
import { dataStore } from "@/lib/storage";
import { IMPACT_FACTORS } from "@/lib/impactCalculator";

export async function GET() {
  try {
    const metrics = dataStore.getImpactMetrics();
    return NextResponse.json({
      success: true,
      metrics,
      methodology: {
        title: "EcoLoop AI Verified Impact Methodology",
        verificationRule:
          "Zero environmental impact is credited on scans or unverified claims. Metrics update only when an authorized collector records certified scale weights and signs evidence.",
        factors: IMPACT_FACTORS,
        jurisdiction: "Kerala, India (Suchitwa Mission & Clean Kerala Company Standards)",
      },
    });
  } catch (error: unknown) {
    console.error("API /impact error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compute impact metrics." },
      { status: 500 }
    );
  }
}
