"use client";

import { RefObject, useCallback, useEffect, useState } from "react";

/**
 * Scroll progress 0→1 for a hero section that is taller than the viewport.
 * Based on how far the section has scrolled through the viewport.
 */
export function useScrollProgress(sectionRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight || 1;
    const total = Math.max(rect.height - viewH, 1);
    // 0 when section top at top of viewport; 1 when section bottom reaches bottom
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    setProgress(scrolled / total);
  }, [sectionRef]);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return progress;
}

/** Ease-out cubic for scroll mapping */
export function easeOutCubic(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - x, 3);
}
