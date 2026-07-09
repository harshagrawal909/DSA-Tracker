import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message } = await request.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    const db = await getDb();
    const feedbackCol = db.collection("feedback");

    await feedbackCol.insertOne({
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      userImage: session.user.image,
      message: message.trim(),
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const feedbackCol = db.collection("feedback");
    const list = await feedbackCol.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(list);
  } catch (error) {
    console.error("Error loading feedback:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
