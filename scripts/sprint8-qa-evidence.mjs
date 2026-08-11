/**
 * Sprint 8 — smoke ecommerce + SEO + a11y evidence
 * Assumes `npm run start` on :1234 (or LOL_URL).
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const OUT = path.resolve("docs/screenshots");
fs.mkdirSync(OUT, { recursive: true });
const url = process.env.LOL_URL || "http://localhost:1234/";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // SEO home
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  const homeSeo = await page.evaluate(() => {
    const og = (p) => document.querySelector(`meta[property="${p}"]`)?.getAttribute("content");
    const name = (n) => document.querySelector(`meta[name="${n}"]`)?.getAttribute("content");
    return {
      title: document.title,
      description: name("description"),
      ogTitle: og("og:title"),
      ogDescription: og("og:description"),
      ogImage: og("og:image"),
      twitterCard: name("twitter:card"),
      h1: document.querySelector("h1")?.textContent?.trim(),
    };
  });
  fs.writeFileSync(path.join(OUT, "sprint-8-seo-home.json"), JSON.stringify(homeSeo, null, 2));

  // Sample product SEO — pick first shop product link
  await page.goto(url + "shop", { waitUntil: "domcontentloaded", timeout: 90000 });
  const productHref = await page.locator('a[href^="/products/"]').first().getAttribute("href");
  let productSeo = null;
  if (productHref) {
    await page.goto(url.replace(/\/$/, "") + productHref, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    productSeo = await page.evaluate(() => {
      const og = (p) => document.querySelector(`meta[property="${p}"]`)?.getAttribute("content");
      const name = (n) => document.querySelector(`meta[name="${n}"]`)?.getAttribute("content");
      return {
        path: location.pathname,
        title: document.title,
        description: name("description"),
        ogTitle: og("og:title"),
        ogImage: og("og:image"),
        h1: document.querySelector("h1")?.textContent?.trim(),
      };
    });
    fs.writeFileSync(
      path.join(OUT, "sprint-8-seo-product.json"),
      JSON.stringify(productSeo, null, 2)
    );
  }

  // Checkout flow preserved — API + page markers
  const checkoutPage = await page.goto(url + "checkout", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  const checkoutOk = checkoutPage?.ok();
  const ordersApi = await page.evaluate(async () => {
    // OPTIONS / GET shouldn't place order; just ensure module exists via shop API whatsapp
    const r = await fetch("/api/shop");
    const j = await r.json();
    return {
      status: r.status,
      whatsappNumber: j.whatsappNumber || null,
    };
  });

  // A11y keyboard: tab to hamburger + wishlist aria
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.setViewportSize({ width: 390, height: 844 });
  const a11y = await page.evaluate(async () => {
    const menu = document.querySelector('button[aria-label="Open menu"], button[aria-label="Close menu"]');
    const wish = document.querySelector('button[aria-label*="wishlist" i], a[aria-label="Wishlist"]');
    const customChips = [...document.querySelectorAll(".custom-choice-chip")];
    return {
      hamburgerAria: menu?.getAttribute("aria-label") || null,
      hamburgerControls: menu?.getAttribute("aria-controls") || null,
      wishlistAria:
        wish?.getAttribute("aria-label") ||
        document.querySelector('button[aria-label*="wishlist" i]')?.getAttribute("aria-label") ||
        null,
      customChipCount: customChips.length,
      customChipAria: customChips[0]?.getAttribute("aria-label") || null,
    };
  });

  // Tab focus smoke
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      aria: el?.getAttribute("aria-label"),
      text: (el?.textContent || "").trim().slice(0, 40),
      outline: getComputedStyle(el).outlineStyle,
    };
  });

  fs.writeFileSync(
    path.join(OUT, "sprint-8-ecom-a11y.json"),
    JSON.stringify({ checkoutOk, ordersApi, a11y, focused }, null, 2)
  );

  await browser.close();
  console.log("SEO home", homeSeo.title);
  console.log("SEO product", productSeo?.title);
  console.log("WA", ordersApi.whatsappNumber, "a11y", a11y);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
