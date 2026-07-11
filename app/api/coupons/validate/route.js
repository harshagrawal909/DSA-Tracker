import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const db = await getDb();

    // Check if site-wide campaign is active
    try {
      const configCol = db.collection("config");
      const settingsDoc = await configCol.findOne({ _id: "global_settings" });
      if (settingsDoc && settingsDoc.campaignActive) {
        return NextResponse.json({ valid: false, message: "Coupon codes cannot be combined with site-wide sales." });
      }
    } catch (err) {
      console.error("Error checking campaign status during validation:", err);
    }

    const normalizedCode = code.trim().toUpperCase();
    const couponsCol = db.collection("coupons");
    const coupon = await couponsCol.findOne({ _id: normalizedCode });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, message: "This coupon is no longer active" });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, message: "This coupon has been fully redeemed" });
    }

    // Retrieve base price dynamically from config
    let basePrice = 799;
    try {
      const configCol = db.collection("config");
      const settingsDoc = await configCol.findOne({ _id: "global_settings" });
      if (settingsDoc && settingsDoc.basePrice !== undefined) {
        basePrice = Number(settingsDoc.basePrice);
      }
    } catch (err) {
      console.error("Error loading config base price:", err);
    }

    // Calculate discounted price
    let finalPrice = basePrice;
    if (coupon.discountType === "fixed") {
      finalPrice = Math.max(0, basePrice - coupon.discountValue);
    } else if (coupon.discountType === "percent") {
      finalPrice = Math.max(0, Math.round(basePrice * (1 - coupon.discountValue / 100)));
    }

    return NextResponse.json({
      valid: true,
      code: normalizedCode,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalPrice: basePrice,
      finalPrice,
      message: finalPrice === 0
        ? "🎉 100% discount — free access!"
        : `Coupon applied! You save ₹${basePrice - finalPrice}`,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
