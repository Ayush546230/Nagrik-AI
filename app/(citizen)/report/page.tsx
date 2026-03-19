"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { IncidentCategory } from "@/types";

const CATEGORIES: { value: IncidentCategory; label: string; emoji: string }[] = [
  { value: "pothole", label: "Pothole", emoji: "🕳️" },
  { value: "garbage", label: "Garbage", emoji: "🗑️" },
  { value: "streetlight", label: "Streetlight", emoji: "💡" },
  { value: "road_damage", label: "Road Damage", emoji: "🚧" },
  { value: "waterlogging", label: "Waterlogging", emoji: "💧" },
  { value: "encroachment", label: "Encroachment", emoji: "⛔" },
  { value: "other", label: "Other", emoji: "📍" },
];

export default function ReportPage() {
  const router = useRouter();
  const [category, setCategory] = useState<IncidentCategory>("pothole");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get GPS location
  const getLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success("Location captured!");
      },
      () => {
        setLocating(false);
        toast.error("Location access denied. Please allow location.");
      }
    );
  };

  // Handle file select
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!location) getLocation();
  };

  // Submit report
  const handleSubmit = async () => {
    if (!file) return toast.error("Please select a photo");
    if (!location) return toast.error("Please allow location access");

    setSubmitting(true);

    try {
      // Step 1: Get pre-signed URL
      const presignRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `before-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      if (!presignRes.ok) {
        const err = await presignRes.json();
        throw new Error(err.error);
      }

      const { url: uploadUrl, fields, s3Key } = await presignRes.json();

      // Step 2: Upload to S3
      const formData = new FormData();
      Object.entries(fields as Record<string, string>).forEach(([k, v]) =>
        formData.append(k, v)
      );
      formData.append("file", file);

      const uploadRes = await fetch(uploadUrl, { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Failed to upload image");

      // Step 3: Create incident
      const incidentRes = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          s3Key,
          lat: location.lat,
          lng: location.lng,
          categoryHint: category,
          userDescription: description,
        }),
      });

      const data = await incidentRes.json();

      if (!incidentRes.ok) throw new Error(data.error);

      if (data.isDuplicate) {
        toast.success("Similar issue found nearby — your vote has been added! 👍");
      } else {
        toast.success("Issue reported successfully! AI is validating your photo. ✅");
      }

      router.push("/my-reports");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Report an Issue
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>AI will validate and categorize your report automatically</p>
      </div>

      <div style={{ width: "100%", maxWidth: 700 }}>
        <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 12, padding: 28 }}>

          {/* Category */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
              Issue Category <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <button key={cat.value} onClick={() => setCategory(cat.value)} style={{
                  background: category === cat.value ? "rgba(6,182,212,0.1)" : "#0A0F1E",
                  border: `1px solid ${category === cat.value ? "#06B6D4" : "#1F2937"}`,
                  borderRadius: 8, padding: "10px 8px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.emoji}</div>
                  <div style={{ fontSize: 11, color: category === cat.value ? "#06B6D4" : "#6B7280" }}>
                    {cat.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
              Photo <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <label style={{
              display: "block",
              border: `2px dashed ${preview ? "#06B6D4" : "#1F2937"}`,
              borderRadius: 10, padding: preview ? 8 : 32,
              textAlign: "center", cursor: "pointer",
              transition: "all 0.15s",
              background: preview ? "transparent" : "#0A0F1E",
            }}>
              <input type="file" accept="image/*" capture="environment"
                style={{ display: "none" }} onChange={handleFile} />
              {preview ? (
                <img src={preview} alt="Preview" style={{
                  width: "100%", maxHeight: 200,
                  objectFit: "cover", borderRadius: 8,
                }} />
              ) : (
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                  <div style={{ fontSize: 14, color: "#6B7280" }}>
                    <span style={{ color: "#06B6D4" }}>Click to upload</span> or take photo
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                    JPG, PNG, WEBP • Max 10MB
                  </div>
                </>
              )}
            </label>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
              Location
            </label>
            {location ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: "#22C55E",
              }}>
                📍 {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E — Captured ✓
              </div>
            ) : (
              <button onClick={getLocation} disabled={locating} style={{
                background: "#0A0F1E", border: "1px solid #1F2937",
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: "#6B7280", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                {locating ? "Getting location..." : "📍 Detect My Location"}
              </button>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any extra details about the issue..."
              maxLength={500}
              rows={3}
              style={{
                width: "100%", background: "#0A0F1E",
                border: "1px solid #1F2937", borderRadius: 8,
                padding: "10px 14px", fontSize: 14,
                color: "#F9FAFB", outline: "none",
                resize: "none", fontFamily: "DM Sans, sans-serif",
              }}
            />
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={submitting || !file} style={{
            width: "100%", padding: 14, borderRadius: 10,
            background: submitting || !file ? "#1F2937" : "#06B6D4",
            color: submitting || !file ? "#6B7280" : "#0A0F1E",
            fontSize: 15, fontWeight: 600, border: "none",
            cursor: submitting || !file ? "not-allowed" : "pointer",
            fontFamily: "Syne, sans-serif", transition: "all 0.15s",
          }}>
            {submitting ? "Submitting..." : "Submit Report →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#6B7280" }}>
            AI will validate your photo before submitting
          </div>
        </div>
      </div>
    </div>
  );
}
