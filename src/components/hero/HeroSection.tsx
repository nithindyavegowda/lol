"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

/**
 * Fast 2D hero — photographic background only (no WebGL / Three.js).
 */
export function Hero() {
  return (
    <section
      className="relative overflow-hidden h-[58vh] min-h-[22rem] max-h-[36rem]"
      data-sprint="hero-2d"
      aria-label="LOL handmade crochet hero"
    >
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
            className="object-cover object-center scale-[1.02]"
            sizes="100vw"
          />
        </picture>
        {/* Light wash — bright cream, keep photo readable */}
        <div className="absolute inset-0 bg-[#FFF9F5]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9F5]/88 via-[#FFF9F5]/45 to-[#FFF9F5]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F1EB]/50 via-transparent to-[#FFF9F5]/20" />
      </div>

      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center">
        <div className="max-w-xl py-6 animate-hero-in">
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
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary btn-yarn">
              Shop the collection <IconArrowRight size={18} />
            </Link>
            <Link href="/custom" className="btn-secondary hidden sm:inline-flex">
              Custom order ✦
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroSection() {
  return <Hero />;
}
