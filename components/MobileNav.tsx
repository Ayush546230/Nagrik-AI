"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav" style={{ display: "none" }}>
      <button
        aria-label="Menu"
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "none",
          fontSize: 22,
          cursor: "pointer",
          padding: 8,
        }}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1200,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              width: 260,
              background: "#FBF9F6",
              height: "100%",
              padding: 20,
              boxShadow: "-6px 0 30px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Link href="#home" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>Home</Link>
              <Link href="#why" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>Why</Link>
              <Link href="#how" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>How</Link>
              <Link href="#about" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>About</Link>
              <Link href="#contact" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>Contact</Link>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Link href="/sign-in" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ padding: "8px 12px" }}>Sign In</Link>
                <Link href="/sign-up" onClick={() => setOpen(false)} className="btn btn-primary" style={{ padding: "8px 12px" }}>Get Started</Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 480px) {
          .mobile-nav { display: block !important; }
          .nav-links { display: none !important; }
        }
      `}</style>
    </div>
  );
}
