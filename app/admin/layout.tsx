"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/incidents", label: "Incidents", icon: "🚨" },
    { href: "/admin/workers", label: "Workers", icon: "👷" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0A0F1E" }}>

            {/* ── Desktop Sidebar ── */}
            <aside style={{
                width: 220, background: "#111827",
                borderRight: "1px solid #1F2937",
                display: "flex", flexDirection: "column",
                padding: "24px 12px",
                position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40,
            }} className="desktop-sidebar">
                <div style={{
                    fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18,
                    padding: "0 12px 20px", borderBottom: "1px solid #1F2937",
                    marginBottom: 12, color: "#F9FAFB",
                }}>
                    Nagrik
                    <span style={{
                        marginLeft: 8, fontSize: 10, fontWeight: 600,
                        background: "rgba(6,182,212,0.1)", color: "#06B6D4",
                        border: "1px solid rgba(6,182,212,0.2)",
                        padding: "2px 6px", borderRadius: 4,
                    }}>ADMIN</span>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 12px", borderRadius: 8,
                                fontSize: 14, fontWeight: 500, textDecoration: "none",
                                background: isActive ? "rgba(6,182,212,0.1)" : "transparent",
                                color: isActive ? "#06B6D4" : "#6B7280",
                            }}>
                                <span style={{ fontSize: 16 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{
                    marginTop: "auto", borderTop: "1px solid #1F2937",
                    display: "flex", alignItems: "center", gap: 10, padding: 12,
                }}>
                    <UserButton afterSignOutUrl="/" />
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#F9FAFB" }}>My Account</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>Administrator</div>
                    </div>
                </div>
            </aside>

            {/* ── Mobile Header ── */}
            <div className="mobile-topbar" style={{
                display: "none",
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                background: "#111827", borderBottom: "1px solid #1F2937",
                padding: "12px 16px",
                alignItems: "center", justifyContent: "space-between",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "#F9FAFB" }}>Nagrik</span>
                    <span style={{
                        fontSize: 10, fontWeight: 600,
                        background: "rgba(6,182,212,0.1)", color: "#06B6D4",
                        border: "1px solid rgba(6,182,212,0.2)",
                        padding: "2px 6px", borderRadius: 4,
                    }}>ADMIN</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <UserButton afterSignOutUrl="/" />
                    <button onClick={() => setMenuOpen(!menuOpen)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#F9FAFB", fontSize: 22, padding: 4,
                    }}>
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* ── Mobile Drawer ── */}
            {menuOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 49 }}>
                    <div onClick={() => setMenuOpen(false)} style={{
                        position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
                    }} />
                    <div style={{
                        position: "absolute", top: 0, left: 0, bottom: 0,
                        width: 260, background: "#111827",
                        borderRight: "1px solid #1F2937",
                        display: "flex", flexDirection: "column",
                        padding: "70px 12px 24px", zIndex: 50,
                    }}>
                        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            padding: "12px 16px", borderRadius: 8,
                                            fontSize: 15, fontWeight: 500, textDecoration: "none",
                                            background: isActive ? "rgba(6,182,212,0.1)" : "transparent",
                                            color: isActive ? "#06B6D4" : "#9CA3AF",
                                        }}>
                                        <span style={{ fontSize: 18 }}>{item.icon}</span>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            {/* ── Main Content ── */}
            <main className="admin-main" style={{
                flex: 1, marginLeft: 220,
                padding: "28px 32px", color: "#F9FAFB",
            }}>
                {children}
            </main>

            <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .admin-main { 
            margin-left: 0 !important; 
            padding: 80px 16px 24px !important; 
          }
        }
      `}</style>
        </div>
    );
}