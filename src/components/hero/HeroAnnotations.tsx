"use client";

/** Handwritten floating annotations — PHASE 6 style */
export function HeroAnnotations({ progress }: { progress: number }) {
  const almostDone = progress > 0.85;
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]" data-sprint="4-annotations" aria-hidden>
      <p className="annotation absolute left-[4%] top-[22%] -rotate-6 text-lg sm:text-xl text-[var(--brown)] opacity-90">
        Made slowly.
      </p>
      <p className="annotation absolute right-[6%] top-[28%] rotate-3 text-lg sm:text-xl text-[var(--brown)] opacity-90">
        Same hook. Bigger dreams.
      </p>
      <p className="annotation absolute left-[8%] bottom-[24%] rotate-2 text-xl sm:text-2xl text-[var(--espresso)]">
        {almostDone ? "Look what we made. ♥" : "Almost there..."}
      </p>
      <p className="annotation absolute right-[10%] bottom-[18%] -rotate-3 text-base sm:text-lg text-[var(--brown)] opacity-80">
        Loved loudly.
      </p>
    </div>
  );
}
