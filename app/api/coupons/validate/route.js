import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

const BASE_PRICE = 799;

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

    const normalizedCode = code.trim().toUpperCase();

    const db = await getDb();
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

    // Calculate discounted price
    let finalPrice = BASE_PRICE;
    if (coupon.discountType === "fixed") {
      finalPrice = Math.max(0, BASE_PRICE - coupon.discountValue);
    } else if (coupon.discountType === "percent") {
      finalPrice = Math.max(0, Math.round(BASE_PRICE * (1 - coupon.discountValue / 100)));
    }

    return NextResponse.json({
      valid: true,
      code: normalizedCode,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalPrice: BASE_PRICE,
      finalPrice,
      message: finalPrice === 0
        ? "🎉 100% discount — free access!"
        : `Coupon applied! You save ₹${BASE_PRICE - finalPrice}`,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
