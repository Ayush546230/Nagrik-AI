import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import CivicSenseSection from "@/components/Civicsensesection";
import FAQSection from "@/components/FAQSection";
import MobileNav from "@/components/MobileNav";

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "#FBF9F6", color: "#0F172A" }}>
      {/* Navbar */}
      <nav id="home" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 40px",
        background: "transparent",
        position: "sticky",
        top: 0,
        zIndex: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18 }}>
            Nagrik <span style={{ color: "#0EA5A8" }}>AI</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {/* Desktop links (hidden on very small screens) */}
          <div className="nav-links" style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <a href="#home" style={{ textDecoration: "none", color: "#0F172A", fontWeight: 600 }}>Home</a>
          <a href="#why" style={{ textDecoration: "none", color: "#0F172A", fontWeight: 600 }}>Why</a>
          <a href="#how" style={{ textDecoration: "none", color: "#0F172A", fontWeight: 600 }}>How</a>
          <a href="#about" style={{ textDecoration: "none", color: "#0F172A", fontWeight: 600 }}>About</a>
          <a href="#contact" style={{ textDecoration: "none", color: "#0F172A", fontWeight: 600 }}>Contact</a>

          <SignedOut>
            <Link href="/sign-in" className="btn btn-ghost" style={{ padding: "8px 12px" }}>Sign In</Link>
            <Link href="/sign-up" className="btn btn-primary" style={{ padding: "8px 12px" }}>Get Started</Link>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: "8px 12px" }}>Dashboard</Link>
          </SignedIn>

          {/* mobile nav */}
          <div className="mobile-nav-wrapper">
            <MobileNav />
          </div>
        </div>
      </div>
      </nav>

      <section style={{
        position: "relative",
        padding: "80px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "#FBF9F6" }} />

        <div className="hero-bg" style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('/gandhiji.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          opacity: 0.18,
          pointerEvents: "none",
          height: "100%",
        }} />

        <div className="hero-content" style={{
          position: "absolute",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          width: "46%",
          maxWidth: 520,
          zIndex: 5,
          padding: 12,
          textAlign: "right",
          background: "transparent",
        }}>
         

          <div style={{ flex: "1 1 50%", minWidth: 320, textAlign: "right" }}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 36, marginBottom: 8 }}>
              Our Cities, Our Responsibility
            </h2>
            <p style={{ fontSize: 18, color: "#334155", maxWidth: 520, margin: "0 auto 16px" }}>
              Empower citizens to report civic issues and help authorities act faster. Together we build cleaner,
              safer neighborhoods — one verified report at a time.
            </p>
            <div className="cta-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Link href="/sign-up" className="btn btn-primary">Get Started</Link>
              <a href="#how" className="btn btn-ghost">Learn How</a>
            </div>
          </div>
        </div>
      </section>

      {/* How section: images grid */}
      <section id="how" style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h3 style={{ fontSize: 22, fontFamily: "Syne, sans-serif", marginBottom: 12 }}>How it Works</h3>
          <p style={{ color: "#475569", marginBottom: 18, maxWidth: 900 }}>
            Submit a photo, AI validates category and severity, then assigns verified tasks to workers.
          </p>

          <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div style={{ borderRadius: 12, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
              <img src="/garbage.jpg" alt="Garbage" style={{ width: "100%", height: 160, objectFit: "cover" }} />
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700 }}>Garbage</div>
                <div style={{ color: "#64748B", fontSize: 13 }}>Report overflowing bins and illegal dumping.</div>
              </div>
            </div>

            <div style={{ borderRadius: 12, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
              <img src="/light.jpg" alt="Lighting" style={{ width: "100%", height: 160, objectFit: "cover" }} />
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700 }}>Street Lights</div>
                <div style={{ color: "#64748B", fontSize: 13 }}>Faulty or broken street lights flagged for repair.</div>
              </div>
            </div>

            <div style={{ borderRadius: 12, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
              <img src="/potholes.jpg" alt="Potholes" style={{ width: "100%", height: 160, objectFit: "cover" }} />
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700 }}>Potholes</div>
                <div style={{ color: "#64748B", fontSize: 13 }}>Mark locations and severity to prioritize fixes.</div>
              </div>
            </div>

            <div style={{ borderRadius: 12, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
              <img src="/toilet.jpg" alt="Toilet" style={{ width: "100%", height: 160, objectFit: "cover" }} />
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700 }}>Public Sanitation</div>
                <div style={{ color: "#64748B", fontSize: 13 }}>Report damaged or blocked public toilets.</div>
              </div>
            </div>

            <div style={{ borderRadius: 12, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
              <img src="/waterclog.jpg" alt="Water clog" style={{ width: "100%", height: 160, objectFit: "cover" }} />
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700 }}>Water Clogs</div>
                <div style={{ color: "#64748B", fontSize: 13 }}>Flooding, drainage issues and blocked drains.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Full width riverclean section */}
      <section style={{ marginTop: 8 }}>
        <div className="river-section" style={{ width: "100%", height: 360, position: "relative" }}>
          <img src="/riverclean.jpg" alt="River Clean" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 40, top: 40, color: "#FFFFFF", maxWidth: 560 }}>
            <h3 style={{ fontSize: 28, marginBottom: 8 }}>Ganga & Yamuna: Restoring our rivers</h3>
            <p style={{ maxWidth: 520, color: "rgba(255,255,255,0.9)" }}>
              Community-led cleanups and verified incident reporting accelerate river restoration. Track cleanups, volunteers, and impact across regions.
            </p>
          </div>
        </div>
      </section>

      {/* Worker highlight */}
      <section id="why" style={{ padding: "40px 24px" }}>
        <div className="worker-highlight" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px" }}>
            <img src="/worker.jpg" alt="Worker" style={{ width: "100%", borderRadius: 12, objectFit: "cover" }} />
          </div>
          <div style={{ flex: "1 1 380px" }}>
            <h3 style={{ fontSize: 24, fontFamily: "Syne, sans-serif" }}>Why workers matter</h3>
            <p style={{ color: "#475569" }}>
              Trained field workers validate reports and complete fixes. Nagrik routes verified tasks directly to responsible teams to reduce delays.
            </p>
            <ul style={{ color: "#475569", marginTop: 12 }}>
              <li>Verified tasks lower rework and increase trust.</li>
              <li>Priority routing speeds up critical repairs.</li>
              <li>Before/after evidence closes the loop for citizens.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Civic sense / school / role of citizen */}
      <section id="about" style={{ padding: "40px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
          <h3 style={{ fontSize: 22, fontFamily: "Syne, sans-serif" }}>Civic Sense & Schools</h3>
          <p style={{ color: "#475569" }}>
            Civic education in schools builds long-term behaviour change. Citizens can report, participate in cleanups, and teach others how to keep neighbourhoods clean.
          </p>

          <div style={{ display: "flex", gap: 18, marginTop: 18, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 320px", padding: 16, background: "#FBF9F6", borderRadius: 12 }}>
                <img src="/civicsense.png" alt="Civic Sense" style={{ width: "100%", borderRadius: 8, objectFit: "cover", marginBottom: 10 }} />
                <h4 style={{ marginBottom: 8 }}>Citizen Role</h4>
                <p style={{ color: "#475569" }}>Report issues, add evidence, and verify fixes to earn community trust scores.</p>
              </div>
              <div style={{ flex: "1 1 320px", padding: 16, background: "#FBF9F6", borderRadius: 12 }}>
                <img src="/civicschool.jpg" alt="Civic School" style={{ width: "100%", borderRadius: 8, objectFit: "cover", marginBottom: 10 }} />
                <h4 style={{ marginBottom: 8 }}>Civic School</h4>
                <p style={{ color: "#475569" }}>Workshops and curricula to teach students civic responsibility and digital reporting tools.</p>
              </div>
            </div>
        </div>
      </section>

      {/* How to participate / contact */}
      <section id="contact" style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h3 style={{ fontSize: 20 }}>Get Involved</h3>
          <p style={{ color: "#475569" }}>Email: hello@nagrik.ai • Phone: 1800-XXX-XXXX • Volunteer for local cleanups and school programs.</p>
        </div>
      </section>

      {/* Reuse existing civic & FAQ sections (keeps things consistent) */}
      <CivicSenseSection />
      <FAQSection />

      <Footer />

      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          // Hydrate mobile nav client component dynamically to avoid SSR import issues
          const mount = document.querySelector('.mobile-nav-wrapper');
          if (!mount) return;
          // Load the client bundle
        })();
      `}} />

      <style>{`
        /* General responsive tweaks */
        @media (max-width: 1024px) {
          main { padding: 0 12px; }
          nav { padding: 12px 20px; }
        }

        @media (max-width: 900px) {
          section { padding: 24px 16px; }
          nav { padding: 12px 16px; }
          h2 { font-size: 28px !important; }
          h3 { font-size: 20px !important; }
          .hero-content { position: absolute !important; right: 16px !important; top: 50% !important; transform: translateY(-50%) !important; width: calc(100% - 32px) !important; max-width: 520px !important; text-align: right !important; padding: 12px !important; }
          .hero-bg { display: block !important; background-size: contain !important; background-position: center right !important; opacity: 0.22 !important; height: 320px !important; }
          #how > div > div { padding: 0 8px; }
          #how img { height: auto !important; }
          #how { padding-left: 8px; padding-right: 8px; }
          .nav-links a { display: inline-block; padding: 6px 8px; }
          .cta-buttons { justify-content: center !important; flex-direction: column !important; gap: 10px !important; }
          .stats { flex-direction: column !important; gap: 12px !important; padding: 12px !important; }
          .how-grid { grid-template-columns: repeat(1, 1fr) !important; }
          .river-section img { height: 220px !important; object-position: center !important; }
          .worker-highlight { flex-direction: column !important; align-items: stretch !important; }
          .worker-highlight img { width: 100% !important; height: auto !important; }
        }

        @media (max-width: 480px) {
          h1 { font-size: 28px !important; }
          .nav-links a { display: none !important; }
          .nav-links .btn { display: inline-flex !important; }
        }
      `}</style>
    </main>
  );
}
