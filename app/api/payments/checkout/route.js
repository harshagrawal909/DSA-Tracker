import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb, getUsersCollection } from "@/lib/db";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

const BASE_PRICE = 799; // ₹799 in rupees

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  let couponCode = null;
  let finalPriceRupees = BASE_PRICE;

  try {
    const body = await request.json().catch(() => ({}));
    couponCode = body.couponCode ? body.couponCode.trim().toUpperCase() : null;
  } catch {
    // No body or invalid JSON — proceed without coupon
  }

  // Validate coupon if provided
  if (couponCode) {
    try {
      const db = await getDb();
      const couponsCol = db.collection("coupons");
      const coupon = await couponsCol.findOne({ _id: couponCode });

      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 400 });
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: "This coupon has been fully redeemed" }, { status: 400 });
      }

      if (coupon.discountType === "fixed") {
        finalPriceRupees = Math.max(0, BASE_PRICE - coupon.discountValue);
      } else if (coupon.discountType === "percent") {
        finalPriceRupees = Math.max(0, Math.round(BASE_PRICE * (1 - coupon.discountValue / 100)));
      }
    } catch (error) {
      console.error("Coupon validation error during checkout:", error);
      return NextResponse.json({ error: "Error validating coupon" }, { status: 500 });
    }
  }

  // If coupon gives 100% discount — grant free access directly
  if (finalPriceRupees === 0) {
    try {
      const usersCol = await getUsersCollection();
      await usersCol.updateOne(
        { _id: userId },
        {
          $set: {
            isPaid: true,
            paidAt: new Date().toISOString(),
            paymentId: `free_coupon_${Date.now()}`,
            orderId: `free_coupon_${couponCode}`,
            couponCode: couponCode,
            amountPaid: 0,
            discountAmount: 799,
            schedule: { type: "3month", startDate: new Date().toISOString().split("T")[0] }
          }
        },
        { upsert: true }
      );

      // Increment coupon usage
      const db = await getDb();
      await db.collection("coupons").updateOne({ _id: couponCode }, { $inc: { usedCount: 1 } });

      return NextResponse.json({
        isMock: false,
        isFree: true,
        amount: 0,
        currency: "INR",
        couponCode,
      });
    } catch (error) {
      console.error("Free coupon processing error:", error);
      return NextResponse.json({ error: "Failed to process free coupon" }, { status: 500 });
    }
  }

  const amountPaise = finalPriceRupees * 100;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const isMock = !keyId || keyId === "rzp_test_xxxxxx" || !keySecret || keySecret === "xxxxxx";

  if (isMock) {
    return NextResponse.json({
      isMock: true,
      amount: amountPaise,
      currency: "INR",
      order_id: `mock_order_${Date.now()}`,
      couponCode,
    });
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `receipt_${userId.slice(0, 10)}_${Date.now()}`,
      notes: couponCode ? { couponCode } : undefined,
    });

    return NextResponse.json({
      isMock: false,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      key_id: keyId,
      couponCode,
      user: {
        name: session.user.name,
        email: session.user.email
      }
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
