import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

// POST /api/auth/register
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { role } = await req.json();

        if (!["citizen", "pending_worker"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await connectDB();

        // Upsert — create if not exists, update if exists
        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                clerkId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
                name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
                avatarUrl: clerkUser.imageUrl,
                role,
                reportCount: 0,
                resolvedCount: 0,
                spamCount: 0,
            },
            { upsert: true, new: true }
        ).lean();

        return NextResponse.json({ success: true, role: user.role });

    } catch (error) {
        console.error("[POST /api/auth/register]", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}