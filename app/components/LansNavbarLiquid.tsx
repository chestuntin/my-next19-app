// app/components/LansNavbarLiquid.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

export default function LansNavbarLiquid() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // init CSS vars
    el.style.setProperty("--mx", "-9999px");
    el.style.setProperty("--my", "-9999px");
    el.style.setProperty("--strength", "0");

    // handler uses the *current* element (get inside handler to be safe)
    const handlePointer = (ev: PointerEvent | TouchEvent) => {
      const node = rootRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ("touches" in ev && ev.touches && ev.touches[0]) {
        clientX = ev.touches[0].clientX;
        clientY = ev.touches[0].clientY;
      } else if ("clientX" in ev) {
        clientX = (ev as PointerEvent).clientX;
        clientY = (ev as PointerEvent).clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      node.style.setProperty("--mx", `${Math.round(x)}px`);
      node.style.setProperty("--my", `${Math.round(y)}px`);

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const strength = Math.min(0.9, Math.max(0, Math.hypot(dx, dy)));
      node.style.setProperty("--strength", `${0.12 + strength * 0.18}`);
    };

    const handleLeave = () => {
      const node = rootRef.current;
      if (!node) return;
      node.style.setProperty("--mx", "-9999px");
      node.style.setProperty("--my", "-9999px");
      node.style.setProperty("--strength", "0");
    };

    // prefer pointer events on the element (safer & works for touch/mouse)
    el.addEventListener("pointermove", handlePointer as EventListener);
    el.addEventListener("pointerleave", handleLeave);
    el.addEventListener("touchmove", handlePointer as EventListener, {
      passive: true,
    });
    el.addEventListener("touchend", handleLeave);

    // cleanup
    return () => {
      el.removeEventListener("pointermove", handlePointer as EventListener);
      el.removeEventListener("pointerleave", handleLeave);
      el.removeEventListener("touchmove", handlePointer as EventListener);
      el.removeEventListener("touchend", handleLeave);
      // reset vars when unmounted
      try {
        const node = rootRef.current;
        if (node) {
          node.style.setProperty("--mx", "-9999px");
          node.style.setProperty("--my", "-9999px");
          node.style.setProperty("--strength", "0");
        }
      } catch (_err) {
        /* ignore */
      }
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className="w-full fixed top-0 left-0 z-50">
        <nav
          aria-label="Main"
          className="mx-auto max-w-6xl"
          style={{ padding: "10px 14px" }}
        >
          <div className="relative rounded-md" style={{ height: 56 }}>
            {/* SVG filter (kept minimal) */}
            <svg
              style={{ position: "absolute", width: 0, height: 0 }}
              aria-hidden
            >
              <defs>
                <filter
                  id="liquid-filter"
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                >
                  <feTurbulence
                    baseFrequency="0.8"
                    numOctaves="2"
                    seed="2"
                    result="noise"
                  />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
                </filter>
              </defs>
            </svg>

            <div
              className="w-full h-full rounded-md flex items-center justify-between px-6 text-white select-none"
              style={
                {
                  position: "relative",
                  background: "rgba(0,0,0,0.35)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
                  backdropFilter: "blur(8px) saturate(120%)",
                  WebkitBackdropFilter: "blur(8px) saturate(120%)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  overflow: "hidden",
                  filter: "url(#liquid-filter)",
                } as React.CSSProperties
              }
            >
              <div style={{ width: 84 }} />

              <ul
                className="flex gap-6 text-sm font-medium"
                style={{ margin: 0, padding: 0, listStyle: "none" }}
              >
                <li>
                  <Link href="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="nav-link">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="nav-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="nav-link">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="nav-link">
                    Cart
                  </Link>
                </li>
              </ul>

              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-1.5 rounded-md border border-white/8 text-sm"
                  aria-label="Login"
                >
                  Login
                </button>
              </div>

              <div
                aria-hidden
                className="pointer-events-none"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  mixBlendMode: "screen",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 280,
                    height: 280,
                    transform: "translate(-50%,-50%) scale(var(--strength,0))",
                    left: "var(--mx)",
                    top: "var(--my)",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at center, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 40%, transparent 60%)",
                    transition: "transform 160ms linear, opacity 120ms linear",
                    opacity: "calc(var(--strength,0) * 1)",
                    pointerEvents: "none",
                    filter: "blur(6px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "var(--mx)",
                    top: "var(--my)",
                    width: 160,
                    height: 56,
                    transform: "translate(-50%,-50%)",
                    mixBlendMode: "overlay",
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg, rgba(255,230,200,0.06), rgba(200,220,255,0.04))",
                    pointerEvents: "none",
                    filter: "blur(8px)",
                    opacity: 0.9,
                  }}
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        :root {
          --mx: -9999px;
          --my: -9999px;
          --strength: 0;
        }
        .nav-link {
          color: rgba(255, 255, 255, 0.92);
          padding: 8px 6px;
          display: inline-block;
          border-radius: 6px;
          transition: color 160ms ease, transform 180ms ease,
            background-color 160ms ease;
          text-decoration: none;
        }
        .nav-link:hover,
        .nav-link:focus {
          color: #fff;
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.02);
        }
        @media (max-width: 768px) {
          nav ul {
            gap: 14px;
            font-size: 13px;
          }
          .nav-link {
            padding: 7px 5px;
          }
        }
      `}</style>
    </>
  );
}
