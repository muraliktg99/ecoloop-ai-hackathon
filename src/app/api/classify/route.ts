// src/app/api/classify/route.ts — Gemini AI Classification Endpoint

import { NextRequest, NextResponse } from "next/server";
import { analyzeWasteItem } from "@/lib/geminiService";
import { dataStore } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { imageBase64, imageMimeType, userDescription, selectedSampleId } = body;

    if (!imageBase64 && !userDescription && !selectedSampleId) {
      return NextResponse.json(
        {
          success: false,
          error: "Either an image, text description, or sample item selection is required.",
        },
        { status: 400 }
      );
    }

    const result = await analyzeWasteItem({
      imageBase64,
      imageMimeType,
      userDescription,
      selectedSampleId,
    });

    // Record scan in auditable store
    dataStore.recordScan();

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    console.error("API /classify error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal analysis error occurred.",
      },
      { status: 500 }
    );
  }
}
