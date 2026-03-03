import mongoose, { Schema, model, models } from "mongoose";
import type { IIncident } from "@/types";

const AIAnalysisSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["pothole", "garbage", "streetlight", "road_damage", "waterlogging", "encroachment", "other"],
      required: true,
    },
    severity: { type: Number, min: 1, max: 10, required: true },
    isSpam: { type: Boolean, required: true },
    spamReason: {
      type: String,
      enum: ["stock_photo", "indoor_image", "unrelated", "low_quality", null],
      default: null,
    },
    confidence: { type: Number, min: 0, max: 100, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const AIResolutionSchema = new Schema(
  {
    resolved: { type: Boolean, required: true },
    confidence: { type: Number, min: 0, max: 100, required: true },
    notes: { type: String, required: true },
    verifiedAt: { type: Date, required: true },
  },
  { _id: false }
);

const IncidentSchema = new Schema<IIncident>(
  {
    reportedBy: { type: String, required: true, index: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    beforeS3Key: { type: String, required: true },
    afterS3Key: { type: String },

    categoryHint: {
      type: String,
      enum: ["pothole", "garbage", "streetlight", "road_damage", "waterlogging", "encroachment", "other"],
      required: true,
    },
    userDescription: { type: String, maxlength: 500 },

    aiAnalysis: { type: AIAnalysisSchema, required: true },
    aiResolution: { type: AIResolutionSchema },

    status: {
      type: String,
      enum: ["reported", "verified", "assigned", "in_progress", "resolved", "rejected", "closed"],
      default: "reported",
      index: true,
    },

    priorityScore: { type: Number, default: 0, index: true },
    upvotes: { type: Number, default: 0 },

    assignedTo: { type: String, index: true },
    assignedAt: { type: Date },
    resolvedAt: { type: Date },
  },
  {
    timestamps: true, // auto createdAt + updatedAt
  }
);

// ── Indexes ──
IncidentSchema.index({ location: "2dsphere" }); // geospatial queries
IncidentSchema.index({ status: 1, priorityScore: -1 });
IncidentSchema.index({ reportedBy: 1, createdAt: -1 });
IncidentSchema.index({ assignedTo: 1, status: 1 });

export const Incident =
  models.Incident || model<IIncident>("Incident", IncidentSchema);