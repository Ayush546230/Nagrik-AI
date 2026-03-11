"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CATEGORY_EMOJI, CATEGORY_LABELS, timeAgo, getSeverityLabel } from "@/lib/utils";
import type { IIncident, IncidentCategory } from "@/types";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function WorkerTaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [incident, setIncident] = useState<IIncident & { beforeImageUrl?: string; afterImageUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ resolved: boolean; notes: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/incidents/${id}`)
      .then(r => r.json())
      .then(data => { setIncident(data); setLoading(false); });
  }, [id]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleResolve = async () => {
    if (!file || !id) return toast.error("Upload after photo first");
    setSubmitting(true);

    try {
      const presignRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `after-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      const presignData = await presignRes.json();
      const { url, fields, s3Key } = presignData;

      if (!url || !s3Key) {
        toast.error("Failed to get upload URL");
        return;
      }

      const formData = new FormData();
      Object.entries(fields as Record<string, string>).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", file);

      const uploadRes = await fetch(url, { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        console.error("S3 Upload Error:", text);
        toast.error("Photo upload to S3 failed!");
        return;
      }

      const resolveRes = await fetch(`/api/incidents/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ afterS3Key: s3Key }),
      });
      const data = await resolveRes.json();

      if (!resolveRes.ok) {
        toast.error(data.error ?? "Verification failed");
        return;
      }

      setResult({ resolved: data.resolved, notes: data.notes });

      if (data.resolved) {
        toast.success("Issue verified as resolved! ✅");
        setTimeout(() => router.push("/worker/tasks"), 2000);
      } else {
        toast.error("Not verified — please re-check the issue");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#6B7280" }}>
      Loading...
    </div>
  );

  if (!incident) return (
    <div style={{ textAlign: "center", padding: 60, color: "#6B7280" }}>Task not found</div>
  );

  const isUrgent = incident.aiAnalysis.severity >= 7;
  const isMedium = incident.aiAnalysis.severity >= 4;
  const borderColor = isUrgent ? "#EF4444" : isMedium ? "#F59E0B" : "#22C55E";
  const lat = incident.location.coordinates[1];
  const lng = incident.location.coordinates[0];

  return (
    <div style={{ maxWidth: 600 }}>
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
          <p style={{ fontSize: 12, color: "#6B7280" }}>Assigned {timeAgo(incident.createdAt)}</p>
        </div>
      </div>

      {/* Before Photo */}
      <div style={{
        background: "#111827", border: "1px solid #1F2937",
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 12, overflow: "hidden", marginBottom: 16,
      }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #1F2937", fontSize: 13, fontWeight: 600 }}>
          📸 Before Photo
        </div>
        {incident.beforeImageUrl ? (
          <img src={incident.beforeImageUrl} alt="Before" style={{ width: "100%", height: 220, objectFit: "cover" }} />
        ) : (
          <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}>
            No image available
          </div>
        )}
      </div>

      {/* Location Map */}
      <div style={{
        background: "#111827", border: "1px solid #1F2937",
        borderRadius: 12, overflow: "hidden", marginBottom: 16,
      }}>
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
        <div style={{ padding: "6px 16px 12px", fontSize: 12, color: "#6B7280" }}>
          {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
        </div>
      </div>

      {/* Issue Info */}
      <div style={{
        background: "#111827", border: "1px solid #1F2937",
        borderRadius: 12, padding: 18, marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
          <span style={{ color: "#6B7280" }}>Severity</span>
          <span className={`badge ${isUrgent ? "badge-red" : isMedium ? "badge-amber" : "badge-green"}`}>
            {getSeverityLabel(incident.aiAnalysis.severity)} — {incident.aiAnalysis.severity}/10
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>
          {incident.aiAnalysis.description}
        </div>
        {incident.userDescription && (
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 8, paddingTop: 8, borderTop: "1px solid #1F2937" }}>
            User note: {incident.userDescription}
          </div>
        )}
      </div>

      {/* AI Result Banner */}
      {result && (
        <div style={{
          background: result.resolved ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${result.resolved ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          borderRadius: 12, padding: 16, marginBottom: 16,
        }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
            {result.resolved ? "✅ Verified — Issue Resolved!" : "❌ Not Verified"}
          </div>
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>{result.notes}</div>
        </div>
      )}

      {/* Upload After Photo */}
      {incident.status !== "resolved" && !result?.resolved && (
        <div style={{
          background: "#111827", border: "1px solid #1F2937",
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
            📷 Upload After Photo
          </div>

          <label style={{
            display: "block",
            border: `2px dashed ${preview ? "#06B6D4" : "#1F2937"}`,
            borderRadius: 10, padding: preview ? 8 : 28,
            textAlign: "center", cursor: "pointer", marginBottom: 14,
          }}>
            <input type="file" accept="image/*" capture="environment"
              style={{ display: "none" }} onChange={handleFile} />
            {preview ? (
              <img src={preview} alt="After" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }} />
            ) : (
              <>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📸</div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  <span style={{ color: "#06B6D4" }}>Tap to capture</span> after photo
                </div>
              </>
            )}
          </label>

          <button onClick={handleResolve} disabled={submitting || !file} style={{
            width: "100%", padding: 13, borderRadius: 9,
            background: submitting || !file ? "#1F2937" : "#06B6D4",
            color: submitting || !file ? "#6B7280" : "#0A0F1E",
            fontSize: 14, fontWeight: 700, border: "none",
            cursor: submitting || !file ? "not-allowed" : "pointer",
            fontFamily: "Syne, sans-serif",
          }}>
            {submitting ? "AI Verifying..." : "Submit for Verification →"}
          </button>
        </div>
      )}
    </div>
  );
}