"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  IconArrowRight,
  IconArrives,
  IconChoose,
  IconCrochetHook,
  IconInstagram,
  IconPacked,
  IconQuality,
} from "@/components/icons";

const PROCESS_STEPS = [
  {
    title: "Choose",
    blurb: "Pick a design — or sketch your own.",
    Icon: IconChoose,
  },
  {
    title: "Crochet",
    blurb: "Every loop made to order by hand.",
    Icon: IconCrochetHook,
  },
  {
    title: "Quality Check",
    blurb: "Stitches inspected before it leaves.",
    Icon: IconQuality,
  },
  {
    title: "Packed",
    blurb: "Wrapped soft, labeled with care.",
    Icon: IconPacked,
  },
  {
    title: "Arrives",
    blurb: "A handmade piece finds your door.",
    Icon: IconArrives,
  },
] as const;

/**
 * PHASE 9 — The LOL Difference / Real People. Real Handmade.
 * Five steps as small illustrative icons — not large cards.
 */
export function LolDifferenceSection() {
  return (
    <section
      className="section-pad"
      id="difference"
      data-sprint="6-difference"
      style={{
        background: "linear-gradient(180deg, var(--cream) 0%, var(--cream-light) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-[var(--lol-pink)] mb-2">
            The LOL Difference
          </p>
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight">
            Real People.
            <br />
            Real Handmade.
          </h2>
          <p className="mt-4 text-[var(--brown)] text-base sm:text-lg">
            No warehouse shelves. No mass runs. Just one maker, one hook, and a path from your
            choice to your hands.
          </p>
        </div>

        <ol className="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-8 sm:gap-6">
          {PROCESS_STEPS.map(({ title, blurb, Icon }, i) => (
            <li key={title} className="relative text-center px-1">
              {i < PROCESS_STEPS.length - 1 ? (
                <span
                  className="pointer-events-none absolute top-5 left-[calc(50%+1.4rem)] hidden sm:block w-[calc(100%-1.2rem)] h-px bg-[rgba(139,103,85,0.28)]"
                  aria-hidden
                />
              ) : null}
              <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--cream-light)] border border-[rgba(48,35,31,0.08)] text-[var(--espresso)] shadow-[var(--shadow-soft)]">
                <Icon size={20} />
              </div>
              <p className="font-display text-lg leading-tight">{title}</p>
              <p className="mt-1.5 text-xs sm:text-sm text-[var(--brown)] leading-snug max-w-[11rem] mx-auto">
                {blurb}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const CUSTOM_CHOICES = [
  { id: "toy", label: "Soft toy" },
  { id: "bag", label: "Bag" },
  { id: "wearable", label: "Wearable" },
  { id: "decor", label: "Wall decor" },
  { id: "other", label: "Something else" },
] as const;

/**
 * PHASE 10 — You imagine it. We crochet it.
 * Large tactile Custom Order CTA with choice interaction.
 */
export function CustomOrderCtaSection() {
  const [picked, setPicked] = useState<string>("toy");

  return (
    <section className="section-pad" id="custom-cta" data-sprint="6-custom">
      <div
        className="max-w-6xl mx-auto relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] px-6 py-14 sm:px-12 sm:py-20 text-[var(--cream)]"
        style={{
          background:
            "radial-gradient(120% 90% at 10% 0%, rgba(233,143,152,0.22) 0%, transparent 50%), #30231f",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light"
          style={{
            backgroundImage: "url(/assets/textures/yarn-texture-sm.webp)",
            backgroundSize: "280px",
          }}
          aria-hidden
        />

        <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--pink-light)] mb-3">
              Custom crochet
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              You imagine it.
              <br />
              We crochet it.
            </h2>
            <p className="mt-5 text-[var(--pink-light)] text-lg max-w-md leading-relaxed">
              Colours, size, references — tell us the story. We&apos;ll turn it into loops you can
              hold.
            </p>

            <p className="mt-8 mb-3 text-sm font-semibold tracking-wide uppercase opacity-80">
              What are you dreaming up?
            </p>
            <div className="flex flex-wrap gap-2.5" role="group" aria-label="Custom piece type">
              {CUSTOM_CHOICES.map((c) => {
                const on = picked === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPicked(c.id)}
                    className="custom-choice-chip px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border"
                    style={{
                      background: on ? "var(--lol-pink)" : "rgba(255,249,245,0.06)",
                      borderColor: on ? "var(--lol-pink)" : "rgba(248,241,235,0.22)",
                      color: on ? "var(--espresso)" : "var(--cream)",
                      transform: on ? "translateY(-2px) scale(1.02)" : undefined,
                      boxShadow: on ? "0 10px 24px rgba(233,143,152,0.35)" : undefined,
                    }}
                    aria-pressed={on}
                    aria-label={`Choose ${c.label} for custom order`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <Link
              href={`/custom?type=${encodeURIComponent(picked)}`}
              className="btn-primary mt-9 inline-flex"
            >
              Start Custom Order <IconArrowRight size={18} />
            </Link>
          </div>

          <div className="relative">
            <div
              className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-[2px]"
              style={{
                boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              }}
            >
              <p className="annotation text-2xl text-[var(--pink-light)] mb-4">Your brief</p>
              <ul className="space-y-4 text-sm sm:text-base">
                {[
                  "Product type & size",
                  "Colour palette",
                  "Reference photos",
                  "Quantity & notes",
                ].map((item, idx) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ transitionDelay: `${idx * 40}ms` }}
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--lol-pink)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs tracking-wide uppercase opacity-70">
                Selected: {CUSTOM_CHOICES.find((c) => c.id === picked)?.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const IG_PHOTOS = [
  { src: "/assets/products/star-sling-bag.webp", alt: "Star Hero crochet sling" },
  { src: "/assets/products/octopus-stack.webp", alt: "Pastel octopus stack" },
  { src: "/assets/products/mint-frog.webp", alt: "Mint froggie buddy" },
  { src: "/assets/products/honey-bee.webp", alt: "Honeybee amigurumi" },
  { src: "/assets/products/jellyfish-trio.webp", alt: "Soft tide jellyfish trio" },
  { src: "/assets/products/rainbow-throw.webp", alt: "Rainbow granny baby throw" },
] as const;

/**
 * PHASE 12 — Instagram-style social proof gallery (real product photos)
 */
export function InstagramGallerySection() {
  return (
    <section
      className="section-pad bg-[var(--cream-light)]"
      id="irl"
      data-sprint="6-instagram"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-[var(--lol-pink)] mb-2">
              LOL IRL
            </p>
            <h2 className="font-display text-3xl sm:text-5xl tracking-tight">
              Real LOL pieces in real homes.
            </h2>
            <p className="mt-3 text-[var(--brown)] max-w-lg">
              Soft proof from pieces that left the hook — real yarn, real colour, real joy.
            </p>
          </div>
          <Link href="/instagram" className="btn-secondary self-start inline-flex items-center gap-2">
            <IconInstagram size={18} /> View gallery
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {IG_PHOTOS.map((item, i) => (
            <figure
              key={item.src + i}
              className="relative overflow-hidden rounded-2xl bg-[rgba(139,103,85,0.06)] aspect-square"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width:768px) 50vw, 33vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-[rgba(48,35,31,0.55)] to-transparent">
                <span className="text-[0.65rem] sm:text-xs font-semibold tracking-wide uppercase text-[var(--cream)]">
                  Real LOL pieces in real homes.
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * PHASE 13 — Dark chocolate final CTA before footer
 */
export function FinalCtaSection() {
  return (
    <section className="px-4 sm:px-6 pb-4" data-sprint="6-final-cta">
      <div
        className="max-w-6xl mx-auto relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 sm:py-16 text-center text-[var(--cream)]"
        style={{ background: "#30231f" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "url(/assets/textures/yarn-texture-sm.webp)",
            backgroundSize: "240px",
            mixBlendMode: "overlay",
          }}
          aria-hidden
        />
        <div className="relative">
          <p className="annotation text-2xl sm:text-3xl text-[var(--pink-light)] mb-3">
            Ready when you are
          </p>
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight max-w-xl mx-auto">
            Bring a little handmade happiness home.
          </h2>
          <p className="mt-4 text-[var(--pink-light)] max-w-md mx-auto">
            Browse what&apos;s on the hook — or start a custom piece that only exists because you
            asked.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-primary">
              Shop handmade <IconArrowRight size={16} />
            </Link>
            <Link
              href="/custom"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold border border-[rgba(248,241,235,0.28)] hover:bg-white/10 transition-colors"
            >
              Custom order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
