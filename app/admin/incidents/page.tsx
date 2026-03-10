import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { User } from "@/lib/db/models/User";
import { STATUS_LABELS, STATUS_BADGE, CATEGORY_EMOJI, CATEGORY_LABELS, timeAgo } from "@/lib/utils";
import type { IncidentCategory, IncidentStatus } from "@/types";

export default async function AdminIncidentsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();

  const currentUser = await User.findOne({ clerkId: userId }).lean();
  if (!currentUser || currentUser.role !== "admin") redirect("/dashboard");

  const incidents = await Incident.find()
    .sort({ priorityScore: -1, createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          All Incidents
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          {incidents.length} incidents — sorted by priority
        </p>
      </div>

      {/* Table */}
      <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Category", "Description", "Severity", "Status", "Upvotes", "Reported", "Action"].map((h) => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 600, color: "#6B7280",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                    borderBottom: "1px solid #1F2937",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#6B7280", fontSize: 13 }}>
                    No incidents found
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr key={incident._id.toString()} style={{
                    borderBottom: "1px solid rgba(31,41,55,0.5)",
                    transition: "background 0.1s",
                  }}>
                    <td style={{ padding: "12px 16px", fontSize: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>
                          {CATEGORY_EMOJI[incident.aiAnalysis.category as IncidentCategory]}
                        </span>
                        <span>{CATEGORY_LABELS[incident.aiAnalysis.category as IncidentCategory]}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#9CA3AF", maxWidth: 200 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {incident.aiAnalysis.description}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={`badge ${incident.aiAnalysis.severity >= 7 ? "badge-red" : incident.aiAnalysis.severity >= 4 ? "badge-amber" : "badge-green"}`}>
                        {incident.aiAnalysis.severity}/10
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={`badge ${STATUS_BADGE[incident.status as IncidentStatus]}`}>
                        {STATUS_LABELS[incident.status as IncidentStatus]}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>
                      👍 {incident.upvotes}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280" }}>
                      {timeAgo(incident.createdAt)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <a href={`/admin/incidents/${incident._id}`} style={{
                        fontSize: 12, color: "#06B6D4", textDecoration: "none",
                        padding: "5px 12px",
                        border: "1px solid rgba(6,182,212,0.2)",
                        borderRadius: 6,
                        background: "rgba(6,182,212,0.05)",
                      }}>
                        View →
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}