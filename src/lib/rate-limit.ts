/** Simple in-memory IP rate limiter (per-instance; resets on cold start). */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * @returns null if allowed, or a Response to return (429)
 */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): Response | null {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + opts.windowMs };
    buckets.set(key, b);
  }
  b.count += 1;
  if (b.count > opts.limit) {
    const retry = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
    return new Response(JSON.stringify({ error: "Too many requests. Try again shortly." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retry),
      },
    });
  }
  return null;
}
