import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const placeholders = [
  "/placeholders/bunny.svg",
  "/placeholders/bag.svg",
  "/placeholders/coaster.svg",
  "/placeholders/hat.svg",
  "/placeholders/flower.svg",
  "/placeholders/scarf.svg",
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "g.amie0311@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "Ammu@0311";
  const hash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: { email, passwordHash: hash },
  });

  await prisma.shopSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      announcement: "Orders open · handmade to order · ships in 10–14 days",
      paused: false,
      maxOpenOrders: 10,
      upiId: "amie@upi",
      depositNote: "50% deposit via UPI to confirm; balance before shipping.",
      whatsappNumber: "918884558657",
      shippingRules: JSON.stringify({
        flatFee: 79,
        bands: [
          { prefix: "560", fee: 49 },
          { prefix: "400", fee: 99 },
        ],
      }),
      instagramLinks: JSON.stringify([
        {
          url: "https://instagram.com",
          caption: "Bunny in blush pink",
          thumb: placeholders[0],
        },
        {
          url: "https://instagram.com",
          caption: "Market bag in milk tea tones",
          thumb: placeholders[1],
        },
        {
          url: "https://instagram.com",
          caption: "Sakura coaster set",
          thumb: placeholders[2],
        },
      ]),
      aboutContent: `Hi, I'm Amie — the hands behind LOL (Loops of Love).\n\nEvery piece is crocheted to order with soft yarns and a lot of patience. "${"Made by me, made for you"}" isn't just a tagline; it's how each loop leaves my hook.\n\nTell me your colours, your gift story, or a custom idea — I'll stitch it with care.`,
      shopName: "LOL",
      shopTagline: "Made by me, made for you",
    },
  });

  await prisma.coupon.upsert({
    where: { code: "LOVE10" },
    update: { active: true, type: "percent", value: 10 },
    create: { code: "LOVE10", type: "percent", value: 10, active: true },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME50" },
    update: { active: true, type: "fixed", value: 50 },
    create: { code: "WELCOME50", type: "fixed", value: 50, active: true },
  });

  const products = [
    {
      title: "Amigurumi Bunny",
      slug: "amigurumi-bunny",
      subtitle: "Soft companion for shelves & hugs",
      description:
        "A cuddly handmade bunny with embroidered eyes and a tiny bow. Perfect as a gift or nursery friend.",
      category: "Toys",
      tags: ["bunny", "gift", "nursery"],
      bullets: ["Soft cotton yarn", "Safety embroidered face", "Gift-ready packaging"],
      materials: { fiber: "100% cotton", yarnBrand: "Local dyed", notes: "Hypoallergenic fill" },
      care: "Spot clean or gentle hand wash. Air dry flat.",
      dimensions: "18 cm tall",
      weight: "120 g",
      price: 899,
      compareAtPrice: 1099,
      maxQty: 2,
      leadTimeDays: 10,
      featured: true,
      status: "published",
      colors: ["Pink", "Cream", "Chocolate"],
      sizes: ["Small"],
      image: placeholders[0],
    },
    {
      title: "Granny Square Market Bag",
      slug: "granny-square-market-bag",
      subtitle: "Roomy, stretchy, made for everyday errands",
      description: "Classic granny motifs joined into a sturdy tote with long straps.",
      category: "Bags",
      tags: ["bag", "market", "everyday"],
      bullets: ["Expands with shopping", "Comfortable straps", "Machine-friendly cotton"],
      materials: { fiber: "Cotton blend", yarnBrand: "Milk tea palette", notes: "Lined base optional" },
      care: "Hand wash cold. Dry flat.",
      dimensions: "35 × 40 cm (unstretched)",
      weight: "280 g",
      price: 1299,
      compareAtPrice: 1499,
      maxQty: 3,
      leadTimeDays: 14,
      featured: true,
      status: "published",
      colors: ["Blue", "Milk Tea", "Sakura"],
      sizes: ["One size"],
      image: placeholders[1],
    },
    {
      title: "Sakura Coaster Set",
      slug: "sakura-coaster-set",
      subtitle: "Set of 4 blush petal coasters",
      description: "Delicate petal-inspired coasters to soften your tea table.",
      category: "Home",
      tags: ["coaster", "home", "sakura"],
      bullets: ["Set of 4", "Absorbent cotton", "Matching stitch story"],
      materials: { fiber: "Cotton", yarnBrand: "Sakura dye lot", notes: "Felt backing optional" },
      care: "Hand wash. Reshape while damp.",
      dimensions: "10 cm diameter each",
      weight: "90 g",
      price: 499,
      compareAtPrice: 599,
      maxQty: 5,
      leadTimeDays: 7,
      featured: true,
      status: "published",
      colors: ["Sakura", "Misty Rose"],
      sizes: ["Set of 4"],
      image: placeholders[2],
    },
    {
      title: "Chunky Beanie",
      slug: "chunky-beanie",
      subtitle: "Warm winter staple with soft brim",
      description: "A cozy ribbed beanie with just enough stretch for all-day wear.",
      category: "Apparel",
      tags: ["hat", "winter", "warm"],
      bullets: ["Ribbed stretch", "Warm acrylic blend", "Unisex fit"],
      materials: { fiber: "Acrylic blend", yarnBrand: "Aloewood tones", notes: "Soft against skin" },
      care: "Gentle machine wash in a bag. Dry flat.",
      dimensions: "Fits 54–58 cm head",
      weight: "150 g",
      price: 799,
      compareAtPrice: null,
      maxQty: 4,
      leadTimeDays: 8,
      featured: false,
      status: "published",
      colors: ["Chocolate", "Aloewood", "Cream"],
      sizes: ["Adult"],
      image: placeholders[3],
    },
    {
      title: "Bouquet Flower Brooch",
      slug: "bouquet-flower-brooch",
      subtitle: "Wearable blossom for jackets & bags",
      description: "A tiny crochet flower pin with a secure clasp — cheerful and light.",
      category: "Accessories",
      tags: ["brooch", "flower", "gift"],
      bullets: ["Lightweight pin", "Gift pouch included", "Colour customisable"],
      materials: { fiber: "Cotton", yarnBrand: "Scrap-happy mixes", notes: "Metal clasp" },
      care: "Spot clean only.",
      dimensions: "6 cm bloom",
      weight: "15 g",
      price: 349,
      compareAtPrice: 399,
      maxQty: 6,
      leadTimeDays: 5,
      featured: false,
      status: "published",
      colors: ["Sakura", "Yellow", "Lavender"],
      sizes: ["One size"],
      image: placeholders[4],
    },
    {
      title: "Soft Scarf Wrap",
      slug: "soft-scarf-wrap",
      subtitle: "Long lightweight wrap for breezy evenings",
      description: "An airy openwork scarf that drapes softly without bulk.",
      category: "Apparel",
      tags: ["scarf", "wrap", "gift"],
      bullets: ["Openwork stitch", "Lightweight drape", "Generous length"],
      materials: { fiber: "Cotton-bamboo", yarnBrand: "Misty rose lot", notes: "Breathable" },
      care: "Hand wash cold. Dry flat in shade.",
      dimensions: "180 × 35 cm",
      weight: "210 g",
      price: 1199,
      compareAtPrice: 1399,
      maxQty: 2,
      leadTimeDays: 12,
      featured: true,
      status: "published",
      colors: ["Misty Rose", "Cream", "Milk Tea"],
      sizes: ["One size"],
      image: placeholders[5],
    },
    {
      title: "Draft: Heart Keychain",
      slug: "draft-heart-keychain",
      subtitle: "Coming soon mini heart",
      description: "A pocket-sized heart keychain — still being perfected.",
      category: "Accessories",
      tags: ["draft"],
      bullets: ["Mini size", "Keyring included"],
      materials: { fiber: "Cotton", yarnBrand: "TBD", notes: "" },
      care: "Spot clean.",
      dimensions: "4 cm",
      weight: "10 g",
      price: 199,
      compareAtPrice: null,
      maxQty: 10,
      leadTimeDays: 4,
      featured: false,
      status: "draft",
      colors: ["Red"],
      sizes: ["One size"],
      image: placeholders[4],
    },
    {
      title: "Draft: Baby Booties",
      slug: "draft-baby-booties",
      subtitle: "Soft soles in progress",
      description: "Tiny booties with a secure ankle tie — draft listing.",
      category: "Apparel",
      tags: ["draft", "baby"],
      bullets: ["Soft sole", "Tie closure"],
      materials: { fiber: "Cotton", yarnBrand: "Baby soft", notes: "" },
      care: "Hand wash.",
      dimensions: "Newborn–3M",
      weight: "40 g",
      price: 599,
      compareAtPrice: null,
      maxQty: 2,
      leadTimeDays: 9,
      featured: false,
      status: "draft",
      colors: ["Cream"],
      sizes: ["Newborn"],
      image: placeholders[3],
    },
  ];

  for (const p of products) {
    const created = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        category: p.category,
        tags: JSON.stringify(p.tags),
        bullets: JSON.stringify(p.bullets),
        materials: JSON.stringify(p.materials),
        care: p.care,
        dimensions: p.dimensions,
        weight: p.weight,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        maxQty: p.maxQty,
        leadTimeDays: p.leadTimeDays,
        featured: p.featured,
        status: p.status,
      },
      create: {
        title: p.title,
        slug: p.slug,
        subtitle: p.subtitle,
        description: p.description,
        category: p.category,
        tags: JSON.stringify(p.tags),
        bullets: JSON.stringify(p.bullets),
        materials: JSON.stringify(p.materials),
        care: p.care,
        dimensions: p.dimensions,
        weight: p.weight,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        maxQty: p.maxQty,
        leadTimeDays: p.leadTimeDays,
        featured: p.featured,
        status: p.status,
        images: {
          create: [
            { url: p.image, alt: p.title, sortOrder: 0 },
            { url: p.image, alt: `${p.title} detail`, sortOrder: 1 },
          ],
        },
        variants: {
          create: p.colors.flatMap((color) =>
            p.sizes.map((size) => ({
              color,
              size,
              sku: `${p.slug}-${color}-${size}`.toLowerCase().replace(/\s+/g, "-"),
            }))
          ),
        },
      },
    });

    const imgCount = await prisma.productImage.count({ where: { productId: created.id } });
    if (imgCount === 0) {
      await prisma.productImage.createMany({
        data: [
          { productId: created.id, url: p.image, alt: p.title, sortOrder: 0 },
          { productId: created.id, url: p.image, alt: `${p.title} detail`, sortOrder: 1 },
        ],
      });
    }
  }

  const published = await prisma.product.findMany({ where: { status: "published" } });
  for (const product of published) {
    const related = published.filter((x) => x.id !== product.id && x.category === product.category).slice(0, 2);
    for (const r of related) {
      await prisma.relatedProduct.upsert({
        where: {
          productId_relatedId: { productId: product.id, relatedId: r.id },
        },
        update: {},
        create: { productId: product.id, relatedId: r.id },
      });
    }
    if (related.length < 2) {
      const extras = published.filter((x) => x.id !== product.id).slice(0, 2 - related.length);
      for (const r of extras) {
        await prisma.relatedProduct.upsert({
          where: {
            productId_relatedId: { productId: product.id, relatedId: r.id },
          },
          update: {},
          create: { productId: product.id, relatedId: r.id },
        });
      }
    }
  }

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        quote: "The bunny arrived softer than I imagined — my niece sleeps with it every night.",
        name: "Priya S.",
        published: true,
        sortOrder: 0,
      },
      {
        quote: "Loved being able to pick colours. The market bag holds a full week of veggies!",
        name: "Ananya R.",
        published: true,
        sortOrder: 1,
      },
      {
        quote: "Amie kept me updated on WhatsApp. Felt personal, not like a big store.",
        name: "Kavya M.",
        published: true,
        sortOrder: 2,
      },
    ],
  });

  await prisma.guidePage.upsert({
    where: { slug: "size-guide" },
    update: {},
    create: {
      slug: "size-guide",
      title: "Size guide",
      content: `## How to measure\n\n- **Hats:** measure head circumference above the ears.\n- **Bags:** listed sizes are unstretched; cotton stretches gently with use.\n- **Toys:** heights are approximate tip-to-toe.\n\nIf you are between sizes, leave a note at checkout — I'll adjust the stitch count.`,
      published: true,
    },
  });

  await prisma.guidePage.upsert({
    where: { slug: "color-guide" },
    update: {},
    create: {
      slug: "color-guide",
      title: "Colour guide",
      content: `## Our LOL palette\n\n- **Dark Chocolate** — deep warm brown\n- **Aloewood** — earthy medium brown\n- **Milk Tea** — soft latte beige\n- **Sakura** — dusty blush pink\n- **Misty Rose** — pale rose cream\n\nYarn dye lots can shift slightly — that's part of the handmade charm. Send a reference photo for custom colour matching.`,
      published: true,
    },
  });

  await prisma.policyPage.upsert({
    where: { slug: "shipping" },
    update: {},
    create: {
      slug: "shipping",
      title: "Shipping policy",
      content: `All pieces are made to order. Lead times are shown on each product.\n\nShipping fees are estimated at checkout (flat rate or pincode band). You'll confirm final shipping on WhatsApp before payment.`,
      published: true,
    },
  });

  await prisma.policyPage.upsert({
    where: { slug: "returns" },
    update: {},
    create: {
      slug: "returns",
      title: "Returns & exchanges",
      content: `Because each piece is handmade for you, returns are limited.\n\n- Custom colour/size pieces are final sale unless defective.\n- If something arrives damaged, message on WhatsApp within 48 hours with photos — I'll make it right.`,
      published: true,
    },
  });

  await prisma.policyPage.upsert({
    where: { slug: "custom-orders" },
    update: {},
    create: {
      slug: "custom-orders",
      title: "Custom order terms",
      content: `Custom requests start with a WhatsApp chat.\n\n- 50% deposit confirms your slot.\n- Timelines depend on current open orders (see capacity on the site).\n- Once stitching begins, design changes may adjust price or lead time.`,
      published: true,
    },
  });

  const existingSample = await prisma.order.findFirst({
    where: { orderNumber: "ORD-1001" },
  });
  if (!existingSample) {
    const bunny = await prisma.product.findUnique({ where: { slug: "amigurumi-bunny" } });
    await prisma.order.create({
      data: {
        orderNumber: "ORD-1001",
        publicToken: "sample-status-token-lol-1001",
        customerName: "Sample Customer",
        customerPhone: "9999999999",
        addressLine: "12 Blossom Lane",
        city: "Bengaluru",
        state: "KA",
        pincode: "560001",
        giftMessage: "For my niece",
        subtotal: 899,
        shippingFee: 49,
        discount: 0,
        total: 948,
        status: "making",
        whatsappText: "Sample order for status page testing",
        items: {
          create: [
            {
              productId: bunny?.id,
              productTitle: "Amigurumi Bunny",
              variantLabel: "Pink / Small",
              qty: 1,
              unitPrice: 899,
              imageUrl: placeholders[0],
            },
          ],
        },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
