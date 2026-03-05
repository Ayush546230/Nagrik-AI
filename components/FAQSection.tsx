"use client";

import { useState } from "react";

const faqs = [
    {
        q: "What is Nagrik AI?",
        a: "Nagrik AI is a smart city platform that empowers citizens to report civic issues. Every report is AI-validated — spam is automatically rejected and genuine issues are assigned to field workers for resolution.",
    },
    {
        q: "Is it completely free to report an issue?",
        a: "Yes! Reporting on Nagrik AI is 100% free. Simply create an account, take a photo of the issue, and submit. Our AI handles the rest — validation, categorization, and priority scoring.",
    },
    {
        q: "Why was my report not validated?",
        a: "Reports are rejected for 3 main reasons: (1) The photo was taken indoors or showed no civic issue, (2) The image appeared to be a stock photo, (3) The image quality was too low to analyze. Make sure to take a clear outdoor photo where the issue is clearly visible.",
    },
    {
        q: "How long does it take to resolve a reported issue?",
        a: "Once your report is verified, an admin assigns a field worker. The worker completes the task, uploads an after-photo, and our AI verifies the resolution. Most issues are resolved within 24–72 hours depending on severity.",
    },
    {
        q: "How do I become a Field Worker?",
        a: "During sign-up, select the 'Field Worker' role. Your application will be reviewed by an admin. Once approved, you'll start receiving assigned incidents and can resolve them through the worker dashboard.",
    },
    {
        q: "Is my location data safe?",
        a: "Only approximate GPS coordinates of the issue location are saved — not your personal location. Your identity is never linked to the coordinates. Location data is only visible to the admin and the assigned worker.",
    },
    {
        q: "What happens when I submit a duplicate report?",
        a: "If a similar issue has already been reported nearby, your report is marked as a duplicate and the existing incident's upvote count increases. This prevents multiple workers from being assigned to the same issue — improving city-wide efficiency.",
    },
    {
        q: "What if the AI detects the wrong category?",
        a: "You can manually select the correct category while submitting — the AI considers your hint. If it's still incorrect, mention it clearly in the description field. Admins can also correct the category during review.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section style={{
            background: "#0A0F1E",
            padding: "80px 48px",
            borderTop: "1px solid #1F2937",
        }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "6px 16px",
                    background: "rgba(6,182,212,0.1)",
                    border: "1px solid rgba(6,182,212,0.2)",
                    borderRadius: 100,
                    fontSize: 12, fontWeight: 500,
                    color: "#06B6D4", marginBottom: 16,
                }}>
                    ❓ Frequently Asked Questions
                </div>
                <h2 style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 40, fontWeight: 800,
                    lineHeight: 1.2, marginBottom: 16,
                }}>
                    Got Questions? <span style={{ color: "#06B6D4" }}>We Have Answers.</span>
                </h2>
                <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
                    Everything you need to know about Nagrik AI and how it works.
                </p>
            </div>

            {/* FAQ List */}
            <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
                {faqs.map((faq, i) => (
                    <div key={i} style={{
                        background: "#111827",
                        border: `1px solid ${openIndex === i ? "rgba(6,182,212,0.3)" : "#1F2937"}`,
                        borderRadius: 12,
                        overflow: "hidden",
                        transition: "border-color 0.2s",
                    }}>
                        {/* Question */}
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            style={{
                                width: "100%", padding: "18px 20px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                background: "none", border: "none", cursor: "pointer",
                                textAlign: "left", gap: 12,
                            }}
                        >
                            <span style={{
                                fontFamily: "Syne, sans-serif",
                                fontSize: 15, fontWeight: 600,
                                color: openIndex === i ? "#06B6D4" : "#F9FAFB",
                            }}>
                                {faq.q}
                            </span>
                            <span style={{
                                fontSize: 18, color: "#06B6D4", flexShrink: 0,
                                transition: "transform 0.2s",
                                transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                            }}>
                                +
                            </span>
                        </button>

                        {/* Answer */}
                        {openIndex === i && (
                            <div style={{
                                padding: "0 20px 18px",
                                fontSize: 14, color: "#9CA3AF",
                                lineHeight: 1.8,
                                borderTop: "1px solid #1F2937",
                                paddingTop: 14,
                            }}>
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div style={{ textAlign: "center", marginTop: 48 }}>
                <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
                    Still have questions? Reach out directly.
                </p>
                <a href="mailto:ayushsrivastava18623@gmail.com" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 22px",
                    background: "rgba(6,182,212,0.1)",
                    border: "1px solid rgba(6,182,212,0.2)",
                    borderRadius: 8, textDecoration: "none",
                    fontSize: 13, color: "#06B6D4", fontWeight: 500,
                }}>
                    ✉️ ayushsrivastava18623@gmail.com
                </a>
            </div>

            <style>{`
        @media (max-width: 768px) {
          section { padding: 60px 16px !important; }
          h2 { font-size: 28px !important; }
        }
      `}</style>
        </section>
    );
}