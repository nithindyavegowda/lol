/**
 * Upsert the 8 photo-based products into the DB without wiping everything.
 * Run: npx tsx scripts/seed-photo-products.ts
 */
import { prisma } from "./_prisma";

const catalog = [
  {
    title: "Star Hero Crochet Sling",
    slug: "midnight-star-sling",
    subtitle: "Five-point crochet star bag — everyday hero energy",
    description:
      "A handmade star-shaped sling in deep navy with soft grey and cream rings. Room enough for phone, keys, and a little magic.",
    category: "Heroes",
    tags: ["bag", "star", "sling", "hero"],
    price: 1499,
    compareAtPrice: 1799,
    featured: true,
    image: "/assets/products/star-sling-bag.webp",
    colors: ["Navy", "Cream"],
  },
  {
    title: "Pastel Octopus Stack",
    slug: "pastel-octopus-stack",
    subtitle: "Four tiny amigurumi friends, one cheerful tower",
    description:
      "Pink, lavender, mint, and sky-blue octopuses stacked for play or shelf display. Soft cotton yarn, embroidered smiles.",
    category: "Toys",
    tags: ["octopus", "amigurumi", "set"],
    price: 1299,
    compareAtPrice: 1499,
    featured: true,
    image: "/assets/products/octopus-stack.webp",
    colors: ["Pink", "Lavender", "Mint", "Blue"],
  },
  {
    title: "Mint Froggie Buddy",
    slug: "mint-froggie-buddy",
    subtitle: "Aqua amigurumi frog with a soft blush smile",
    description:
      "A palm-sized turquoise frog with bead eyes and outstretched arms — ready to sit on a desk or nestle in a gift box.",
    category: "Toys",
    tags: ["frog", "amigurumi"],
    price: 999,
    compareAtPrice: 1199,
    featured: true,
    image: "/assets/products/mint-frog.webp",
    colors: ["Mint", "Aqua"],
  },
  {
    title: "Honeybee Amigurumi",
    slug: "honeybee-amigurumi",
    subtitle: "Striped bee plush with soft white wings",
    description:
      "A cheerful handmade bee in warm yellow and black, with tiny crochet wings. Studio-styled for gift-ready charm.",
    category: "Toys",
    tags: ["bee", "amigurumi"],
    price: 899,
    compareAtPrice: 1099,
    featured: true,
    image: "/assets/products/honey-bee.webp",
    colors: ["Yellow", "Black"],
  },
  {
    title: "Pocket Doll Friends",
    slug: "pocket-doll-friends",
    subtitle: "Pastel amigurumi dolls with oversized charm",
    description:
      "A collection of tiny hooded dolls in soft purples and pinks — handmade companions for shelves, pockets, and play.",
    category: "Toys",
    tags: ["dolls", "amigurumi", "set"],
    price: 1599,
    compareAtPrice: 1899,
    featured: true,
    image: "/assets/products/pocket-dolls.webp",
    colors: ["Lavender", "Pink", "Cream"],
  },
  {
    title: "Soft Tide Jellyfish Trio",
    slug: "soft-tide-jellyfish-trio",
    subtitle: "Three pastel jellyfish charms with yarn tentacles",
    description:
      "Coral, peach, and cream jellyfish with dangling strands. Sold as a trio — sweet as desk toys or bag charms.",
    category: "Accessories",
    tags: ["jellyfish", "charm", "trio"],
    price: 1199,
    compareAtPrice: 1399,
    featured: true,
    image: "/assets/products/jellyfish-trio.webp",
    colors: ["Coral", "Peach", "Cream"],
  },
  {
    title: "Rainbow Granny Baby Throw",
    slug: "rainbow-granny-baby-throw",
    subtitle: "Flower-motif granny squares in joyful colour",
    description:
      "A soft cream throw covered in vibrant granny flower squares. Made to order for nurseries, naps, and slow Sundays.",
    category: "Home",
    tags: ["blanket", "granny", "baby"],
    price: 3499,
    compareAtPrice: 3999,
    featured: true,
    image: "/assets/products/rainbow-throw.webp",
    colors: ["Multi", "Cream"],
  },
  {
    title: "Blush Petal Motif Square",
    slug: "blush-petal-motif-square",
    subtitle: "Peach-bordered floral granny square / coaster",
    description:
      "A single handmade motif in mustard, dusty pink, and sage with a peach border — use as a coaster, patch, or decor swatch.",
    category: "Accessories",
    tags: ["coaster", "motif", "granny"],
    price: 399,
    compareAtPrice: 499,
    featured: true,
    image: "/assets/products/petal-motif.webp",
    colors: ["Peach", "Pink", "Sage"],
  },
];

async function main() {
  for (const p of catalog) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        category: p.category,
        tags: JSON.stringify(p.tags),
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        featured: p.featured,
        status: "published",
        leadTimeDays: 12,
        maxQty: 2,
      },
      create: {
        title: p.title,
        slug: p.slug,
        subtitle: p.subtitle,
        description: p.description,
        category: p.category,
        tags: JSON.stringify(p.tags),
        bullets: JSON.stringify(["100% handmade", "Made to order", "Gift-ready wrap"]),
        materials: JSON.stringify({ fiber: "Soft acrylic / cotton blend" }),
        care: "Spot clean or gentle hand wash. Air dry flat.",
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        featured: p.featured,
        status: "published",
        leadTimeDays: 12,
        maxQty: 2,
      },
    });

    const existingImg = await prisma.productImage.findFirst({
      where: { productId: product.id },
      orderBy: { sortOrder: "asc" },
    });
    if (existingImg) {
      await prisma.productImage.update({
        where: { id: existingImg.id },
        data: { url: p.image, alt: p.title },
      });
    } else {
      await prisma.productImage.create({
        data: { productId: product.id, url: p.image, alt: p.title, sortOrder: 0 },
      });
    }

    // Ensure at least one variant
    const vCount = await prisma.productVariant.count({ where: { productId: product.id } });
    if (vCount === 0) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          color: p.colors[0] || "",
          size: "One size",
        },
      });
    }

    console.log("upserted", p.slug);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
