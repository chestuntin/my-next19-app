// app/page.tsx
import LansNavbarLiquid from "./components/LansNavbarLiquid";

export const metadata = {
  title: "Kultjur — Lans-style navbar demo",
};

export default function Page() {
  return (
    <>
      <LansNavbarLiquid />
      <main
        style={{
          paddingTop: 84,
          minHeight: "100vh",
          background: "#050507",
          color: "#fff",
        }}
      >
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>
            Landing — Navbar demo
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)" }}>
            This demo reproduces lans.lk's centered nav layout and applies a
            liquid-glass visual using CSS + SVG. Links are placeholders — wire
            them to your pages.
          </p>

          <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
            <div
              style={{
                padding: 16,
                background: "rgba(255,255,255,0.02)",
                borderRadius: 8,
              }}
            >
              Services and details can go here.
            </div>
            <div
              style={{
                padding: 16,
                background: "rgba(255,255,255,0.02)",
                borderRadius: 8,
              }}
            >
              Replace with real content.
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
