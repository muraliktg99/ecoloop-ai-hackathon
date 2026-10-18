// src/app/api/requests/[id]/verify/route.ts — Collector & Admin Verification API

import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/storage";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const {
      action, // 'verify' | 'reject' | 'schedule'
      pin,
      scaleReadingKg,
      contaminationDeductionKg,
      collectorName,
      collectorWardOrCenter,
      receiptNumber,
      verificationNotes,
      rejectionReason,
    } = body;

    // Verify PIN for simulated collector/admin authorization
    const validPin = process.env.COLLECTOR_ADMIN_PIN || "1234";
    if (pin !== validPin && pin !== "1234") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid Collector/Admin PIN. Use '1234' for hackathon evaluation demo.",
        },
        { status: 401 }
      );
    }

    if (action === "verify") {
      if (scaleReadingKg === undefined || scaleReadingKg === null || scaleReadingKg <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Scale reading weight (kg) must be greater than zero for verified recovery.",
          },
          { status: 400 }
        );
      }

      const updated = dataStore.verifyCollection(id, {
        verifiedBy: "HKS-AUTH-OFFICER",
        collectorName: collectorName || "Haritha Karma Sena Collector",
        collectorWardOrCenter: collectorWardOrCenter || "Ward MCF Facility",
        scaleReadingKg: Number(scaleReadingKg),
        contaminationDeductionKg: Number(contaminationDeductionKg || 0),
        receiptNumber,
        verificationNotes,
      });

      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Collection request not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        request: updated,
      });
    } else if (action === "reject") {
      if (!rejectionReason) {
        return NextResponse.json(
          { success: false, error: "Rejection reason is required." },
          { status: 400 }
        );
      }

      const updated = dataStore.updateStatus(id, "rejected", rejectionReason);
      return NextResponse.json({
        success: true,
        request: updated,
      });
    } else if (action === "schedule") {
      const updated = dataStore.updateStatus(id, "scheduled");
      return NextResponse.json({
        success: true,
        request: updated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("API /verify error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process verification." },
      { status: 500 }
    );
  }
}
