"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer style={{
            background: "#0D1424",
            borderTop: "1px solid #1F2937",
            padding: "60px 48px 32px",
            color: "#F9FAFB",
        }}>
            {/* Top Section */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: 48,
                marginBottom: 48,
            }}>
                {/* Brand */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <div style={{
                            width: 36, height: 36,
                            background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                            borderRadius: 8,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18,
                            boxShadow: "0 0 20px rgba(6,182,212,0.3)",
                        }}>🏙️</div>
                        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20 }}>
                            Nagrik<span style={{ color: "#06B6D4" }}> AI</span>
                        </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.8, maxWidth: 280 }}>
                        An AI-powered smart city platform that validates civic issues,
                        eliminates duplicates, and connects citizens with authorities
                        for faster resolution.
                    </p>
                    <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
                        {[
                            { value: "94%", label: "AI Accuracy" },
                            { value: "2x", label: "Faster" },
                            { value: "24/7", label: "Monitoring" },
                        ].map((s) => (
                            <div key={s.label}>
                                <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#06B6D4" }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: 11, color: "#6B7280" }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Links */}
                <div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
                        Platform
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { label: "Report Issue", href: "/report" },
                            { label: "My Reports", href: "/my-reports" },
                            { label: "Dashboard", href: "/dashboard" },
                            { label: "Sign Up", href: "/sign-up" },
                            { label: "Sign In", href: "/sign-in" },
                        ].map((l) => (
                            <Link key={l.label} href={l.href} style={{
                                fontSize: 13, color: "#6B7280", textDecoration: "none",
                            }}>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Features */}
                <div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
                        Features
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            "AI Validation",
                            "Live Heatmap",
                            "Worker Management",
                            "Before/After Verify",
                            "Spam Detection",
                            "Priority Scoring",
                        ].map((f) => (
                            <div key={f} style={{ fontSize: 13, color: "#6B7280" }}>{f}</div>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
                        Contact
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <a href="tel:+919304049070" style={{
                            display: "flex", alignItems: "center", gap: 8,
                            fontSize: 13, color: "#6B7280", textDecoration: "none",
                        }}>
                            <span style={{
                                width: 28, height: 28, background: "rgba(6,182,212,0.1)",
                                border: "1px solid rgba(6,182,212,0.2)",
                                borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 14,
                            }}>📞</span>
                            +91 93040 49070
                        </a>

                        <a href="mailto:ayushsrivastava18623@gmail.com" style={{
                            display: "flex", alignItems: "flex-start", gap: 8,
                            fontSize: 13, color: "#6B7280", textDecoration: "none",
                        }}>
                            <span style={{
                                width: 28, height: 28, background: "rgba(6,182,212,0.1)",
                                border: "1px solid rgba(6,182,212,0.2)",
                                borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 14, flexShrink: 0, marginTop: 1,
                            }}>✉️</span>
                            ayushsrivastava18623@gmail.com
                        </a>

                        <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Built with</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {["Next.js", "MongoDB", "AWS S3", "Clerk"].map((t) => (
                                    <span key={t} style={{
                                        fontSize: 10, padding: "3px 8px",
                                        background: "rgba(6,182,212,0.08)",
                                        border: "1px solid rgba(6,182,212,0.15)",
                                        borderRadius: 4, color: "#06B6D4",
                                    }}>{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#1F2937", marginBottom: 24 }} />

            {/* Bottom */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: 12, color: "#6B7280",
            }}>
                <div>© 2026 Nagrik AI. All rights reserved.</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Made with <span style={{ color: "#EF4444", margin: "0 2px" }}>❤️</span> for smarter cities
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          footer { padding: 40px 20px 24px !important; }
          footer > div:first-child { grid-template-columns: 1fr !important; gap: 32px !important; }
          footer > div:last-child { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
        }
      `}</style>
        </footer>
    );
}