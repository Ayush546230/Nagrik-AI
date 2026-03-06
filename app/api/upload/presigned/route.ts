import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPresignedUploadUrl } from "@/lib/aws/S3";

// POST /api/upload/presigned
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName, fileType, fileSize } = await req.json();

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { error: "fileName, fileType, fileSize required" },
        { status: 400 }
      );
    }

    const type = fileName.startsWith("after-") ? "after" : "before";

    const result = await getPresignedUploadUrl(userId, type, fileType, fileSize);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    const status = message.includes("Invalid") || message.includes("large") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
