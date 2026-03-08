import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

// POST /api/workers/approve
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Only admin can approve
        const currentUser = await User.findOne({ clerkId: userId }).lean();
        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { workerId, action } = await req.json();
        if (!workerId || !action) {
            return NextResponse.json({ error: "workerId and action required" }, { status: 400 });
        }

        if (!["approve", "reject"].includes(action)) {
            return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            workerId,
            { role: action === "approve" ? "worker" : "citizen" },
            { new: true }
        ).lean();

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update Clerk publicMetadata
        const client = await clerkClient();
        await client.users.updateUserMetadata(updatedUser.clerkId, {
            publicMetadata: { role: updatedUser.role }
        });

        return NextResponse.json({
            success: true,
            message: action === "approve" ? "Worker approved!" : "Application rejected",
            role: updatedUser.role,
        });

    } catch (error) {
        console.error("[POST /api/workers/approve]", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}