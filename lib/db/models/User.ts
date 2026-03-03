import mongoose, { Schema, model, models } from "mongoose";
import type { IUser } from "@/types";

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: { type: String },
    role: {
      type: String,
      enum: ["citizen", "worker", "admin", "pending_worker"],
      default: "citizen",
    },
    reportCount: { type: Number, default: 0 },
    resolvedCount: { type: Number, default: 0 },
    spamCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);