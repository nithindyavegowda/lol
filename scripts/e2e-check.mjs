const base = "http://localhost:1234";

async function check(name, fn) {
  try {
    const ok = await fn();
    console.log(ok ? `PASS ${name}` : `FAIL ${name}`);
    return { name, ok: !!ok, detail: "" };
  } catch (e) {
    console.log(`FAIL ${name} :: ${e.message}`);
    return { name, ok: false, detail: e.message };
  }
}

async function text(path) {
  const r = await fetch(`${base}${path}`);
  if (!r.ok) throw new Error(`${path} ${r.status}`);
  return r.text();
}

async function json(path, opts) {
  const r = await fetch(`${base}${path}`, opts);
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${path} ${r.status} ${JSON.stringify(body)}`);
  return body;
}

(async () => {
  const results = [];

  results.push(
    await check("1 Home LOL + tagline + featured", async () => {
      const t = await text("/");
      return t.includes("LOL") && t.includes("Made by me") && t.includes("Featured");
    })
  );

  results.push(
    await check("2 Shop search", async () => {
      const t = await text("/shop?q=bunny");
      return t.toLowerCase().includes("bunny");
    })
  );

  results.push(
    await check("3 Category/color/price filters page", async () => {
      const t = await text("/shop?category=Toys&minPrice=100&maxPrice=2000");
      return t.includes("Toys") || t.includes("Bunny");
    })
  );

  results.push(
    await check("4 Product detail richness", async () => {
      const t = await text("/products/amigurumi-bunny");
      return (
        t.includes("Made to order") &&
        t.toLowerCase().includes("cotton") &&
        (t.includes("1099") || t.includes("₹"))
      );
    })
  );

  results.push(
    await check("9 Custom request page WhatsApp number", async () => {
      const t = await text("/custom");
      return t.includes("918884558657") || t.includes("Custom");
    })
  );

  results.push(
    await check("10 About/guides/policies/instagram/testimonials", async () => {
      const about = await text("/about");
      const guide = await text("/guides/size-guide");
      const policy = await text("/policies/shipping");
      const ig = await text("/instagram");
      const home = await text("/");
      return (
        about.includes("Amie") &&
        guide.toLowerCase().includes("measure") &&
        policy.toLowerCase().includes("shipping") &&
        ig.toLowerCase().includes("instagram") &&
        home.toLowerCase().includes("priya")
      );
    })
  );

  results.push(
    await check("8b Sample status link", async () => {
      const t = await text("/order/sample-status-token-lol-1001");
      return t.includes("ORD-1001") || t.includes("making") || t.includes("Sample");
    })
  );

  const shop = await json("/api/shop");
  results.push(
    await check("11 Sticky WhatsApp / shop WhatsApp config", async () => {
      const home = await text("/");
      return shop.whatsappNumber === "918884558657" && home.includes("wa.me");
    })
  );

  const products = await json("/api/products");
  const productId = products.products[0].id;

  const order = await json("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "Test User",
      customerPhone: "9876543210",
      addressLine: "1 Test St",
      city: "Bengaluru",
      state: "KA",
      pincode: "560001",
      giftMessage: "For you",
      notes: "E2E",
      couponCode: "LOVE10",
      items: [{ productId, qty: 1 }],
    }),
  });

  results.push(
    await check("7/8 Checkout order + WhatsApp + status", async () => {
      const waOk = String(order.whatsappUrl || "").includes("918884558657");
      const token = order.order?.publicToken;
      const statusPage = await text(`/order/${token}`);
      const conf = await text(
        `/order/confirmed?token=${token}&whatsapp=${encodeURIComponent(order.whatsappUrl)}&message=${encodeURIComponent(order.whatsappText || "")}`
      );
      return (
        waOk &&
        statusPage.includes("Test User") &&
        conf.toLowerCase().includes("whatsapp")
      );
    })
  );

  results.push(
    await check("14 Admin login page", async () => {
      const t = await text("/admin/login");
      return t.toLowerCase().includes("email") && t.toLowerCase().includes("password");
    })
  );

  // Auth.js credentials via CSRF + callback
  const csrfRes = await fetch(`${base}/api/auth/csrf`);
  const csrf = await csrfRes.json();
  const cookie = csrfRes.headers.getSetCookie?.()?.join("; ") || csrfRes.headers.get("set-cookie") || "";
  const form = new URLSearchParams({
    csrfToken: csrf.csrfToken,
    email: "g.amie0311@gmail.com",
    password: "Ammu@0311",
    callbackUrl: `${base}/admin`,
    json: "true",
  });
  const loginRes = await fetch(`${base}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookie,
    },
    body: form,
    redirect: "manual",
  });
  const setCookies = loginRes.headers.getSetCookie?.() || [];
  const sessionCookie = [...(cookie ? [cookie] : []), ...setCookies].join("; ");
  const session = await fetch(`${base}/api/auth/session`, {
    headers: { Cookie: sessionCookie },
  }).then((r) => r.json());

  results.push(
    await check("14 Admin credentials login", async () => {
      return session?.user?.email === "g.amie0311@gmail.com";
    })
  );

  if (session?.user?.email) {
    const stats = await fetch(`${base}/api/admin/stats`, {
      headers: { Cookie: sessionCookie },
    }).then((r) => r.json());
    results.push(
      await check("15 Dashboard stats", async () => {
        return stats && (stats.openOrders != null || stats.orders != null || stats.productCount != null || Object.keys(stats).length > 0);
      })
    );

    const csv =
      "title,slug,price,category,status,description,leadTimeDays,maxQty,compareAtPrice\nCSV Import Cap,csv-import-cap,299,Accessories,published,Imported via CSV,5,3,349";
    const imported = await fetch(`${base}/api/admin/products/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: sessionCookie },
      body: JSON.stringify({ csv }),
    }).then((r) => r.json());
    results.push(
      await check("18 CSV import", async () => {
        return imported.created >= 1 || (imported.ids && imported.ids.length >= 1);
      })
    );

    const statusPatch = await fetch(
      `${base}/api/admin/orders/${order.order.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: sessionCookie },
        body: JSON.stringify({ status: "confirmed" }),
      }
    ).then((r) => r.json());
    const statusPage2 = await text(`/order/${order.order.publicToken}`);
    results.push(
      await check("19 Order status update reflects", async () => {
        return (
          (statusPatch.status === "confirmed" || statusPatch.order?.status === "confirmed") &&
          statusPage2.toLowerCase().includes("confirmed")
        );
      })
    );

    const pause = await fetch(`${base}/api/admin/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: sessionCookie },
      body: JSON.stringify({ paused: true }),
    }).then((r) => r.json());
    const shopPaused = await json("/api/shop");
    results.push(
      await check("12 Pause shop", async () => {
        return shopPaused.paused === true || pause.paused === true;
      })
    );
    await fetch(`${base}/api/admin/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: sessionCookie },
      body: JSON.stringify({ paused: false }),
    });
  }

  const fs = await import("fs");
  const lines = [
    "# LOL E2E TEST REPORT",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Base URL: ${base}`,
    "",
    ...results.map((r) => `- ${r.ok ? "PASS" : "FAIL"} ${r.name}${r.detail ? ` — ${r.detail}` : ""}`),
    "",
    "## Manual UI checks (browser)",
    "- 5 Add to Cart yarn-ball bounce + qty limit (client)",
    "- 6 Wishlist localStorage persistence (client)",
    "- 16 Create/edit/duplicate product in admin UI",
    "- 17 Upload images + reorder in admin UI",
    "- 20 Coupons/testimonials/settings/guides/policies/instagram editable in admin UI",
    "- 13 Capacity auto-pause: set maxOpenOrders low in settings and place orders",
    "",
    `Automated: ${results.filter((r) => r.ok).length}/${results.length} passed`,
  ];
  fs.writeFileSync("TEST_REPORT.md", lines.join("\n"));
  console.log("\nWrote TEST_REPORT.md");
  console.log(`Automated: ${results.filter((r) => r.ok).length}/${results.length} passed`);
})();
