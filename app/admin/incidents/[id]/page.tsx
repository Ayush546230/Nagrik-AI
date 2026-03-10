"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { STATUS_LABELS, STATUS_BADGE, CATEGORY_EMOJI, CATEGORY_LABELS, timeAgo, getSeverityLabel } from "@/lib/utils";
import type { IIncident, IncidentCategory, IncidentStatus } from "@/types";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function IncidentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [incident, setIncident] = useState<IIncident & { beforeImageUrl?: string; afterImageUrl?: string } | null>(null);
  const [workers, setWorkers] = useState<{ _id: string; name: string; clerkId: string }[]>([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/incidents/${id}`).then(r => r.json()),
      fetch("/api/workers").then(r => r.json()),
    ]).then(([inc, wrk]) => {
      setIncident(inc);
      setWorkers(wrk.workers ?? []);
      setLoading(false);
    });
  }, [id]);

  const assignWorker = async () => {
    if (!selectedWorker) return toast.error("Select a worker first");
    setAssigning(true);
    const res = await fetch(`/api/incidents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedTo: selectedWorker }),
    });
    if (res.ok) {
      toast.success("Worker assigned!");
      router.refresh();
    } else {
      toast.error("Failed to assign worker");
    }
    setAssigning(false);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#6B7280" }}>
      Loading...
    </div>
  );

  if (!incident) return (
    <div style={{ textAlign: "center", padding: 60, color: "#6B7280" }}>
      Incident not found
    </div>
  );

  const lat = incident.location.coordinates[1];
  const lng = incident.location.coordinates[0];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.back()} style={{
          background: "#111827", border: "1px solid #1F2937",
          borderRadius: 8, padding: "8px 14px",
          color: "#6B7280", cursor: "pointer", fontSize: 13,
        }}>← Back</button>
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700 }}>
            {CATEGORY_EMOJI[incident.aiAnalysis.category as IncidentCategory]} {CATEGORY_LABELS[incident.aiAnalysis.category as IncidentCategory]}
          </h1>
          <p style={{ fontSize: 12, color: "#6B7280" }}>Reported {timeAgo(incident.createdAt)}</p>
        </div>
        <span className={`badge ${STATUS_BADGE[incident.status as IncidentStatus]}`} style={{ marginLeft: "auto" }}>
          {STATUS_LABELS[incident.status as IncidentStatus]}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left — Photos + Map */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Before Photo */}
          <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #1F2937", fontSize: 13, fontWeight: 600 }}>
              📸 Before Photo
            </div>
            {incident.beforeImageUrl ? (
              <img src={incident.beforeImageUrl} alt="Before" style={{ width: "100%", height: 240, objectFit: "cover" }} />
            ) : (
              <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}>
                No image
              </div>
            )}
          </div>

          {/* After Photo */}
          {incident.afterImageUrl && (
            <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #1F2937", fontSize: 13, fontWeight: 600 }}>
                ✅ After Photo
              </div>
              <img src={incident.afterImageUrl} alt="After" style={{ width: "100%", height: 240, objectFit: "cover" }} />
            </div>
          )}

          {/* Location Map */}
          <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #1F2937", fontSize: 13, fontWeight: 600 }}>
              📍 Location
            </div>
            <div style={{ padding: 12 }}>
              <Map
                markers={[{
                  lat,
                  lng,
                  severity: incident.aiAnalysis.severity,
                  label: CATEGORY_LABELS[incident.aiAnalysis.category as IncidentCategory],
                }]}
                height={200}
                zoom={15}
                center={[lat, lng]}
              />
            </div>
            <div style={{ padding: "8px 16px 12px", fontSize: 12, color: "#6B7280" }}>
              {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
            </div>
          </div>
        </div>

        {/* Right — Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* AI Analysis */}
          <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
              🤖 AI Analysis
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#6B7280" }}>Severity</span>
                <span className={`badge ${incident.aiAnalysis.severity >= 7 ? "badge-red" : incident.aiAnalysis.severity >= 4 ? "badge-amber" : "badge-green"}`}>
                  {incident.aiAnalysis.severity}/10 — {getSeverityLabel(incident.aiAnalysis.severity)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#6B7280" }}>Upvotes</span>
                <span>👍 {incident.upvotes}</span>
              </div>
              <div style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.6, paddingTop: 8, borderTop: "1px solid #1F2937" }}>
                {incident.aiAnalysis.description}
              </div>
            </div>
          </div>

          {/* AI Resolution */}
          {incident.aiResolution && (
            <div style={{
              background: incident.aiResolution.resolved ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
              border: `1px solid ${incident.aiResolution.resolved ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: 12, padding: 20,
            }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                {incident.aiResolution.resolved ? "✅ Resolved" : "❌ Not Verified"}
              </div>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>{incident.aiResolution.notes}</div>
            </div>
          )}

          {/* Assign Worker */}
          {!["resolved", "closed", "rejected"].includes(incident.status) && (
            <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
                👷 Assign Worker
              </div>
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                style={{
                  width: "100%", background: "#0A0F1E",
                  border: "1px solid #1F2937", borderRadius: 8,
                  padding: "10px 14px", fontSize: 14,
                  color: "#F9FAFB", outline: "none", marginBottom: 12,
                }}
              >
                <option value="">Select a worker...</option>
                {workers.map((w) => (
                  <option key={w._id} value={w.clerkId}>{w.name}</option>
                ))}
              </select>
              <button onClick={assignWorker} disabled={assigning} style={{
                width: "100%", padding: "10px",
                background: "#06B6D4", color: "#0A0F1E",
                border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 600,
                cursor: assigning ? "not-allowed" : "pointer",
                opacity: assigning ? 0.7 : 1,
              }}>
                {assigning ? "Assigning..." : "Assign Worker"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}