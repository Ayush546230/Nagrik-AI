import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { User } from "@/lib/db/models/User";
import { CATEGORY_EMOJI, CATEGORY_LABELS, timeAgo, getSeverityLabel } from "@/lib/utils";
import type { IncidentCategory } from "@/types";
import Link from "next/link";

export default async function WorkerDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();

  const currentUser = await User.findOne({ clerkId: userId }).lean();
  if (!currentUser) redirect("/sign-in");
  if (currentUser.role !== "worker") redirect("/sign-in");
  const [assignedTasks, resolvedToday] = await Promise.all([
    Incident.find({
      assignedTo: userId,
      status: { $in: ["assigned", "in_progress"] },
    })
      .sort({ priorityScore: -1 })
      .lean(),
    Incident.countDocuments({
      assignedTo: userId,
      status: "resolved",
      resolvedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
  ]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          My Tasks
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          {assignedTasks.length} active task{assignedTasks.length !== 1 ? "s" : ""} assigned
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Active Tasks", value: assignedTasks.length, color: "#F59E0B" },
          { label: "Resolved Today", value: resolvedToday, color: "#22C55E" },
          { label: "Total Resolved", value: currentUser.resolvedCount, color: "#06B6D4" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#111827", border: "1px solid #1F2937",
            borderRadius: 11, padding: 18, textAlign: "center",
          }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 700, color: s.color, marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Task List */}
      {assignedTasks.length === 0 ? (
        <div style={{
          background: "#111827", border: "1px solid #1F2937",
          borderRadius: 12, padding: 60, textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            All caught up!
          </div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>No tasks assigned right now.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {assignedTasks.map((task) => {
            const isUrgent = task.aiAnalysis.severity >= 7;
            const isMedium = task.aiAnalysis.severity >= 4;
            const borderColor = isUrgent ? "#EF4444" : isMedium ? "#F59E0B" : "#22C55E";

            return (
              <div key={task._id.toString()} style={{
                background: "#111827",
                border: "1px solid #1F2937",
                borderLeft: `3px solid ${borderColor}`,
                borderRadius: 11, padding: 16,
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
                {/* Icon */}
                <div style={{
                  width: 42, height: 42, borderRadius: 9,
                  background: "#0A0F1E",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>
                  {CATEGORY_EMOJI[task.aiAnalysis.category as IncidentCategory]}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                    {CATEGORY_LABELS[task.aiAnalysis.category as IncidentCategory]}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
                    📍 {task.location.coordinates[1].toFixed(4)}°N, {task.location.coordinates[0].toFixed(4)}°E • {timeAgo(task.createdAt)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className={`badge ${isUrgent ? "badge-red" : isMedium ? "badge-amber" : "badge-green"}`}>
                      {getSeverityLabel(task.aiAnalysis.severity)} {task.aiAnalysis.severity}/10
                    </span>
                    <Link href={`/worker/tasks/${task._id}`} style={{
                      background: "#06B6D4", color: "#0A0F1E",
                      borderRadius: 6, padding: "6px 14px",
                      fontSize: 12, fontWeight: 600, textDecoration: "none",
                    }}>
                      View Task →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}