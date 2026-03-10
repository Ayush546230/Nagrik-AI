import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { User } from "@/lib/db/models/User";
import { CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/utils";
import type { IncidentCategory } from "@/types";

export default async function AdminAnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();

  const currentUser = await User.findOne({ clerkId: userId }).lean();
  if (!currentUser || currentUser.role !== "admin") redirect("/dashboard");

  const [total, resolved, rejected, categoryStats] = await Promise.all([
    Incident.countDocuments(),
    Incident.countDocuments({ status: "resolved" }),
    Incident.countDocuments({ status: "rejected" }),
    Incident.aggregate([
      { $group: { _id: "$aiAnalysis.category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const spamRate = total > 0 ? Math.round((rejected / total) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Analytics
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>Platform performance overview</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Reports", value: total, color: "#06B6D4" },
          { label: "Resolved", value: resolved, color: "#22C55E" },
          { label: "Resolution Rate", value: `${resolutionRate}%`, color: "#22C55E" },
          { label: "Spam Rate", value: `${spamRate}%`, color: "#EF4444" },
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

      {/* Category Breakdown */}
      <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 12, padding: 24 }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
          Category Breakdown
        </div>

        {categoryStats.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6B7280", padding: 40 }}>No data yet</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {categoryStats.map((cat) => {
              const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
              return (
                <div key={cat._id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span>
                      {CATEGORY_EMOJI[cat._id as IncidentCategory]} {CATEGORY_LABELS[cat._id as IncidentCategory] ?? cat._id}
                    </span>
                    <span style={{ color: "#6B7280" }}>{cat.count} ({pct}%)</span>
                  </div>
                  <div style={{ background: "#0A0F1E", borderRadius: 99, height: 8, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: "#06B6D4", borderRadius: 99,
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}