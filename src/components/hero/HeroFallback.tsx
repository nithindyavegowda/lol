"use client";

/**
 * PHASE 17 — static photographic hero when WebGL is unavailable.
 * Never renders a blank box.
 */
export function HeroFallback() {
  return (
    <div
      className="relative w-full h-full min-h-[360px] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--cream)]"
      data-sprint="4-fallback"
      role="img"
      aria-label="Handmade crochet character hanging from a hook"
    >
      <picture className="absolute inset-0 block w-full h-full">
        <source srcSet="/assets/hero/hero-fallback.webp" type="image/webp" />
        <img
          src="/assets/hero/hero-character-lifestyle.png"
          alt="Handmade crochet character suspended from a pink crochet hook"
          className="w-full h-full object-cover"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(48,35,31,0.28)] via-transparent to-transparent pointer-events-none" />
      <p className="annotation absolute left-4 bottom-6 text-xl sm:text-2xl text-[var(--cream)] drop-shadow">
        Almost there...
      </p>
      <p className="annotation absolute right-5 top-10 text-lg sm:text-xl text-[var(--cream)] drop-shadow rotate-6">
        Made slowly.
      </p>
    </div>
  );
}
