import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = await getDb();
    const emailKey = email.toLowerCase().trim();

    // 1. Check if user has an unused survey coupon mapping
    const surveyCoupon = await db.collection("surveyCoupons").findOne({ _id: emailKey, used: false });
    if (!surveyCoupon) {
      return NextResponse.json({ valid: false });
    }

    // 2. Fetch details of the coupon to make sure it's active
    const coupon = await db.collection("coupons").findOne({ _id: surveyCoupon.couponCode });
    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      couponCode: coupon._id,
      discountValue: coupon.discountValue,
      discountType: coupon.discountType || "fixed"
    });
  } catch (error) {
    console.error("Error checking coupon by email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
