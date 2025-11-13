import React, { useRef } from "react";
import LiquidGlass from "liquid-glass-react";
import Link from "next/link";

export default function GlassNavbar() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <nav role="navigation" aria-label="Main navigation">
      <div ref={containerRef} className="w-full">
        {/* Single liquid glass bar */}
        <LiquidGlass
          mouseContainer={containerRef}
          padding="6px 16px"
          cornerRadius={12}
          blurAmount={0.08}
          displacementScale={48}
          elasticity={0.18}
          className="backdrop-filter fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-6xl w-[95%]"
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          {/* Left: logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              {/* your svg/logo */}
              <span className="font-bold">K</span>
            </div>
            <span className="sr-only">Home</span>
          </div>

          {/* Center: nav links */}
          <div className="flex-1 flex justify-center gap-6">
            <Link href="/projects">
              <a className="px-3 py-2 rounded-md focus:outline-none focus:ring-2">
                Projects
              </a>
            </Link>
            <Link href="/about">
              <a className="px-3 py-2 rounded-md focus:outline-none focus:ring-2">
                About
              </a>
            </Link>
            <Link href="/contact">
              <a className="px-3 py-2 rounded-md focus:outline-none focus:ring-2">
                Contact
              </a>
            </Link>
          </div>

          {/* Right: CTA */}
          <div>
            <button className="px-3 py-2 rounded-md focus:outline-none focus:ring-2">
              Subscribe
            </button>
          </div>
        </LiquidGlass>
      </div>
    </nav>
  );
}
