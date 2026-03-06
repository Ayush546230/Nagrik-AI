import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ role: null });

    await connectDB();
    const user = await User.findOne({ clerkId: userId }).lean();
    return NextResponse.json({ role: user?.role ?? "citizen" });
}