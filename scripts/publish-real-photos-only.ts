import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Keep published only products that use real /assets/products photos */
async function main() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  let kept = 0;
  let archived = 0;

  for (const p of products) {
    const hasReal = p.images.some(
      (img) =>
        img.url.startsWith("/assets/products/") &&
        !img.url.includes("placeholder") &&
        !img.url.endsWith(".svg")
    );

    if (hasReal) {
      await prisma.product.update({
        where: { id: p.id },
        data: { status: "published", featured: true },
      });
      kept++;
      console.log("KEEP", p.slug, p.images[0]?.url);
    } else {
      await prisma.product.update({
        where: { id: p.id },
        data: { status: "draft", featured: false },
      });
      archived++;
      console.log("DRAFT", p.slug, p.images[0]?.url || "(no image)");
    }
  }

  console.log(JSON.stringify({ kept, archived }));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
