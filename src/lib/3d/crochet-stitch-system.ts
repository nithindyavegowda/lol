/**
 * Procedural crochet stitch progress helper (PLACEHOLDER system).
 * Used by the hero to map 0→1 scroll progress into stitch density / reveal stages.
 * Replace with morph-target or shader reveal when a production GLB is available.
 */

export type CrochetStage =
  | "start"
  | "hook"
  | "body"
  | "shape"
  | "details"
  | "finish"
  | "done";

export function progressToStage(progress: number): CrochetStage {
  const p = Math.max(0, Math.min(1, progress));
  if (p < 0.15) return "start";
  if (p < 0.3) return "hook";
  if (p < 0.45) return "body";
  if (p < 0.65) return "shape";
  if (p < 0.85) return "details";
  if (p < 0.97) return "finish";
  return "done";
}

export function stitchCountForProgress(progress: number, max = 10) {
  return Math.floor(Math.max(0, Math.min(1, progress)) * max);
}

export function yarnLengthForProgress(progress: number) {
  return 0.6 + Math.max(0, Math.min(1, progress)) * 1.4;
}

export function characterDropForProgress(progress: number) {
  // Non-linear drop — ease toward bottom as crochet completes
  const p = Math.max(0, Math.min(1, progress));
  return p * p * 1.35;
}
