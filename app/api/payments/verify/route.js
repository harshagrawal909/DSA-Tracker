import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/db";
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isMock } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMockMode = isMock || !keySecret || keySecret === "xxxxxx";

    const usersCol = await getUsersCollection();

    if (isMockMode) {
      await usersCol.updateOne(
        { _id: userId },
        {
          $set: {
            isPaid: true,
            paidAt: new Date().toISOString(),
            paymentId: razorpay_payment_id || `mock_pay_${Date.now()}`,
            orderId: razorpay_order_id || `mock_order_${Date.now()}`,
            schedule: { type: "3month", startDate: new Date().toISOString().split("T")[0] }
          }
        },
        { upsert: true }
      );
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
      {
        $set: {
          isPaid: true,
          paidAt: new Date().toISOString(),
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          schedule: { type: "3month", startDate: new Date().toISOString().split("T")[0] }
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
