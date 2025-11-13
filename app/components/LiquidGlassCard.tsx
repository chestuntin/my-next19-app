// app/components/LiquidGlassCard.tsx
"use client";

import React, { useEffect, useRef } from "react";

export default function LiquidGlassCard() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // init vars
    el.style.setProperty("--mx", "-9999px");
    el.style.setProperty("--my", "-9999px");
    el.style.setProperty("--strength", "0");
    el.style.setProperty("--disp", "6");

    const pointerHandler = (ev: PointerEvent | TouchEvent) => {
      const node = rootRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();

      let clientX = 0,
        clientY = 0;
      if ("touches" in ev && ev.touches && ev.touches[0]) {
        clientX = ev.touches[0].clientX;
        clientY = ev.touches[0].clientY;
      } else {
        clientX = (ev as PointerEvent).clientX;
        clientY = (ev as PointerEvent).clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      node.style.setProperty("--mx", `${Math.round(x)}px`);
      node.style.setProperty("--my", `${Math.round(y)}px`);

      // strength & displacement scale based on distance from center
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const dist = Math.min(1, Math.hypot(dx, dy));
      const strength = 0.12 + dist * 0.68;
      const disp = 6 + dist * 30; // drives feDisplacementMap scale

      node.style.setProperty("--strength", String(strength));
      node.style.setProperty("--disp", String(Math.round(disp)));
    };

    const leave = () => {
      const node = rootRef.current;
      if (!node) return;
      node.style.setProperty("--mx", "-9999px");
      node.style.setProperty("--my", "-9999px");
      node.style.setProperty("--strength", "0");
      node.style.setProperty("--disp", "6");
    };

    el.addEventListener("pointermove", pointerHandler);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointercancel", leave);
    el.addEventListener("touchmove", pointerHandler as EventListener, {
      passive: true,
    });
    el.addEventListener("touchend", leave);

    return () => {
      el.removeEventListener("pointermove", pointerHandler);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointercancel", leave);
      el.removeEventListener("touchmove", pointerHandler as EventListener);
      el.removeEventListener("touchend", leave);
    };
  }, []);

  return (
    <>
      {/* SVG filters */}
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
        <defs>
          {/* Turbulence + displacement (scale controlled below via CSS variable --disp) */}
          <filter id="lg_displace" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              baseFrequency="0.85"
              numOctaves="2"
              seed="5"
              result="turb"
            />
            {/* Use scale attribute but we'll override it by updating the DOM attribute at runtime */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur
              in="displaced"
              stdDeviation="0.6"
              result="smoothed"
            />
            <feColorMatrix
              in="smoothed"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1 0"
              result="cm"
            />
            <feMerge>
              <feMergeNode in="cm" />
            </feMerge>
          </filter>

          {/* Chromatic sheen (soft overlay) */}
          <filter id="lg_chroma" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="soft" />
            <feBlend in="SourceGraphic" in2="soft" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Card wrapper */}
      <div
        ref={rootRef}
        style={{
          width: "min(920px, 86%)",
          margin: "40px auto",
          position: "relative",
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Main card */}
        <div
          className="lg-card"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 28,
            overflow: "hidden",
            display: "flex",
            padding: "28px",
            boxSizing: "border-box",
            boxShadow: "0 18px 60px rgba(6,6,8,0.72)",
            border: "1px solid rgba(255,255,255,0.08)",
            // ensure filter applies visually
            WebkitBackfaceVisibility: "hidden",
          }}
          // apply displacement filter; we will update the feDisplacementMap scale attribute below via CSS animation hack
        >
          {/* Backdrop (real content blur) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(18px) saturate(160%)",
              WebkitBackdropFilter: "blur(18px) saturate(160%)",
              background: "rgba(245,230,150,0.06)", // subtle warm base to let colors shine
              mixBlendMode: "normal",
            }}
          />

          {/* Colour blob layer (the colourful interior) */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(900px 380px at 8% 20%, #f6d479 0%, rgba(246,212,121,0.85) 12%, rgba(255,110,130,0.62) 30%, rgba(25,195,180,0.22) 56%, rgba(24,44,116,0.8) 74%, rgba(2,6,12,0.9) 100%)",
              opacity: 0.98,
              filter: "url(#lg_displace)",
              transform: "translateZ(0)",
              pointerEvents: "none",
            }}
          />

          {/* Sheen highlight that follows cursor */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "var(--mx)",
              top: "var(--my)",
              width: 360,
              height: 360,
              transform:
                "translate(-50%,-50%) scale(calc(var(--strength,0) * 1.02))",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.02) 50%, transparent 60%)",
              mixBlendMode: "screen",
              filter: "blur(18px)",
              pointerEvents: "none",
              transition: "transform 120ms linear, opacity 120ms linear",
              opacity: "calc(var(--strength,0) * 1)",
              zIndex: 2,
            }}
          />

          {/* Inner content (text/avatar) */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              flexDirection: "row",
              gap: 18,
              alignItems: "center",
              color: "white",
              width: "100%",
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              JD
            </div>

            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 32,
                  fontWeight: 700,
                  textShadow: "0 6px 18px rgba(0,0,0,0.6)",
                }}
              >
                John Doe
              </h3>
              <p style={{ margin: "6px 0 18px 0", opacity: 0.92 }}>
                Software Engineer
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                <div style={{ opacity: 0.95 }}>
                  <div style={{ fontWeight: 700 }}>Email:</div>
                  <div style={{ opacity: 0.95 }}>john.doe@example.com</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>Joined:</div>
                  <div style={{ opacity: 0.95 }}>March 2023</div>
                </div>
              </div>
            </div>
          </div>

          {/* thin chromatic border inner glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 28,
              pointerEvents: "none",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          />
        </div>
      </div>

      {/* component-scoped CSS (you can move to global CSS if prefer) */}
      <style jsx>{`
        :root {
          --mx: -9999px;
          --my: -9999px;
          --strength: 0;
          --disp: 6;
        }

        /* minor hover lift */
        .lg-card:hover {
          transform: translateY(-6px);
          transition: transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        /* responsive sizing */
        @media (max-width: 780px) {
          .lg-card {
            border-radius: 16px;
          }
        }
      `}</style>

      {/* small script to sync CSS variable --disp to the feDisplacementMap scale attribute.
          We can't set feDisplacementMap scale via CSS; so we update the DOM node after render. */}
      <SyncDisplacement elRef={rootRef} />
    </>
  );
}

/** Helper component: updates the feDisplacementMap 'scale' attribute to match --disp var */
function SyncDisplacement({
  elRef,
}: {
  elRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    let raf = 0;
    const node = elRef.current;
    if (!node) return;

    const update = () => {
      try {
        const disp = parseFloat(
          getComputedStyle(node).getPropertyValue("--disp") || "8"
        );
        // find the feDisplacementMap inside the document (assumes single filter with id lg_displace)
        const svg = document.querySelector(
          "svg defs filter#lg_displace feDisplacementMap"
        ) as SVGFEDisplacementMapElement | null;
        if (svg) {
          svg.setAttribute("scale", String(Math.round(disp)));
        }
      } catch (e) {
        // ignore
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [elRef]);

  return null;
}
