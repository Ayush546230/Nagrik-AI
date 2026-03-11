import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { User } from "@/lib/db/models/User";
import { CATEGORY_EMOJI, CATEGORY_LABELS, timeAgo, getSeverityLabel } from "@/lib/utils";
import type { IncidentCategory } from "@/types";
import Link from "next/link";

export default async function WorkerTasksPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();

  const currentUser = await User.findOne({ clerkId: userId }).lean();
  if (!currentUser || currentUser.role !== "worker") redirect("/dashboard");

  const tasks = await Incident.find({ assignedTo: userId })
    .sort({ priorityScore: -1, createdAt: -1 })
    .lean();

  const active = tasks.filter(t => ["assigned", "in_progress"].includes(t.status));
  const completed = tasks.filter(t => t.status === "resolved");

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          All Tasks
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          {active.length} active • {completed.length} completed
        </p>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
            Active Tasks
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {active.map((task) => {
              const isUrgent = task.aiAnalysis.severity >= 7;
              const isMedium = task.aiAnalysis.severity >= 4;
              const borderColor = isUrgent ? "#EF4444" : isMedium ? "#F59E0B" : "#22C55E";
              return (
                <div key={task._id.toString()} style={{
                  background: "#111827", border: "1px solid #1F2937",
                  borderLeft: `3px solid ${borderColor}`,
                  borderRadius: 11, padding: 16,
                  display: "flex", gap: 14, alignItems: "center",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, background: "#0A0F1E",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {CATEGORY_EMOJI[task.aiAnalysis.category as IncidentCategory]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
                      {CATEGORY_LABELS[task.aiAnalysis.category as IncidentCategory]}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      {timeAgo(task.createdAt)} • {getSeverityLabel(task.aiAnalysis.severity)}
                    </div>
                  </div>
                  <Link href={`/worker/tasks/${task._id}`} style={{
                    background: "#06B6D4", color: "#0A0F1E",
                    borderRadius: 6, padding: "6px 14px",
                    fontSize: 12, fontWeight: 600, textDecoration: "none",
                  }}>
                    Open →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#6B7280" }}>
            Completed
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {completed.map((task) => (
              <div key={task._id.toString()} style={{
                background: "#111827", border: "1px solid #1F2937",
                borderLeft: "3px solid #22C55E",
                borderRadius: 11, padding: 16,
                display: "flex", gap: 14, alignItems: "center",
                opacity: 0.7,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8, background: "#0A0F1E",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>
                  {CATEGORY_EMOJI[task.aiAnalysis.category as IncidentCategory]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
                    {CATEGORY_LABELS[task.aiAnalysis.category as IncidentCategory]}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    Resolved {task.resolvedAt ? timeAgo(task.resolvedAt) : ""}
                  </div>
                </div>
                <span className="badge badge-green">Resolved ✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div style={{
          background: "#111827", border: "1px solid #1F2937",
          borderRadius: 12, padding: 60, textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 600 }}>
            No tasks yet
          </div>
        </div>
      )}
    </div>
  );
}