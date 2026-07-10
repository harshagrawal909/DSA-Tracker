import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "admin";
  const isPaid = session.user.isPaid;
  if (!isAdmin && !isPaid) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const db = await getDb();
    const configCol = db.collection("config");
    const linkDoc = await configCol.findOne({ _id: "whatsapp_link" });
    const value = linkDoc ? linkDoc.value : "https://chat.whatsapp.com/REPLACE_WITH_YOUR_GROUP_LINK";
    return NextResponse.json({ whatsappLink: value });
  } catch (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { whatsappLink } = await request.json();
    if (!whatsappLink) {
      return NextResponse.json({ error: "Link is required" }, { status: 400 });
    }

    const db = await getDb();
    const configCol = db.collection("config");
    await configCol.updateOne(
      { _id: "whatsapp_link" },
      { $set: { value: whatsappLink } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
