import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

async function getCouponsCollection() {
  const db = await getDb();
  return db.collection("coupons");
}

// GET — List all coupons (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const col = await getCouponsCollection();
    const coupons = await col.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — Create a new coupon (admin only)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, discountType, discountValue, maxUses } = await request.json();

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: "Code, discountType, and discountValue are required" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode.length < 3 || normalizedCode.length > 20) {
      return NextResponse.json({ error: "Code must be 3–20 characters" }, { status: 400 });
    }

    if (!["fixed", "percent"].includes(discountType)) {
      return NextResponse.json({ error: "discountType must be 'fixed' or 'percent'" }, { status: 400 });
    }

    if (typeof discountValue !== "number" || discountValue <= 0) {
      return NextResponse.json({ error: "discountValue must be a positive number" }, { status: 400 });
    }

    if (discountType === "percent" && discountValue > 100) {
      return NextResponse.json({ error: "Percent discount cannot exceed 100" }, { status: 400 });
    }

    const col = await getCouponsCollection();

    // Check if coupon code already exists
    const existing = await col.findOne({ _id: normalizedCode });
    if (existing) {
      return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 409 });
    }

    const coupon = {
      _id: normalizedCode,
      discountType,
      discountValue,
      maxUses: maxUses && maxUses > 0 ? maxUses : null,
      usedCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    await col.insertOne(coupon);
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — Update a coupon (toggle active, edit) (admin only)
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, isActive } = await request.json();
    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const col = await getCouponsCollection();
    const updateFields = {};
    if (isActive !== undefined) updateFields.isActive = isActive;

    const result = await col.updateOne({ _id: code }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — Delete a coupon (admin only)
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const col = await getCouponsCollection();
    const result = await col.deleteOne({ _id: code });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
