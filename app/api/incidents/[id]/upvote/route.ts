import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";

type Params = { params: { id: string } };

// POST /api/incidents/[id]/upvote
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();
    const incident = await Incident.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    ).lean();

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      upvotes: incident.upvotes,
    });

  } catch (error) {
    console.error("[POST /api/incidents/[id]/upvote]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}