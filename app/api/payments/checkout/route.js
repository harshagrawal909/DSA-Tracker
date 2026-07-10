import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const isMock = !keyId || keyId === "rzp_test_xxxxxx" || !keySecret || keySecret === "xxxxxx";

  if (isMock) {
    return NextResponse.json({
      isMock: true,
      amount: 14900,
      currency: "INR",
      order_id: `mock_order_${Date.now()}`
    });
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: 14900,
      currency: "INR",
      receipt: `receipt_${userId.slice(0, 10)}_${Date.now()}`,
    });

    return NextResponse.json({
      isMock: false,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      key_id: keyId,
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
