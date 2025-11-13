// app/page.tsx
import LiquidGlassCard from "./components/LiquidGlassCard";

export const metadata = {
  title: "Liquid Glass Card — Demo",
};

export default function Page() {
  return (
    <main
      style={{ minHeight: "100vh", background: "#050507", padding: "40px 0" }}
    >
      <LiquidGlassCard />
      <section
        style={{
          maxWidth: 900,
          margin: "40px auto",
          color: "rgba(255,255,255,0.86)",
          padding: "0 20px",
        }}
      >
        <h2 style={{ color: "white" }}>Below the card</h2>
        <p>
          The card above reproduces the colourful, glossy appearance with
          displacement, heavy backdrop blur and mouse-driven sheen. Adjust
          variables in the component to tune blur / displacement / colour.
        </p>
      </section>
    </main>
  );
}
