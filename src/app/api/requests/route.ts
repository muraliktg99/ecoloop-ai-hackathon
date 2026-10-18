// src/app/api/requests/route.ts — Collection & Handover Request API

import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/storage";

export async function GET() {
  try {
    const requests = dataStore.getRequests();
    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error: unknown) {
    console.error("API /requests GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve collection requests." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userName,
      userPhone,
      district,
      locality,
      category,
      categoryNameEn,
      categoryNameMl,
      itemDescription,
      estimatedWeightKg,
      partnerId,
      partnerName,
      imageUrl,
    } = body;

    if (!category || !itemDescription) {
      return NextResponse.json(
        { success: false, error: "Category and item description are required." },
        { status: 400 }
      );
    }

    const newRequest = dataStore.createRequest({
      userName: userName || "Resident",
      userPhone: userPhone || "Not specified",
      district: district || "Ernakulam",
      locality: locality || "Central Kochi",
      category,
      categoryNameEn: categoryNameEn || "Dry Waste",
      categoryNameMl: categoryNameMl || "അജൈവ മാലിന്യം",
      itemDescription,
      estimatedWeightKg: Number(estimatedWeightKg) || 1.0,
      partnerId,
      partnerName,
      imageUrl,
    });

    return NextResponse.json({
      success: true,
      request: newRequest,
    });
  } catch (error: unknown) {
    console.error("API /requests POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create collection request." },
      { status: 500 }
    );
  }
}
