"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RoleSelectPage() {
    const router = useRouter();
    const [role, setRole] = useState<"citizen" | "pending_worker">("citizen");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });
            if (res.ok) {
                router.push(role === "pending_worker" ? "/pending-approval" : "/dashboard");
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: "100vh", background: "#0A0F1E",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, position: "relative", overflow: "hidden",
        }}>
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 38, height: 38, background: "#06B6D4", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏙️</div>
                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: "#F9FAFB" }}>
                        Nagrik AI
                    </span>
                </div>

                <div style={{
                    background: "#111827", border: "1px solid #1F2937",
                    borderRadius: 14, padding: 32, width: 400,
                    display: "flex", flexDirection: "column", gap: 20,
                }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 4 }}>
                            One last step! 🎉
                        </div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>How will you use Nagrik?</div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { value: "citizen", icon: "👤", title: "Citizen", desc: "Report civic issues in your city" },
                            { value: "pending_worker", icon: "👷", title: "Field Worker", desc: "Apply to resolve civic issues" },
                        ].map((r) => (
                            <button key={r.value} onClick={() => setRole(r.value as typeof role)} style={{
                                background: role === r.value ? "rgba(6,182,212,0.1)" : "#0A0F1E",
                                border: `1px solid ${role === r.value ? "#06B6D4" : "#1F2937"}`,
                                borderRadius: 10, padding: "14px 16px",
                                cursor: "pointer", textAlign: "left",
                                display: "flex", gap: 12, alignItems: "center",
                                transition: "all 0.15s",
                            }}>
                                <span style={{ fontSize: 26 }}>{r.icon}</span>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: role === r.value ? "#06B6D4" : "#F9FAFB", marginBottom: 2 }}>
                                        {r.title}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#6B7280" }}>{r.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button onClick={handleSubmit} disabled={loading} style={{
                        width: "100%", padding: 12, borderRadius: 8,
                        background: loading ? "#1F2937" : "#06B6D4",
                        color: loading ? "#6B7280" : "#0A0F1E",
                        border: "none", fontSize: 14, fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        fontFamily: "DM Sans, sans-serif",
                    }}>
                        {loading ? "Saving..." : "Continue →"}
                    </button>
                </div>
            </div>
        </main>
    );
}