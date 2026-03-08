import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { STATUS_LABELS, STATUS_BADGE, CATEGORY_EMOJI, CATEGORY_LABELS, timeAgo, getSeverityLabel } from "@/lib/utils";
import type { IncidentCategory, IncidentStatus } from "@/types";

export default async function MyReportsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();

  const incidents = await Incident.find({ reportedBy: userId })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          My Reports
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          {incidents.length} total report{incidents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Empty State */}
      {incidents.length === 0 ? (
        <div style={{
          background: "#111827", border: "1px solid #1F2937",
          borderRadius: 12, padding: 60, textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            No reports yet
          </div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            Start by reporting an issue in your city!
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {incidents.map((incident) => (
            <div key={incident._id.toString()} style={{
              background: "#111827",
              border: "1px solid #1F2937",
              borderRadius: 12, padding: 18,
              display: "flex", alignItems: "center", gap: 16,
            }}>
              {/* Category Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "rgba(6,182,212,0.1)",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22, flexShrink: 0,
              }}>
                {CATEGORY_EMOJI[incident.aiAnalysis.category as IncidentCategory]}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  {CATEGORY_LABELS[incident.aiAnalysis.category as IncidentCategory]}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", display: "flex", gap: 12 }}>
                  <span>{timeAgo(incident.createdAt)}</span>
                  <span>Severity: {getSeverityLabel(incident.aiAnalysis.severity)} ({incident.aiAnalysis.severity}/10)</span>
                  <span>👍 {incident.upvotes} upvotes</span>
                </div>
                {incident.userDescription && (
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {incident.userDescription}
                  </div>
                )}
              </div>

              {/* Status */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                <span className={`badge ${STATUS_BADGE[incident.status as IncidentStatus]}`}>
                  {STATUS_LABELS[incident.status as IncidentStatus]}
                </span>
                {incident.status === "resolved" && incident.resolvedAt && (
                  <span style={{ fontSize: 11, color: "#22C55E" }}>
                    ✓ {timeAgo(incident.resolvedAt)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
