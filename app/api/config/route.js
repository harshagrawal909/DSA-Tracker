import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const db = await getDb();
    const configCol = db.collection("config");
    
    // Check for the unified global settings doc
    const settingsDoc = await configCol.findOne({ _id: "global_settings" });
    if (settingsDoc) {
      return NextResponse.json({
        whatsappLink: settingsDoc.whatsappLink || "https://chat.whatsapp.com/REPLACE_WITH_YOUR_GROUP_LINK",
        basePrice: settingsDoc.basePrice ?? 799,
        surveyDiscount: settingsDoc.surveyDiscount ?? 200,
        campaignActive: settingsDoc.campaignActive ?? false,
        campaignTitle: settingsDoc.campaignTitle || "",
        campaignMessage: settingsDoc.campaignMessage || "",
        campaignDiscountType: settingsDoc.campaignDiscountType || "percent",
        campaignDiscountValue: settingsDoc.campaignDiscountValue ?? 0,
      });
    }

    // Fallback: check legacy single-value document
    const linkDoc = await configCol.findOne({ _id: "whatsapp_link" });
    const legacyLink = linkDoc ? linkDoc.value : "https://chat.whatsapp.com/REPLACE_WITH_YOUR_GROUP_LINK";
    return NextResponse.json({
      whatsappLink: legacyLink,
      basePrice: 799,
      surveyDiscount: 200,
      campaignActive: false,
      campaignTitle: "",
      campaignMessage: "",
      campaignDiscountType: "percent",
      campaignDiscountValue: 0,
    });
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
    const body = await request.json();
    const { 
      whatsappLink, 
      basePrice, 
      surveyDiscount, 
      campaignActive, 
      campaignTitle, 
      campaignMessage, 
      campaignDiscountType, 
      campaignDiscountValue 
    } = body;

    const db = await getDb();
    const configCol = db.collection("config");

    // Fetch existing settings to merge updates
    const existing = await configCol.findOne({ _id: "global_settings" }) || {};
    
    // Fallback migration check if global_settings didn't exist yet but whatsapp_link did
    if (!existing.whatsappLink) {
      const legacyLinkDoc = await configCol.findOne({ _id: "whatsapp_link" });
      if (legacyLinkDoc) {
        existing.whatsappLink = legacyLinkDoc.value;
      }
    }

    const updatedSettings = {
      whatsappLink: whatsappLink !== undefined ? whatsappLink : (existing.whatsappLink || ""),
      basePrice: basePrice !== undefined ? Number(basePrice) : (existing.basePrice ?? 799),
      surveyDiscount: surveyDiscount !== undefined ? Number(surveyDiscount) : (existing.surveyDiscount ?? 200),
      campaignActive: campaignActive !== undefined ? Boolean(campaignActive) : (existing.campaignActive ?? false),
      campaignTitle: campaignTitle !== undefined ? String(campaignTitle) : (existing.campaignTitle || ""),
      campaignMessage: campaignMessage !== undefined ? String(campaignMessage) : (existing.campaignMessage || ""),
      campaignDiscountType: campaignDiscountType !== undefined ? String(campaignDiscountType) : (existing.campaignDiscountType || "percent"),
      campaignDiscountValue: campaignDiscountValue !== undefined ? Number(campaignDiscountValue) : (existing.campaignDiscountValue ?? 0),
    };

    await configCol.updateOne(
      { _id: "global_settings" },
      { $set: updatedSettings },
      { upsert: true }
    );

    // Also update legacy document for safety & backward compatibility
    if (whatsappLink !== undefined) {
      await configCol.updateOne(
        { _id: "whatsapp_link" },
        { $set: { value: whatsappLink } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, ...updatedSettings });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
