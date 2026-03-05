export default function CivicSenseSection() {
    const cards = [
        {
            icon: "🗑️",
            title: "Dispose Waste Responsibly",
            desc: "Always use designated bins. Littering causes waterlogging, disease, and civic ugliness. Your street reflects your character.",
            color: "#22C55E",
            tip: "Did you know? 1 kg of garbage dumped on roads costs ₹50 in cleanup.",
        },
        {
            icon: "💧",
            title: "Don't Waste Water",
            desc: "Report leaking pipes immediately. A single leaking tap wastes 15,000 litres per month — enough for an entire family.",
            color: "#06B6D4",
            tip: "Report waterlogging early to prevent dengue breeding grounds.",
        },
        {
            icon: "🚦",
            title: "Follow Traffic Rules",
            desc: "Broken signals and road damage cause accidents. Report potholes before someone gets hurt — not after.",
            color: "#F59E0B",
            tip: "India loses ₹55,000 crore annually due to road accidents.",
        },
        {
            icon: "💡",
            title: "Report Dark Streets",
            desc: "Non-functional streetlights increase crime and accidents. A simple report can make your neighbourhood safer overnight.",
            color: "#A78BFA",
            tip: "Well-lit streets reduce crime by up to 36%.",
        },
        {
            icon: "🏗️",
            title: "Fight Encroachment",
            desc: "Illegal encroachments block footpaths and emergency access. Report them — public space belongs to everyone.",
            color: "#EF4444",
            tip: "Footpaths are for people, not for shops or parking.",
        },
        {
            icon: "📸",
            title: "Document & Report",
            desc: "A photo is worth a thousand complaints. Use Nagrik AI to report with photo evidence — AI validates it instantly.",
            color: "#06B6D4",
            tip: "AI-validated reports get resolved 2x faster than verbal complaints.",
        },
    ];

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
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 100,
                    fontSize: 12, fontWeight: 500,
                    color: "#22C55E", marginBottom: 16,
                }}>
                    🌿 Civic Responsibility Guide
                </div>
                <h2 style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 40, fontWeight: 800,
                    lineHeight: 1.2, marginBottom: 16,
                }}>
                    Your City, <span style={{ color: "#06B6D4" }}>Your Responsibility.</span>
                </h2>
                <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                    A smart city starts with smart citizens. Here's what you can do
                    every day to make your city cleaner, safer, and better.
                </p>
            </div>

            {/* Cards Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
                maxWidth: 1100,
                margin: "0 auto",
                width: "100%",
            }}>
                {cards.map((card) => (
                    <div key={card.title} style={{
                        background: "#111827",
                        borderRight: "1px solid #1F2937",
                        borderBottom: "1px solid #1F2937",
                        borderLeft: "1px solid #1F2937",
                        borderTop: "1px solid #1F2937",
                        borderRadius: 14,
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        transition: "transform 0.2s, box-shadow 0.2s",
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: 48, height: 48,
                            background: `rgba(${card.color === "#22C55E" ? "34,197,94" : card.color === "#06B6D4" ? "6,182,212" : card.color === "#F59E0B" ? "245,158,11" : card.color === "#A78BFA" ? "167,139,250" : card.color === "#EF4444" ? "239,68,68" : "6,182,212"},0.1)`,
                            border: `1px solid ${card.color}30`,
                            borderRadius: 12,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 22,
                        }}>
                            {card.icon}
                        </div>

                        {/* Title */}
                        <div style={{
                            fontFamily: "Syne, sans-serif",
                            fontSize: 15, fontWeight: 700,
                            color: "#F9FAFB",
                        }}>
                            {card.title}
                        </div>

                        {/* Description */}
                        <div style={{
                            fontSize: 13, color: "#9CA3AF",
                            lineHeight: 1.7,
                        }}>
                            {card.desc}
                        </div>

                        {/* Tip */}
                        <div style={{
                            marginTop: "auto",
                            padding: "10px 12px",
                            background: `rgba(${card.color === "#22C55E" ? "34,197,94" : card.color === "#06B6D4" ? "6,182,212" : card.color === "#F59E0B" ? "245,158,11" : card.color === "#A78BFA" ? "167,139,250" : card.color === "#EF4444" ? "239,68,68" : "6,182,212"},0.06)`,
                            border: `1px solid ${card.color}20`,
                            borderRadius: 8,
                            fontSize: 11, color: card.color,
                            lineHeight: 1.5,
                        }}>
                            💡 {card.tip}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div style={{
                textAlign: "center",
                marginTop: 56,
                padding: "32px",
                background: "rgba(6,182,212,0.04)",
                border: "1px solid rgba(6,182,212,0.15)",
                borderRadius: 16,
                maxWidth: 600,
                margin: "56px auto 0",
            }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🏙️</div>
                <div style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 20, fontWeight: 700,
                    marginBottom: 8,
                }}>
                    Be the Change
                </div>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, marginBottom: 20 }}>
                    Every report you make helps your city get better. It takes 30 seconds
                    to report an issue — and it could prevent an accident, a disease, or a crime.
                </p>
                <a href="/sign-up" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "11px 24px",
                    background: "#06B6D4", color: "#0A0F1E",
                    borderRadius: 8, textDecoration: "none",
                    fontFamily: "Syne, sans-serif",
                    fontSize: 14, fontWeight: 700,
                }}>
                    Start Reporting →
                </a>
            </div>

            <style>{`
        @media (max-width: 768px) {
          section { padding: 60px 16px !important; }
          section > div:nth-child(3) { 
            grid-template-columns: 1fr !important; 
          }
          h2 { font-size: 28px !important; }
        }
      `}</style>
        </section>
    );
}