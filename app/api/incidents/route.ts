import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { User } from "@/lib/db/models/User";
import { checkDuplicate, checkRateLimit, registerIncident } from "@/lib/redis";
import { validateImage } from "@/lib/ai/Gemini";
import { deleteS3Object } from "@/lib/aws/S3";
import { computePriorityScore } from "@/lib/utils";
import type { CreateIncidentRequest } from "@/types";

// POST /api/incidents — Create new incident
export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse body
    const body: CreateIncidentRequest = await req.json();
    const { s3Key, lat, lng, categoryHint, userDescription } = body;

    if (!s3Key || !lat || !lng || !categoryHint) {
      return NextResponse.json(
        { error: "s3Key, lat, lng, categoryHint required" },
        { status: 400 }
      );
    }

    // 3. Rate limit check
    const rateLimit = await checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many reports. Try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes.` },
        { status: 429 }
      );
    }

    // 4. Deduplication check
    const dedup = await checkDuplicate(lat, lng, categoryHint);
    if (dedup.isDuplicate && dedup.existingIncidentId) {
      await connectDB();
      await Incident.findByIdAndUpdate(dedup.existingIncidentId, {
        $inc: { upvotes: 1 },
      });
      return NextResponse.json({
        success: true,
        isDuplicate: true,
        existingIncidentId: dedup.existingIncidentId,
        message: "Similar issue already reported nearby. Your vote has been added!",
      });
    }

    // 5. AI Validation
    const aiAnalysis = await validateImage(s3Key, categoryHint);
    // 6. Spam check
    if (aiAnalysis.isSpam) {
      await deleteS3Object(s3Key);
      await connectDB();
      await User.findOneAndUpdate({ clerkId: userId }, { $inc: { spamCount: 1 } });
      return NextResponse.json(
        { error: `Report rejected: ${aiAnalysis.spamReason ?? "Invalid image"}` },
        { status: 422 }
      );
    }

    // 7. Save to MongoDB
    await connectDB();
    const incident = await Incident.create({
      reportedBy: userId,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      beforeS3Key: s3Key,
      categoryHint,
      userDescription,
      aiAnalysis,
      status: "verified",
      priorityScore: computePriorityScore(aiAnalysis.severity, 0, new Date()),
      upvotes: 0,
    });

    // 8. Register in Redis for future dedup
    await registerIncident(incident._id.toString(), lat, lng, aiAnalysis.category);

    // 9. Update user report count
    await User.findOneAndUpdate({ clerkId: userId }, { $inc: { reportCount: 1 } });

    return NextResponse.json({
      success: true,
      incidentId: incident._id.toString(),
      isDuplicate: false,
      message: "Incident reported successfully!",
    }, { status: 201 });

  } catch (error) {
    console.error("[POST /api/incidents]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/incidents — List incidents
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const assignedTo = searchParams.get("assignedTo");
    const reportedBy = searchParams.get("reportedBy");

    // Build filter
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (category) filter["aiAnalysis.category"] = category;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (reportedBy) filter.reportedBy = reportedBy;

    await connectDB();

    const [incidents, total] = await Promise.all([
      Incident.find(filter)
        .sort({ priorityScore: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Incident.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: incidents,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    });

  } catch (error) {
    console.error("[GET /api/incidents]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
