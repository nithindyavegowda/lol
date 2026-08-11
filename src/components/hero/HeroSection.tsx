"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { IconArrowRight } from "@/components/icons";
import { useAfterFirstPaint } from "@/hooks/useAfterFirstPaint";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => null,
});

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Full-bleed layered hero:
 * photo BG → full-screen Canvas (z-0) → cream wash (z-1) → copy/CTAs (z-10)
 * No right-side card. Pointer moves on the section; UI is pointer-events-none except buttons.
 */
export function Hero() {
  const stageRef = useRef<HTMLElement>(null);
  const webgl = useWebGLSupport();
  const reducedMotion = usePrefersReducedMotion();
  const canMount3D = useAfterFirstPaint(60);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hint, setHint] = useState(true);

  const updatePointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
      setPointer({ x: clamp(nx, -1, 1), y: clamp(-ny, -1, 1) });
      if (hint) setHint(false);
    },
    [hint]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion) return;
      updatePointer(e.clientX, e.clientY);
    },
    [reducedMotion, updatePointer]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (reducedMotion) return;
      const t = e.touches[0];
      if (!t) return;
      updatePointer(t.clientX, t.clientY);
    },
    [reducedMotion, updatePointer]
  );

  const onLeave = useCallback(() => {
    setPointer((p) => ({ x: p.x * 0.25, y: p.y * 0.25 }));
  }, []);

  const show3D = webgl === true && canMount3D && !reducedMotion;
  const interactive = show3D && !reducedMotion;

  return (
    <section
      ref={stageRef}
      className="relative overflow-hidden h-[70vh] min-h-[28rem] max-h-[52rem]"
      data-sprint="hero-fullscreen-3d"
      aria-label="Interactive crochet hero scene"
      onMouseMove={interactive ? onMouseMove : undefined}
      onMouseLeave={interactive ? onLeave : undefined}
      onTouchMove={interactive ? onTouchMove : undefined}
    >
      {/* 1) Photographic studio base */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/assets/hero/hero-background-mobile.webp"
            type="image/webp"
          />
          <source srcSet="/assets/hero/hero-background.webp" type="image/webp" />
          <Image
            src="/assets/hero/hero-workspace-background.png"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="100vw"
          />
        </picture>
      </div>

      {/* 2) Full-screen 3D Canvas — absolute inset-0, z-0 */}
      {show3D ? (
        <div className="absolute inset-0 z-0 w-full h-full">
          <Hero3D pointer={pointer} reducedMotion={reducedMotion} />
        </div>
      ) : null}

      {/* 3) Half-faded cream wash — above Canvas, below UI */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-[#F8F1EB]/65 sm:bg-[#F8F1EB]/60"
        aria-hidden
      />
      {/* Stronger wash on the left so headline stays crisp */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#F8F1EB]/85 via-[#F8F1EB]/35 to-transparent"
        aria-hidden
      />

      {/* 4) Copy / CTAs — higher z, pass-through except interactive controls */}
      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center pointer-events-none">
        <div className="max-w-xl py-6">
          <p className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[var(--brown)] mb-2">
            Yarn + Hook + You = LOL
          </p>
          <h1 className="font-display text-[2.5rem] leading-[0.95] sm:text-5xl lg:text-6xl tracking-tight text-[var(--espresso)]">
            Small loops.
            <br />
            Big magic.
          </h1>
          <p className="mt-3 max-w-md text-sm sm:text-base text-[var(--brown)] leading-relaxed">
            Handmade crochet pieces that turn simple yarn into something unforgettable.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 pointer-events-auto">
            <Link href="/shop" className="btn-primary btn-yarn">
              Shop the collection <IconArrowRight size={18} />
            </Link>
            <Link href="/custom" className="btn-secondary hidden sm:inline-flex">
              Custom order ✦
            </Link>
          </div>

          {interactive && hint ? (
            <p className="mt-6 text-xs text-[var(--brown)] opacity-80">
              Move to turn · Lift with your cursor
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function HeroSection() {
  return <Hero />;
}
