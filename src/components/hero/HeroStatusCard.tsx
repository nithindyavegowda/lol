"use client";

/**
 * HeroStatusCard — PHASE 5 (static Sprint 3 data)
 */
export function HeroStatusCard({
  finishing = 72,
}: {
  finishing?: number;
}) {
  return (
    <aside
      className="hero-status-card max-w-[16.5rem] w-full"
      data-sprint="3-status-card"
      aria-label="Crochet progress status"
    >
      <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[var(--brown)]">
        What&apos;s happening
      </p>
      <p className="mt-1.5 text-sm font-medium text-[var(--espresso)]">
        Crocheting your favorite piece...
      </p>
      <ul className="mt-3 text-xs space-y-1.5 text-[var(--brown)]">
        <li className="flex justify-between gap-3">
          <span>Body</span>
          <span className="text-[var(--lol-pink)] font-semibold">✓</span>
        </li>
        <li className="flex justify-between gap-3">
          <span>Head</span>
          <span className="text-[var(--lol-pink)] font-semibold">✓</span>
        </li>
        <li className="flex justify-between gap-3">
          <span>Finishing</span>
          <span className="text-[var(--lol-pink)] font-semibold">{finishing}%</span>
        </li>
      </ul>
      <div className="mt-3 h-1.5 rounded-full bg-[var(--pink-soft)] overflow-hidden" aria-hidden>
        <div
          className="h-full rounded-full bg-[var(--lol-pink)] transition-[width] duration-500"
          style={{ width: `${finishing}%` }}
        />
      </div>
      <p className="annotation mt-2 text-base">Almost there... ♥</p>
    </aside>
  );
}
