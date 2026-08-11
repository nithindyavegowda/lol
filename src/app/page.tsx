import type { Metadata } from "next";
import { Hero } from "@/components/hero/HeroSection";
import {
  CollectionsSection,
  CustomOrderSection,
  FinalCtaSection,
  InstagramGallerySection,
  LolDifferenceSection,
  ProductShowcase,
  SocialProofSection,
} from "@/components/home/HomeSections";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Handmade Crochet Made to Order",
  description:
    "LOL — Loops of Love. Handmade crochet toys, bags, wearables and custom pieces. Made by me, made for you.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "LOL — Loops of Love | Handmade Crochet",
    description:
      "Small loops. Big magic. Browse made-to-order crochet or start a custom piece.",
    url: "/",
    type: "website",
    siteName: "LOL — Loops of Love",
    images: [
      {
        url: "/assets/hero/hero-fallback.webp",
        width: 1200,
        height: 630,
        alt: "Handmade crochet character from LOL — Loops of Love",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOL — Loops of Love | Handmade Crochet",
    description: "Made by me, made for you — handmade crochet, made to order.",
    images: ["/assets/hero/hero-fallback.webp"],
  },
};

export default async function HomePage() {
  const [featured, testimonials] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "published",
        images: { some: { url: { startsWith: "/assets/products/" } } },
      },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 2 } },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      take: 12,
    }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);

  return (
    <div className="pb-2">
      {/* Compact hero (~70vh) so products peek above the fold */}
      <Hero />
      <ProductShowcase
        products={featured.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          image: p.images[0]?.url,
          imageHover: p.images[1]?.url || p.images[0]?.url,
          category: p.category,
          leadTimeDays: p.leadTimeDays,
        }))}
      />
      <CollectionsSection />
      <LolDifferenceSection />
      <CustomOrderSection />
      <InstagramGallerySection />
      <SocialProofSection testimonials={testimonials} />
      <FinalCtaSection />
    </div>
  );
}
