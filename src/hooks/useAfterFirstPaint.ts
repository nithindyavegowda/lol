"use client";

import { useEffect, useState } from "react";

/**
 * PHASE 16 — defer heavy work until after first paint.
 * Returns true once the browser is idle (or after a short timeout fallback).
 */
export function useAfterFirstPaint(delayMs = 80) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const go = () => {
      if (!cancelled) setReady(true);
    };

    // Double rAF ≈ after first paint, then idle if available
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ric = (
          window as Window & {
            requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
          }
        ).requestIdleCallback;

        if (typeof ric === "function") {
          idleId = ric(go, { timeout: 1200 });
        } else {
          timeoutId = setTimeout(go, delayMs);
        }
      });
    });

    return () => {
      cancelled = true;
      if (idleId != null && "cancelIdleCallback" in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delayMs]);

  return ready;
}
