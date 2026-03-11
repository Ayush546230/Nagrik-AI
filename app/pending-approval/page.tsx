import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { SignOutButton } from "@clerk/nextjs";

export default async function PendingApprovalPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    await connectDB();
    const user = await User.findOne({ clerkId: userId }).lean();

    if (!user) redirect("/sign-in");
    if (user.role === "admin") redirect("/admin/dashboard");
    if (user.role === "worker") redirect("/worker/dashboard");
    if (user.role === "citizen") redirect("/dashboard");

    return (
        <main style={{
            minHeight: "100vh",
            background: "#0A0F1E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            position: "relative",
            overflow: "hidden",
        }}>
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage:
                    "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }} />

            <div style={{
                position: "relative", zIndex: 1,
                background: "#111827", border: "1px solid #1F2937",
                borderRadius: 16, padding: 40,
                maxWidth: 460, width: "100%",
                textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                    <div style={{
                        width: 38, height: 38, background: "#06B6D4",
                        borderRadius: 9, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 18,
                    }}>🏙️</div>
                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "#F9FAFB" }}>
                        Nagrik AI
                    </span>
                </div>

                <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28,
                }}>⏳</div>

                <div>
                    <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                        Application Under Review
                    </h1>
                    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>
                        Your worker application has been submitted successfully.
                        An admin will review and approve your account shortly.
                    </p>
                </div>

                <div style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: 10, padding: "14px 20px",
                    width: "100%",
                }}>
                    <div style={{ fontSize: 13, color: "#F59E0B", fontWeight: 600, marginBottom: 4 }}>
                        Status: Pending Approval
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                        You will be notified once your account is approved
                    </div>
                </div>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                        { step: "1", label: "Account Created", done: true },
                        { step: "2", label: "Admin Review", done: false },
                        { step: "3", label: "Account Activated", done: false },
                    ].map((s) => (
                        <div key={s.step} style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "10px 14px",
                            background: "#0A0F1E", borderRadius: 8,
                        }}>
                            <div style={{
                                width: 24, height: 24, borderRadius: "50%",
                                background: s.done ? "#22C55E" : "#1F2937",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 700,
                                color: s.done ? "#0A0F1E" : "#6B7280",
                                flexShrink: 0,
                            }}>
                                {s.done ? "✓" : s.step}
                            </div>
                            <span style={{ fontSize: 13, color: s.done ? "#F9FAFB" : "#6B7280" }}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <a href="/" style={{ fontSize: 13, color: "#06B6D4", textDecoration: "none", marginTop: 4 }}>
                    ← Back to Home
                </a>

                <SignOutButton redirectUrl="/sign-in">
                    <button style={{
                        background: "none",
                        border: "1px solid #1F2937",
                        borderRadius: 8,
                        padding: "8px 20px",
                        fontSize: 13, color: "#6B7280",
                        cursor: "pointer",
                        width: "100%",
                    }}>
                        Sign Out
                    </button>
                </SignOutButton>
            </div>
        </main>
    );
}