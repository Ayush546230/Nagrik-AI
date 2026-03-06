import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { User } from "@/lib/db/models/User";
import { verifyResolution } from "@/lib/ai/Gemini";
import { removeIncident } from "@/lib/redis";

// POST /api/incidents/[id]/resolve
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { afterS3Key } = await req.json();
    if (!afterS3Key) {
      return NextResponse.json({ error: "afterS3Key required" }, { status: 400 });
    }

    const { id } = await params;

    await connectDB();
    const incident = await Incident.findById(id);
    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    // Only assigned worker or admin can resolve
    const currentUser = await User.findOne({ clerkId: userId }).lean();
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdmin = currentUser.role === "admin";
    const isAssignedWorker = incident.assignedTo === userId;

    if (!isAdmin && !isAssignedWorker) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }


    // AI verification
    const aiResolution = await verifyResolution(incident.beforeS3Key, afterS3Key);
    // Update incident
    incident.afterS3Key = afterS3Key;
    incident.aiResolution = aiResolution;

    if (aiResolution.resolved) {
      incident.status = "resolved";
      incident.resolvedAt = new Date();

      // Remove from Redis dedup
      const [lng, lat] = incident.location.coordinates;
      await removeIncident(lat, lng, incident.aiAnalysis.category);

      // Update worker resolved count
      await User.findOneAndUpdate(
        { clerkId: userId },
        { $inc: { resolvedCount: 1 } }
      );
    } else {
      incident.status = "in_progress";
    }

    await incident.save();

    return NextResponse.json({
      success: true,
      resolved: aiResolution.resolved,
      confidence: aiResolution.confidence,
      notes: aiResolution.notes,
      message: aiResolution.resolved
        ? "Issue resolved! AI has verified the fix. ✅"
        : `Not verified: ${aiResolution.notes}. Please re-check.`,
    });

  } catch (error) {
    console.error("[POST /api/incidents/[id]/resolve]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}