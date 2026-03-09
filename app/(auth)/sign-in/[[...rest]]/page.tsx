import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#0A0F1E",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute",
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40,
            background: "#06B6D4",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>🏙️</div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: "#F9FAFB" }}>
            Nagrik AI
          </span>
        </div>

        {/* Clerk SignIn Component */}
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#06B6D4",
              colorBackground: "#111827",
              colorText: "#F9FAFB",
              colorTextSecondary: "#6B7280",
              colorInputBackground: "#0A0F1E",
              colorInputText: "#F9FAFB",
              borderRadius: "8px",
            },
            elements: {
              card: {
                border: "1px solid #1F2937",
                boxShadow: "none",
              },
              socialButtonsBlockButton: {
                background: "#1F2937",
                border: "1px solid #374151",
                color: "#F9FAFB",
              },
              socialButtonsBlockButtonText: {
                color: "#F9FAFB",
              },
              headerTitle: {
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
              },

            },
          }}
        />
      </div>
    </main>
  );
}
