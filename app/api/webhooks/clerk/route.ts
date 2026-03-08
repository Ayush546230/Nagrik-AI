import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // ── Verify webhook signature ──
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: { type: string; data: Record<string, unknown> };

  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  await connectDB();
  const { type, data } = event;

  // ── Handle events ──
  switch (type) {
    case "user.created": {
      const emails = (data.email_addresses as Array<{ email_address: string }>) ?? [];
      await User.create({
        clerkId: data.id,
        email: emails[0]?.email_address ?? "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        avatarUrl: data.image_url,
        role: "citizen",
        reportCount: 0,
        resolvedCount: 0,
        spamCount: 0,
      });
      break;
    }

    case "user.updated": {
      const emails = (data.email_addresses as Array<{ email_address: string }>) ?? [];
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          email: emails[0]?.email_address ?? "",
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          avatarUrl: data.image_url,
        }
      );
      break;
    }

    case "user.deleted": {
      await User.findOneAndDelete({ clerkId: data.id });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
