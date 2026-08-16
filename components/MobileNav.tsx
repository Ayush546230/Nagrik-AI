"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          background: "#071226",
          color: "#10B981",
          border: "none",
          borderRadius: 8,
          fontSize: 18,
          cursor: "pointer",
          padding: "8px 10px",
        }}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Overlay + sliding panel with smooth transitions */}
      <div
        aria-hidden={!open}
        className="mobile-overlay"
        style={{
          position: "fixed",
          inset: 0,
          background: open ? "rgba(2,6,23,0.6)" : "rgba(2,6,23,0)",
          zIndex: 1200,
          transition: "background 220ms ease",
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={() => setOpen(false)}
      >
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: 280,
            background: "#FBF9F6",
            boxShadow: "-8px 0 30px rgba(0,0,0,0.15)",
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 260ms cubic-bezier(0.2,0.8,0.2,1)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="#home" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>Home</Link>
            <Link href="#why" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>Why</Link>
            <Link href="#how" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>How</Link>
            <Link href="#about" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>About</Link>
            <Link href="#contact" onClick={() => setOpen(false)} style={{ fontWeight: 700 }}>Contact</Link>
          </nav>

          <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
            <Link href="/sign-in" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ padding: "8px 12px" }}>Sign In</Link>
            <Link href="/sign-up" onClick={() => setOpen(false)} className="btn btn-primary" style={{ padding: "8px 12px" }}>Get Started</Link>
          </div>
        </div>
      </div>

      <style>{`
        .mobile-nav { display: none; }
        @media (max-width: 768px) {
          .mobile-nav { display: block; }
          .nav-links { display: none !important; }
        }
      `}</style>
    </div>
  );
}
