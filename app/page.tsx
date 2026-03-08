import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import CivicSenseSection from "@/components/Civicsensesection";
import FAQSection from "@/components/FAQSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "#0A0F1E", color: "#F9FAFB" }}>
      {/* ── Navbar ── */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 48px",
        borderBottom: "1px solid #1F2937",
        background: "rgba(10,15,30,0.9)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

        <div style={{ display: "flex", gap: 12 }}>
          <SignedOut>
            <Link href="/sign-in" className="btn btn-ghost">Sign In</Link>
            <Link href="/sign-up" className="btn btn-primary">Get Started</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn btn-primary">Go to Dashboard →</Link>
          </SignedIn>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 73px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        gap: 24,
      }}>
        {/* Grid background */}
        <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

        {/* Glow blobs */}
        <div style={{
          position: "absolute",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
          top: -150, left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
          bottom: 0, left: "10%",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute",
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)",
          bottom: "20%", right: "5%",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Floating incident cards */}
        <div style={{
          position: "absolute", left: "4%", top: "20%", zIndex: 1,
          background: "#111827", border: "1px solid #1F2937",
          borderRadius: 12, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "floatCard1 4s ease-in-out infinite",
          maxWidth: 200,
        }}>
          <div style={{ fontSize: 24 }}>🚧</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#F9FAFB" }}>Pothole Reported</div>
            <div style={{ fontSize: 11, color: "#EF4444" }}>● Critical — 8/10</div>
          </div>
        </div>

        <div style={{
          position: "absolute", right: "4%", top: "28%", zIndex: 1,
          background: "#111827", border: "1px solid #1F2937",
          borderRadius: 12, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "floatCard2 5s ease-in-out infinite",
          maxWidth: 200,
        }}>
          <div style={{ fontSize: 24 }}>✅</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#F9FAFB" }}>Issue Resolved</div>
            <div style={{ fontSize: 11, color: "#22C55E" }}>● AI Verified</div>
          </div>
        </div>

        <div style={{
          position: "absolute", left: "6%", bottom: "22%", zIndex: 1,
          background: "#111827", border: "1px solid #1F2937",
          borderRadius: 12, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "floatCard3 6s ease-in-out infinite",
          maxWidth: 200,
        }}>
          <div style={{ fontSize: 24 }}>🤖</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#F9FAFB" }}>AI Validated</div>
            <div style={{ fontSize: 11, color: "#06B6D4" }}>● Confidence 94%</div>
          </div>
        </div>

        <div style={{
          position: "absolute", right: "5%", bottom: "28%", zIndex: 1,
          background: "#111827", border: "1px solid #1F2937",
          borderRadius: 12, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "floatCard2 4.5s ease-in-out infinite",
          maxWidth: 200,
        }}>
          <div style={{ fontSize: 24 }}>👷</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#F9FAFB" }}>Worker Assigned</div>
            <div style={{ fontSize: 11, color: "#F59E0B" }}>● In Progress</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px",
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.2)",
            borderRadius: 100,
            fontSize: 12, fontWeight: 500,
            color: "#06B6D4", letterSpacing: "0.5px",
          }}>
            ✦ AI-Powered Smart City Platform
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 62, fontWeight: 800,
            lineHeight: 1.1, maxWidth: 700,
          }}>
            Report.<br />Validate.<br />
            <span style={{
              color: "#06B6D4",
              textShadow: "0 0 40px rgba(6,182,212,0.4)",
            }}>Fix the City.</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 500, lineHeight: 1.7 }}>
            Nagrik uses AI to validate civic issues, eliminate duplicates,
            and give authorities a real-time actionable heatmap.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Link href="/sign-up" className="btn btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
              Report an Issue →
            </Link>
            <Link href="/sign-in" className="btn btn-outline" style={{ fontSize: 15, padding: "12px 28px" }}>
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 40, marginTop: 16,
            padding: "20px 40px",
            background: "rgba(17,24,39,0.8)",
            border: "1px solid #1F2937",
            borderRadius: 16,
            backdropFilter: "blur(10px)",
          }}>
            {[
              { value: "94%", label: "AI Accuracy" },
              { value: "2x", label: "Faster Resolution" },
              { value: "0", label: "Spam Reports" },
              { value: "24/7", label: "Live Monitoring" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800,
                  color: "#06B6D4", marginBottom: 4,
                }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{
            display: "flex", gap: 20,
            marginTop: 40,
            paddingTop: 40,
            borderTop: "1px solid #1F2937",
          }}>
            {[
              { icon: "🤖", title: "AI Validation", desc: "Gemini 2.5 Flash validates every photo", color: "#06B6D4" },
              { icon: "🗺️", title: "Live Heatmap", desc: "Real-time city incident visualization", color: "#22C55E" },
              { icon: "⚡", title: "Fast Resolution", desc: "Workers get tasks instantly", color: "#F59E0B" },
              { icon: "✅", title: "AI Verification", desc: "Before/After comparison for proof", color: "#A78BFA" },
            ].map((f) => (
              <div key={f.title} style={{
                textAlign: "center", maxWidth: 140,
                padding: "16px 12px",
                background: "rgba(17,24,39,0.6)",
                border: "1px solid #1F2937",
                borderRadius: 12,
                transition: "border-color 0.2s",
              }}>
                <div style={{
                  fontSize: 28, marginBottom: 10,
                  width: 48, height: 48,
                  background: `rgba(${f.color === "#06B6D4" ? "6,182,212" : f.color === "#22C55E" ? "34,197,94" : f.color === "#F59E0B" ? "245,158,11" : "167,139,250"},0.1)`,
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 10px",
                }}>{f.icon}</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#F9FAFB" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CivicSenseSection />
      <FAQSection />
      <Footer />

      <style>{`
        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatCard3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }

        @media (max-width: 768px) {
          nav { padding: 16px 20px !important; }
          h1 { font-size: 38px !important; }
          section { padding: 60px 16px !important; }
          section > div:nth-child(4),
          section > div:nth-child(5),
          section > div:nth-child(6),
          section > div:nth-child(7) { display: none !important; }
        }
      `}</style>
    </main>
  );
}