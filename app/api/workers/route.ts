import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export async function GET(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const currentUser = await User.findOne({ clerkId: userId }).lean();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [workers, pending] = await Promise.all([
      User.find({ role: "worker" })
        .select("clerkId name email avatarUrl resolvedCount reportCount createdAt")
        .lean(),
      User.find({ role: "pending_worker" })
        .select("name email avatarUrl createdAt")
        .lean(),
    ]);

    return NextResponse.json({ workers, pending });

  } catch (error) {
    console.error("[GET /api/workers]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}