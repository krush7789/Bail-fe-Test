export const metadata = { title: "Preview — Bits AI Lab Redesign", robots: { index: false, follow: false } };

export default function PreviewPage() {
  return (
    <main style={{ fontFamily: "sans-serif", background: "#080c1a", color: "white", minHeight: "100vh", padding: "4rem 2rem", textAlign: "center" }}>
      <p style={{ color: "#ed821c", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
        Redesign Preview
      </p>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Bits AI Lab — Choose Your Variant
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "3rem", maxWidth: 480, margin: "0 auto 3rem" }}>
        Three homepage designs. Pick the one that says wow.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", maxWidth: 1000, margin: "0 auto" }}>
        <a href="/balanced" style={{ display: "block", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "2rem", color: "white", textDecoration: "none", background: "rgba(255,255,255,0.04)", transition: "border-color 0.2s" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚡</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Balanced Premium</h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>Aurora hero · Bento grid · framer-motion reveals · Fast &amp; maintainable</p>
        </a>
        <a href="/immersive" style={{ display: "block", border: "1px solid rgba(237,130,28,0.3)", borderRadius: 16, padding: "2rem", color: "white", textDecoration: "none", background: "rgba(237,130,28,0.05)", transition: "border-color 0.2s" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🌌</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Maximum Immersive</h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>3D neural orb · GSAP scroll story · Magnetic UI · Maximum wow</p>
        </a>
        <a href="/workflow" style={{ display: "block", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 16, padding: "2rem", color: "white", textDecoration: "none", background: "rgba(0,212,255,0.05)", transition: "border-color 0.2s" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚡</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Workflow Canvas</h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>n8n-style canvas · Cinematic camera · Pipeline executes as you scroll · Maximum innovative</p>
        </a>
      </div>

      <p style={{ marginTop: "3rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>
        This page is not indexed. Share the link with the client.
      </p>
    </main>
  );
}
