import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { User } from "@/lib/db/models/User";
import { getPresignedReadUrl } from "@/lib/aws/S3";

type Params = { params: Promise<{ id: string }> };

// GET /api/incidents/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const incident = await Incident.findById(id).lean();

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const beforeUrl = await getPresignedReadUrl(incident.beforeS3Key);
    const afterUrl = incident.afterS3Key
      ? await getPresignedReadUrl(incident.afterS3Key)
      : null;

    return NextResponse.json({
      ...incident,
      beforeImageUrl: beforeUrl,
      afterImageUrl: afterUrl,
    });

  } catch (error) {
    console.error("[GET /api/incidents/[id]]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/incidents/[id] — Assign worker
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const currentUser = await User.findOne({ clerkId: userId }).lean();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { assignedTo, status } = await req.json();

    const updated = await Incident.findByIdAndUpdate(
      id,
      {
        ...(assignedTo && { assignedTo, assignedAt: new Date(), status: "assigned" }),
        ...(status && { status }),
      },
      { new: true }
    ).lean();

    if (updated && assignedTo) {
      await User.findOneAndUpdate(
        { clerkId: assignedTo },
        { $inc: { reportCount: 1 } }
      );
    }

    if (!updated) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    return NextResponse.json(updated);

  } catch (error) {
    console.error("[PATCH /api/incidents/[id]]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}