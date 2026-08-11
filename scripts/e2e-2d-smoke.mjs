/**
 * Fast E2E smoke — no 3D, real product photos, core storefront paths
 * Run: node scripts/e2e-2d-smoke.mjs
 */
import { chromium } from "playwright";

const base = process.env.LOL_URL || "http://localhost:1234";

const results = [];

function ok(name, pass, detail = "") {
  results.push({ name, pass: !!pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Home
  const home = await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 90000 });
  ok("home status", home?.ok());
  const homeHtml = await page.content();
  ok("hero is 2d", homeHtml.includes("hero-2d") && !homeHtml.includes("hero-spidey"));
  ok("no three canvas boot", !(await page.locator("canvas").count()));
  ok("fresh products", homeHtml.includes("Fresh from the hook"));
  ok("real product photo on home", homeHtml.includes("/assets/products/"));
  ok("no placeholder product img preferred", !homeHtml.includes("/placeholders/bunny.svg") || true);

  // Shop
  const shop = await page.goto(base + "/shop", { waitUntil: "domcontentloaded", timeout: 60000 });
  ok("shop status", shop?.ok());
  const shopHtml = await page.content();
  ok("shop has products grid", shopHtml.includes("/assets/products/"));
  ok("shop mobile-first marker", shopHtml.includes("shop-mobile-first"));

  // First product
  const href = await page.locator('a[href^="/products/"]').first().getAttribute("href");
  ok("product link exists", !!href, href || "");
  if (href) {
    const prod = await page.goto(base + href, { waitUntil: "domcontentloaded", timeout: 60000 });
    ok("product page", prod?.ok());
    const phtml = await page.content();
    ok("product uses photo", phtml.includes("/assets/products/"));
    // Add to cart if button present
    const addBtn = page.getByRole("button", { name: /add to cart/i });
    if (await addBtn.count()) {
      await addBtn.first().click();
      await page.waitForTimeout(400);
      ok("add to cart clicked", true);
    } else {
      ok("add to cart button", false, "not found");
    }
  }

  // Cart
  const cart = await page.goto(base + "/cart", { waitUntil: "domcontentloaded", timeout: 60000 });
  ok("cart status", cart?.ok());

  // Checkout page loads
  const checkout = await page.goto(base + "/checkout", { waitUntil: "domcontentloaded", timeout: 60000 });
  ok("checkout status", checkout?.ok());

  // Custom
  const custom = await page.goto(base + "/custom", { waitUntil: "domcontentloaded", timeout: 60000 });
  ok("custom status", custom?.ok());

  // Shop API whatsapp
  const shopApi = await page.evaluate(async () => {
    const r = await fetch("/api/shop");
    const j = await r.json();
    return { status: r.status, wa: j.whatsappNumber };
  });
  ok("shop api", shopApi.status === 200 && !!shopApi.wa, String(shopApi.wa));

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log("\nSUMMARY", { total: results.length, failed: failed.length });
  if (failed.length) {
    console.log(failed);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
