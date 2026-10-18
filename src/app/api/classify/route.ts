// src/app/api/classify/route.ts — Gemini AI Classification Endpoint

import { NextRequest, NextResponse } from "next/server";
import { analyzeWasteItem } from "@/lib/geminiService";
import { dataStore } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const clientApiKey = req.headers.get("x-gemini-api-key")?.trim() || body.clientApiKey?.trim();
    const { imageBase64, imageMimeType, userDescription, selectedSampleId } = body;

    // Fast status check ping from client Navbar
    if (userDescription === "ping" && !imageBase64 && !selectedSampleId) {
      const apiKey = clientApiKey || process.env.GEMINI_API_KEY?.trim();
      const hasKey = Boolean(apiKey && apiKey.length > 10);

      if (hasKey && apiKey) {
        try {
          const { GoogleGenAI } = await import("@google/genai");
          const ai = new GoogleGenAI({ apiKey });
          let discoveredModel = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
          try {
            const pager = await ai.models.list();
            const candidates: string[] = [];
            for await (const m of pager) {
              const mName = (m.name || "").replace(/^models\//, "");
              const anyM = m as Record<string, unknown>;
              const actions = Array.isArray(anyM.supportedActions)
                ? anyM.supportedActions
                : Array.isArray(anyM.supportedGenerationMethods)
                ? anyM.supportedGenerationMethods
                : [];
              if ((!actions.length || actions.includes("generateContent")) && !mName.includes("embedding") && mName.includes("gemini")) {
                candidates.push(mName);
              }
            }
            if (candidates.length > 0) {
              const score = (name: string) => {
                if (name === discoveredModel) return 100;
                if (name.includes("3.5-flash-lite") || name.includes("3.5-lite")) return 98;
                if (name.includes("3.1-flash-lite") || name.includes("3.1-lite")) return 95;
                if (name.includes("flash-latest")) return 90;
                if (name.includes("3.8-flash")) return 85;
                if (name.includes("flash")) return 70;
                return 50;
              };
              discoveredModel = candidates.sort((a, b) => score(b) - score(a))[0];
            }
          } catch {
            // Keep default candidate if list fails
          }
          return NextResponse.json({
            success: true,
            result: {
              analysisMode: "live_gemini",
              model: discoveredModel,
              hasKey: true,
            },
          });
        } catch (pingErr: unknown) {
          const errMsg = pingErr instanceof Error ? pingErr.message : String(pingErr);
          return NextResponse.json({
            success: false,
            result: {
              analysisMode: "simulated_demo",
              hasKey: false,
            },
            error: errMsg,
          });
        }
      }

      return NextResponse.json({
        success: true,
        result: {
          analysisMode: "simulated_demo",
          model: process.env.GEMINI_MODEL || "gemini-flash-latest",
          hasKey: false,
        },
      });
    }

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
      clientApiKey,
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
