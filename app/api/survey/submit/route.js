import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      college,
      year,
      dsaLevel,
      triedStriver,
      trackingMethod,
      excitedFeature,
      feedback,
      rating,
      fairPrice,
    } = body;

    // Validate essential fields
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const db = await getDb();
    const emailKey = email.toLowerCase().trim();

    // 1. Fetch configured discount from config settings
    const configCol = db.collection("config");
    const settingsDoc = await configCol.findOne({ _id: "global_settings" });
    const discountAmount = settingsDoc?.surveyDiscount ?? 200;
    const couponCode = `SURVEY${discountAmount}`;

    // 2. Save survey results
    const surveysCol = db.collection("surveys");
    await surveysCol.updateOne(
      { email: emailKey },
      {
        $set: {
          name: name || "",
          email: emailKey,
          college: college || "",
          year: year || "",
          dsaLevel: dsaLevel || "",
          triedStriver: triedStriver || "",
          trackingMethod: trackingMethod || "",
          excitedFeature: excitedFeature || "",
          feedback: feedback || "",
          rating: rating ? Number(rating) : null,
          fairPrice: fairPrice || "",
          submittedAt: new Date().toISOString(),
        }
      },
      { upsert: true }
    );

    // 3. Save mapping of user's email to this coupon
    const surveyCouponsCol = db.collection("surveyCoupons");
    await surveyCouponsCol.updateOne(
      { _id: emailKey },
      {
        $set: {
          email: emailKey,
          couponCode,
          used: false,
          linkedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );

    // 4. Ensure coupon exists in global coupons list
    const couponsCol = db.collection("coupons");
    await couponsCol.updateOne(
      { _id: couponCode },
      {
        $setOnInsert: {
          _id: couponCode,
          discountType: "fixed",
          discountValue: discountAmount,
          isActive: true,
          usedCount: 0,
          createdAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      couponCode,
      discountAmount,
      message: `Coupon ${couponCode} created and linked to ${emailKey}!`
    });
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
