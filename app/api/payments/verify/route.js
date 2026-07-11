import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection, getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isMock, couponCode, amountPaid } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMockMode = isMock || !keySecret || keySecret === "xxxxxx";

    const db = await getDb();
    const usersCol = await getUsersCollection();

    // Fetch dynamic basePrice
    let basePrice = 799;
    try {
      const settingsDoc = await db.collection("config").findOne({ _id: "global_settings" });
      if (settingsDoc && settingsDoc.basePrice !== undefined) {
        basePrice = Number(settingsDoc.basePrice);
      }
    } catch (err) {
      console.error("Error fetching config base price on verification:", err);
    }

    const paymentFields = {
      isPaid: true,
      paidAt: new Date().toISOString(),
      paymentId: razorpay_payment_id || `mock_pay_${Date.now()}`,
      orderId: razorpay_order_id || `mock_order_${Date.now()}`,
      schedule: { type: "3month", startDate: new Date().toISOString().split("T")[0] },
    };

    // Store coupon and amount info
    if (couponCode) paymentFields.couponCode = couponCode;
    if (amountPaid !== undefined) {
      paymentFields.amountPaid = amountPaid;
      paymentFields.discountAmount = Math.max(0, basePrice - amountPaid);
    }

    if (isMockMode) {
      await usersCol.updateOne(
        { _id: userId },
        { $set: paymentFields },
        { upsert: true }
      );

      // Increment coupon usage
      if (couponCode) {
        await db.collection("coupons").updateOne({ _id: couponCode }, { $inc: { usedCount: 1 } });
      }

      // Mark survey coupon as used for this email
      if (session.user.email) {
        await db.collection("surveyCoupons").updateOne(
          { email: session.user.email.toLowerCase().trim() },
          { $set: { used: true, usedAt: new Date().toISOString() } }
        );
      }

      return NextResponse.json({ success: true });
    }

    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await usersCol.updateOne(
      { _id: userId },
      { $set: paymentFields },
      { upsert: true }
    );

    // Increment coupon usage on successful payment
    if (couponCode) {
      await db.collection("coupons").updateOne({ _id: couponCode }, { $inc: { usedCount: 1 } });
    }

    // Mark survey coupon as used for this email
    if (session.user.email) {
      await db.collection("surveyCoupons").updateOne(
        { email: session.user.email.toLowerCase().trim() },
        { $set: { used: true, usedAt: new Date().toISOString() } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
