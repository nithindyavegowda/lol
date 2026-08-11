export { CollectionsSection } from "./CollectionsSection";
export {
  CustomOrderCtaSection as CustomOrderSection,
  FinalCtaSection,
  InstagramGallerySection,
  LolDifferenceSection,
} from "./BrandStorySections";
export { ProductShowcase } from "./ProductShowcase";

import Link from "next/link";
import {
  IconCustom,
  IconHandmade,
  IconPackage,
  IconPremium,
  IconSecure,
  IconShipping,
} from "@/components/icons";
import { formatInr } from "@/lib/utils";

/** Kept for older references — prefer LolDifferenceSection on the homepage. */
export function HowItWorksSection() {
  const steps = [
    { n: "01", t: "Pick a piece", d: "Browse handmade designs or start a custom request." },
    { n: "02", t: "We crochet", d: "Every loop is made to order — no warehouse shortcuts." },
    { n: "03", t: "Ship with love", d: "Confirm on WhatsApp, then your piece finds its way home." },
  ];
  return (
    <section className="section-pad max-w-6xl mx-auto">
      <h2 className="font-display text-3xl sm:text-5xl tracking-tight mb-10">How LOL works</h2>
      <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((s) => (
          <div key={s.n} className="relative">
            <p className="text-[var(--lol-pink)] font-semibold tracking-[0.2em] text-xs mb-2">{s.n}</p>
            <h3 className="font-display text-2xl mb-2">{s.t}</h3>
            <p className="text-[var(--brown)] leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WhyLolSection() {
  const items = [
    { icon: IconHandmade, label: "100% Handmade" },
    { icon: IconCustom, label: "Custom Made" },
    { icon: IconPremium, label: "Premium Quality" },
    { icon: IconPackage, label: "Made to Order" },
    { icon: IconSecure, label: "Safe & Secure" },
    { icon: IconShipping, label: "Careful Shipping" },
  ];
  return (
    <section className="section-pad max-w-6xl mx-auto">
      <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-8 text-center">Why LOL</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="text-center rounded-2xl bg-[var(--cream-light)] border border-[rgba(48,35,31,0.06)] px-3 py-6"
          >
            <Icon className="mx-auto mb-3 text-[var(--brown)]" size={26} />
            <p className="text-sm font-semibold leading-snug">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SocialProofSection({
  testimonials,
}: {
  testimonials: { id: string; quote: string; name: string }[];
}) {
  if (!testimonials.length) return null;
  return (
    <section className="section-pad pt-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-6">Kind words</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="rounded-[1.25rem] bg-[var(--cream-light)] border border-[rgba(48,35,31,0.06)] p-5 shadow-[var(--shadow-soft)]"
            >
              <p className="leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm font-semibold text-[var(--brown)]">— {t.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedPriceRow({
  title,
  price,
  compareAt,
}: {
  title: string;
  price: number;
  compareAt?: number | null;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-semibold">{formatInr(price)}</span>
      {compareAt && compareAt > price ? (
        <span className="text-sm line-through opacity-50">{formatInr(compareAt)}</span>
      ) : null}
      <span className="sr-only">{title}</span>
    </div>
  );
}
