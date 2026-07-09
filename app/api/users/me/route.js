import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: "Invalid Session" }, { status: 400 });
  }

  try {
    const usersCol = await getUsersCollection();
    const userDoc = await usersCol.findOne({ _id: userId });
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(userDoc);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: "Invalid Session" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updateFields = {};

    if (body.schedule) {
      if (!body.schedule.type || !body.schedule.startDate) {
        return NextResponse.json({ error: "Invalid schedule format" }, { status: 400 });
      }
      updateFields.schedule = body.schedule;
    }

    if (body.completions !== undefined) {
      updateFields.completions = body.completions;
    }

    if (body.problemNotes !== undefined) {
      updateFields.problemNotes = body.problemNotes;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const usersCol = await getUsersCollection();
    await usersCol.updateOne(
      { _id: userId },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true, ...updateFields });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
