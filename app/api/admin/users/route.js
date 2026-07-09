import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Do not let admin delete themselves!
    if (userId === session.user.id) {
      return NextResponse.json({ error: "You cannot delete your own admin account" }, { status: 400 });
    }

    const usersCol = await getUsersCollection();
    const result = await usersCol.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
