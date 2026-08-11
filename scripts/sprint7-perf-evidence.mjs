/**
 * Sprint 7 evidence — network waterfall + reduced-motion screenshots
 * Run: node scripts/sprint7-perf-evidence.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = path.resolve("docs/screenshots");
fs.mkdirSync(OUT, { recursive: true });

const url = process.env.LOL_URL || "http://localhost:1234/";

function svgWaterfall(entries) {
  const W = 960;
  const rowH = 22;
  const pad = 16;
  const labelW = 300;
  const chartW = W - labelW - pad * 2;
  const H = pad * 2 + Math.max(entries.length, 1) * rowH + 48;
  const maxT = Math.max(...entries.map((e) => e.end), 1);

  const bars = entries
    .map((e, i) => {
      const y = pad + 28 + i * rowH;
      const x = labelW + (e.start / maxT) * chartW;
      const w = Math.max(2, ((e.end - e.start) / maxT) * chartW);
      const color = e.kind === "3d" ? "#E98F98" : e.kind === "js" ? "#8B6755" : "#AA7F66";
      const short = e.name.length > 44 ? e.name.slice(0, 42) + "…" : e.name;
      return `
      <text x="${pad}" y="${y + 12}" font-size="11" font-family="Segoe UI,sans-serif" fill="#30231F">${short
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</text>
      <rect x="${x}" y="${y + 2}" width="${w}" height="12" rx="3" fill="${color}" opacity="0.9"/>
      <text x="${x + w + 6}" y="${y + 12}" font-size="10" font-family="Segoe UI,sans-serif" fill="#8B6755">${Math.round(
        e.duration
      )}ms @${Math.round(e.start)}</text>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="#FFF9F5"/>
  <text x="${pad}" y="22" font-size="14" font-weight="600" font-family="Segoe UI,sans-serif" fill="#30231F">Sprint 7 — Network waterfall (Performance API)</text>
  <text x="${pad}" y="${H - 12}" font-size="10" font-family="Segoe UI,sans-serif" fill="#8B6755">Pink = 3D/GLB/R3F · Brown = JS · Milk tea = other · span ${Math.round(
    maxT
  )}ms</text>
  ${bars || `<text x="${pad}" y="56" fill="#8B6755">No resources captured</text>`}
</svg>`;
}

function classify(name) {
  if (/\.(glb|gltf)$/i.test(name) || /Hero3D|three|react-three|fiber|drei|webgl/i.test(name))
    return "3d";
  if (/\.js($|\?)/i.test(name) || name.includes("/_next/static/chunks/")) return "js";
  return "other";
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  // --- Waterfall (normal motion) ---
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const started = Date.now();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
    // Allow deferred 3D chunk + GLBs after first paint idle
    await page.waitForTimeout(5000);

    const resources = await page.evaluate(() => {
      return performance.getEntriesByType("resource").map((e) => ({
        name: e.name,
        start: e.startTime,
        duration: e.duration,
        end: e.startTime + e.duration,
        transferSize: e.transferSize || 0,
        initiatorType: e.initiatorType,
      }));
    });

    const entries = resources
      .map((r) => {
        const short = r.name.replace(/^https?:\/\/[^/]+/, "");
        return {
          name: short.slice(-90),
          start: r.start,
          end: r.end,
          duration: r.duration || 1,
          kind: classify(r.name + short),
          transferSize: r.transferSize,
        };
      })
      .sort((a, b) => a.start - b.start)
      .slice(0, 48);

    const threeish = entries.filter((e) => e.kind === "3d");
    const firstDocMs = Date.now() - started;
    const firstJs = entries.find((e) => e.kind === "js");
    const first3d = threeish[0];

    fs.writeFileSync(path.join(OUT, "sprint-7-waterfall.svg"), svgWaterfall(entries));
    fs.writeFileSync(
      path.join(OUT, "sprint-7-network.json"),
      JSON.stringify(
        {
          firstDocMs,
          firstJsStart: firstJs?.start ?? null,
          first3dStart: first3d?.start ?? null,
          deferred3d:
            first3d != null && firstJs != null ? first3d.start > firstJs.start : first3d != null,
          threeishCount: threeish.length,
          count: entries.length,
          threeish,
          entries,
        },
        null,
        2
      )
    );

    await page.screenshot({ path: path.join(OUT, "sprint-7-desktop.png"), fullPage: false });
    await page.close();
    console.log(
      "waterfall",
      entries.length,
      "3d",
      threeish.length,
      "first3d@",
      first3d?.start?.toFixed?.(0)
    );
  }

  // --- Mobile microcopy ---
  {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(3000);
    const copy = await page.locator('[data-sprint="7-microcopy"]').first().textContent();
    const ctaCount = await page.locator("a.btn-primary, a.btn-secondary").evaluateAll((els) => {
      // count visible CTAs in hero area approx
      return els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.width > 0 && getComputedStyle(el).display !== "none";
      }).length;
    });
    console.log("mobile microcopy:", copy?.trim(), "visibleCtas~", ctaCount);
    await page.screenshot({
      path: path.join(OUT, "sprint-7-mobile-microcopy.png"),
      fullPage: false,
    });
    await page.close();
  }

  // --- Reduced motion ---
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(2500);
    const canvasCount = await page.locator("canvas").count();
    const heroMin = await page.locator('[data-sprint="7-hero"]').evaluate((el) =>
      getComputedStyle(el).minHeight
    );
    console.log("reducedMotion canvasCount", canvasCount, "heroMinHeight", heroMin);
    await page.screenshot({
      path: path.join(OUT, "sprint-7-reduced-motion.png"),
      fullPage: false,
    });
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(OUT, "sprint-7-reduced-motion-scrolled.png"),
      fullPage: false,
    });
    await page.close();
  }

  await browser.close();
  console.log("wrote evidence to", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
