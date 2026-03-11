"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Worker = {
  _id: string;
  name: string;
  email: string;
  role: string;
  resolvedCount: number;
  reportCount: number;
};

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [pending, setPending] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/workers");
    const data = await res.json();
    setWorkers(data.workers ?? []);
    setPending(data.pending ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (workerId: string, action: "approve" | "reject") => {
    const res = await fetch("/api/workers/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId, action }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      fetchUsers();
    } else {
      toast.error(data.error);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#6B7280" }}>
      Loading...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Workers
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          {workers.length} active workers • {pending.length} pending approval
        </p>
      </div>

      {/* Pending Approvals */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#F59E0B" }}>
            ⏳ Pending Approvals ({pending.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pending.map((user) => (
              <div key={user._id} style={{
                background: "#111827",
                border: "1px solid rgba(245,158,11,0.2)",
                borderLeft: "3px solid #F59E0B",
                borderRadius: 11, padding: 16,
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "#F59E0B", color: "#0A0F1E",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15,
                  flexShrink: 0,
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{user.email}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleAction(user._id, "approve")} style={{
                    background: "rgba(34,197,94,0.1)", color: "#22C55E",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 7, padding: "7px 14px",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                  }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => handleAction(user._id, "reject")} style={{
                    background: "rgba(239,68,68,0.1)", color: "#EF4444",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 7, padding: "7px 14px",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                  }}>
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Workers */}
      <div>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
          Active Workers ({workers.length})
        </div>
        {workers.length === 0 ? (
          <div style={{
            background: "#111827", border: "1px solid #1F2937",
            borderRadius: 12, padding: 40, textAlign: "center",
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👷</div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>No active workers yet</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {workers.map((worker) => (
              <div key={worker._id} style={{
                background: "#111827", border: "1px solid #1F2937",
                borderRadius: 12, padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "#F59E0B", color: "#0A0F1E",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15,
                    flexShrink: 0,
                  }}>
                    {worker.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{worker.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{worker.email}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "#0A0F1E", borderRadius: 7, padding: "9px", textAlign: "center" }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#22C55E" }}>
                      {worker.resolvedCount}
                    </div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>Resolved</div>
                  </div>
                  <div style={{ background: "#0A0F1E", borderRadius: 7, padding: "9px", textAlign: "center" }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#06B6D4" }}>
                      {worker.reportCount}
                    </div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>Assigned</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}