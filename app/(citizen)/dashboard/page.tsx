import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { User } from "@/lib/db/models/User";
import { STATUS_LABELS, STATUS_BADGE, CATEGORY_EMOJI, CATEGORY_LABELS, timeAgo, getSeverityLabel, getSeverityBadgeClass } from "@/lib/utils";
import type { IncidentCategory, IncidentStatus } from "@/types";

export default async function CitizenDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();

  const [user, incidents] = await Promise.all([
    User.findOne({ clerkId: userId }).lean(),
    Incident.find({ reportedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  // Handle server-side redirection based on live DB role
  if (user?.role === "admin") redirect("/admin/dashboard");
  if (user?.role === "worker") redirect("/worker/dashboard");
  if (user?.role === "pending_worker") redirect("/pending-approval");



  const resolved = incidents.filter(i => i.status === "resolved").length;
  const inProgress = incidents.filter(i => ["assigned", "in_progress", "verified"].includes(i.status)).length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Welcome back, {user?.name?.split(" ")[0] ?? "User"} 👋
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>Here's what's happening in your city</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "My Reports", value: user?.reportCount ?? 0, color: "#06B6D4" },
          { label: "Resolved", value: resolved, color: "#22C55E" },
          { label: "In Progress", value: inProgress, color: "#F59E0B" },
        ].map((kpi) => (
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

      {/* Report Button */}
      <Link href="/report" style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        background: "#06B6D4", color: "#0A0F1E",
        borderRadius: 12, padding: "14px 24px",
        fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700,
        textDecoration: "none", marginBottom: 24,
        transition: "opacity 0.15s",
      }}>
        📸 Report New Issue
      </Link>

      {/* Recent Reports */}
      <div>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 14 }}>
          Recent Reports
        </div>

        {incidents.length === 0 ? (
          <div style={{
            background: "#111827", border: "1px solid #1F2937",
            borderRadius: 12, padding: 40, textAlign: "center", color: "#6B7280",
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div>No reports yet — be the first to report an issue!</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {incidents.map((incident) => (
              <div key={incident._id.toString()} style={{
                background: "#111827", border: "1px solid #1F2937",
                borderRadius: 10, padding: 16,
                display: "flex", alignItems: "center", gap: 14,
              }}>
                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: "rgba(6,182,212,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>
                  {CATEGORY_EMOJI[incident.aiAnalysis.category as IncidentCategory]}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>
                    {CATEGORY_LABELS[incident.aiAnalysis.category as IncidentCategory]}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {timeAgo(incident.createdAt)} • Severity: {getSeverityLabel(incident.aiAnalysis.severity)}
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`badge ${STATUS_BADGE[incident.status as IncidentStatus]}`}>
                  {STATUS_LABELS[incident.status as IncidentStatus]}
                </span>
              </div>
            ))}
          </div>
        )}

        {incidents.length > 0 && (
          <Link href="/my-reports" style={{
            display: "block", textAlign: "center", marginTop: 14,
            fontSize: 13, color: "#06B6D4", textDecoration: "none",
          }}>
            View all reports →
          </Link>
        )}
      </div>
    </div>
  );
}
