"use client";

import { useRef } from "react";
import LiquidGlass from "liquid-glass-react";
import Link from "next/link";

export default function GlassNav() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="w-full fixed top-0 left-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <LiquidGlass
          mouseContainer={containerRef}
          displacementScale={64}
          blurAmount={0.1}
          saturation={130}
          aberrationIntensity={2}
          elasticity={0.35}
          cornerRadius={16}
          padding="14px 28px"
          className="flex items-center justify-between gap-6"
          style={{ width: "100%" }}
        >
          {/* Empty left area because lans.lk has no logo */}
          <div style={{ width: 80 }} />

          <ul className="flex gap-6 text-white font-medium text-sm">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/cart">Cart</Link>
            </li>
          </ul>

          <button className="text-white/90 border border-white/20 px-4 py-1.5 rounded-lg">
            Login
          </button>
        </LiquidGlass>
      </nav>
    </div>
  );
}
