import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
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
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, background: "#06B6D4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏙️</div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: "#F9FAFB" }}>
            Nagrik AI
          </span>
        </div>
        <SignUp appearance={{
          variables: {
            colorBackground: "#111827",
            colorInputBackground: "#0A0F1E",
            colorInputText: "#F9FAFB",
            colorText: "#F9FAFB",
            colorTextSecondary: "#6B7280",
            colorPrimary: "#06B6D4",
            colorDanger: "#EF4444",
            borderRadius: "8px",
          },
          elements: {
            card: {
              background: "#111827",
              border: "1px solid #1F2937",
              boxShadow: "none",
            },
            socialButtonsBlockButton: {
              background: "#0A0F1E",
              border: "1px solid #1F2937",
              color: "#F9FAFB",
            },
            formFieldInput: {
              background: "#0A0F1E",
              border: "1px solid #1F2937",
              color: "#F9FAFB",
            },
            footerActionLink: {
              color: "#06B6D4",
            },
          }
        }}
        />
      </div>
    </main>
  );
}