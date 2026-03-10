import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { User } from "@/lib/db/models/User";
import { STATUS_LABELS, STATUS_BADGE, CATEGORY_EMOJI, CATEGORY_LABELS, timeAgo } from "@/lib/utils";
import type { IncidentCategory, IncidentStatus } from "@/types";
import MapWrapper from "@/components/MapWrapper";

export default async function AdminDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();

  const currentUser = await User.findOne({ clerkId: userId }).lean();
  if (!currentUser || currentUser.role !== "admin") redirect("/dashboard");

  const [totalActive, resolvedToday, critical, activeWorkers, recentIncidents, allActiveIncidents] = await Promise.all([
    Incident.countDocuments({ status: { $in: ["verified", "assigned", "in_progress"] } }),
    Incident.countDocuments({
      status: "resolved",
      resolvedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    Incident.countDocuments({
      status: { $in: ["verified", "assigned", "in_progress"] },
      "aiAnalysis.severity": { $gte: 7 },
    }),
    User.countDocuments({ role: "worker" }),
    Incident.find({ status: { $in: ["verified", "assigned", "in_progress", "reported"] } })
      .sort({ priorityScore: -1 })
      .limit(6)
      .lean(),
    Incident.find({ status: { $in: ["verified", "assigned", "in_progress", "reported"] } })
      .select("location aiAnalysis._id aiAnalysis.severity aiAnalysis.category")
      .limit(100)
      .lean(),
  ]);

  const kpis = [
    { label: "Total Active", value: totalActive, color: "#EF4444" },
    { label: "Resolved Today", value: resolvedToday, color: "#22C55E" },
    { label: "Critical (7+)", value: critical, color: "#EF4444" },
    { label: "Workers", value: activeWorkers, color: "#06B6D4" },
  ];

  const mapMarkers = allActiveIncidents.map((inc) => ({
    lat: inc.location.coordinates[1],
    lng: inc.location.coordinates[0],
    severity: inc.aiAnalysis.severity,
    category: inc.aiAnalysis.category,
    label: `${CATEGORY_LABELS[inc.aiAnalysis.category as IncidentCategory]} — Severity ${inc.aiAnalysis.severity}/10`,
    id: inc._id.toString(),
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>City-wide incident overview</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{
            background: "#111827", border: "1px solid #1F2937",
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {kpi.label}
            </div>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 700, color: kpi.color }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Live Map */}
      <div style={{
        background: "#0D1424", border: "1px solid #1F2937",
        borderRadius: 12, marginBottom: 24, overflow: "hidden",
      }}>
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #1F2937",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 600 }}>
            🗺️ Live Incident Map
          </span>
          <div style={{ fontSize: 12, color: "#6B7280", display: "flex", gap: 12 }}>
            <span>🔴 Critical</span>
            <span>🟡 Medium</span>
            <span>🟢 Low</span>
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <MapWrapper
            markers={mapMarkers}
            height={320}
            zoom={12}
          />
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 12, overflow: "hidden" }}>
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #1F2937",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 600 }}>
            Recent Incidents
          </span>
          <a href="/admin/incidents" style={{ fontSize: 12, color: "#06B6D4", textDecoration: "none" }}>
            View All →
          </a>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Category", "Location", "Severity", "Status", "Reported", "Action"].map((h) => (
                  <th key={h} style={{
                    padding: "10px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 600, color: "#6B7280",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                    borderBottom: "1px solid #1F2937",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#6B7280", fontSize: 13 }}>
                    No active incidents
                  </td>
                </tr>
              ) : (
                recentIncidents.map((incident) => (
                  <tr key={incident._id.toString()} style={{ borderBottom: "1px solid rgba(31,41,55,0.5)" }}>
                    <td style={{ padding: "12px 16px", fontSize: 14 }}>
                      {CATEGORY_EMOJI[incident.aiAnalysis.category as IncidentCategory]} {CATEGORY_LABELS[incident.aiAnalysis.category as IncidentCategory]}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>
                      {incident.location.coordinates[1].toFixed(3)}°N, {incident.location.coordinates[0].toFixed(3)}°E
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
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B7280" }}>
                      {timeAgo(incident.createdAt)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <a href={`/admin/incidents/${incident._id}`} style={{
                        fontSize: 12, color: "#06B6D4", textDecoration: "none",
                        padding: "4px 10px", border: "1px solid rgba(6,182,212,0.2)",
                        borderRadius: 6, background: "rgba(6,182,212,0.05)",
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