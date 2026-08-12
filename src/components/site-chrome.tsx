"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useCart } from "@/lib/cart";
import {
  IconCart,
  IconClose,
  IconHeart,
  IconMenu,
  IconSearch,
  IconWhatsApp,
} from "./icons";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom Order" },
  { href: "/about", label: "Our Story" },
  { href: "/guides", label: "FAQs" },
];

export function FloatingNav({ whatsapp }: { whatsapp: string }) {
  const { count } = useCart();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const sheetId = useId();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`lol-nav px-4 sm:px-5 ${compact ? "is-compact py-2" : "py-3"}`}
        data-sprint="1-navbar"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Mobile: text LOL · Desktop: LOL wordmark + subtle subtitle optional */}
          <Link href="/" className="shrink-0 lol-wordmark" aria-label="LOL home">
            LOL
          </Link>

          <nav
            className="hidden lg:flex items-center gap-7 text-[0.92rem] font-semibold tracking-wide"
            aria-label="Primary"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="opacity-75 hover:opacity-100 transition-colors hover:text-[var(--lol-pink)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link
              href="/shop"
              className="hidden sm:inline-flex p-2.5 rounded-full hover:bg-[var(--pink-soft)] transition-colors"
              aria-label="Search products"
            >
              <IconSearch />
            </Link>
            <Link
              href="/wishlist"
              className="hidden md:inline-flex p-2.5 rounded-full hover:bg-[var(--pink-soft)] transition-colors"
              aria-label="Wishlist"
            >
              <IconHeart />
            </Link>
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full hover:bg-[var(--pink-soft)] transition-colors"
              aria-label={`Cart, ${count} items`}
            >
              <IconCart />
              {count > 0 ? (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[var(--lol-pink)] text-[10px] font-bold flex items-center justify-center text-[var(--espresso)]">
                  {count}
                </span>
              ) : null}
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex p-2.5 rounded-full hover:bg-[var(--pink-soft)] transition-colors"
              aria-label="WhatsApp"
            >
              <IconWhatsApp />
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden p-2.5 rounded-full hover:bg-[var(--pink-soft)]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={sheetId}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        id={sheetId}
        className={`lol-mobile-sheet lg:hidden ${open ? "is-open" : "pointer-events-none"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!open}
        // Keep closed sheet out of tab order (Lighthouse aria-hidden-focus)
        {...(!open ? ({ inert: true } as React.HTMLAttributes<HTMLDivElement>) : {})}
      >
        <div className="flex items-center justify-between mb-10">
          <span className="lol-wordmark text-2xl">LOL</span>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-[var(--pink-soft)]"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <IconClose />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl sm:text-5xl py-2 tracking-tight border-b border-[rgba(48,35,31,0.06)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/wishlist"
            onClick={() => setOpen(false)}
            className="font-display text-4xl sm:text-5xl py-2 tracking-tight border-b border-[rgba(48,35,31,0.06)]"
          >
            Wishlist
          </Link>
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="font-display text-4xl sm:text-5xl py-2 tracking-tight border-b border-[rgba(48,35,31,0.06)]"
          >
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
          <Link
            href="/order/sample-status-token-lol-1001"
            onClick={() => setOpen(false)}
            className="font-display text-4xl sm:text-5xl py-2 tracking-tight"
          >
            Track Order
          </Link>
        </nav>

        <p className="annotation mt-8 text-xl">Made slowly. Loved loudly.</p>
      </div>
    </>
  );
}

export function AnnouncementBar({
  text,
  paused,
}: {
  text: string;
  paused?: boolean;
}) {
  if (!text && !paused) return null;
  return (
    <div
      className="text-center text-xs sm:text-sm px-3 py-2 tracking-wide font-ui"
      style={{
        background: paused ? "var(--espresso)" : "var(--cream-light)",
        color: paused ? "var(--cream)" : "var(--brown)",
        borderBottom: paused ? undefined : "1px solid rgba(48,35,31,0.06)",
      }}
      role="status"
    >
      {paused ? "Shop paused — not accepting new orders. " : null}
      {text}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer
      className="mt-2 relative overflow-hidden text-[var(--cream)]"
      data-sprint="6-footer"
      style={{ background: "#30231f" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "url(/assets/textures/yarn-texture-sm.webp)",
          backgroundSize: "220px",
          mixBlendMode: "overlay",
        }}
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto px-5 py-14 grid sm:grid-cols-3 gap-10">
        <div>
          <p className="lol-wordmark text-[var(--cream)] text-3xl mb-2">LOL</p>
          <p className="annotation text-[var(--pink-light)] text-xl">Made slowly. Loved loudly.</p>
          <p className="mt-4 text-sm opacity-80 max-w-xs">
            Loops of Love — handmade crochet, made to order, shipped with care.
          </p>
        </div>
        <div className="text-sm space-y-3 opacity-90 font-ui">
          <p className="text-xs tracking-[0.16em] uppercase opacity-60 mb-1">Explore</p>
          <Link className="block hover:text-[var(--lol-pink)]" href="/shop">
            Shop
          </Link>
          <Link className="block hover:text-[var(--lol-pink)]" href="/custom">
            Custom Order
          </Link>
          <Link className="block hover:text-[var(--lol-pink)]" href="/about">
            Our Story
          </Link>
          <Link className="block hover:text-[var(--lol-pink)]" href="/guides">
            FAQs
          </Link>
        </div>
        <div className="text-sm space-y-3 opacity-90 font-ui">
          <p className="text-xs tracking-[0.16em] uppercase opacity-60 mb-1">Help</p>
          <Link className="block hover:text-[var(--lol-pink)]" href="/policies/shipping">
            Shipping
          </Link>
          <Link className="block hover:text-[var(--lol-pink)]" href="/policies/returns">
            Returns
          </Link>
          <Link className="block hover:text-[var(--lol-pink)]" href="/instagram">
            Instagram
          </Link>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <p className="max-w-6xl mx-auto px-5 py-4 text-xs opacity-60">
          © {new Date().getFullYear()} LOL — Loops of Love. Made by me, made for you.
        </p>
      </div>
    </footer>
  );
}

export function StickyWhatsApp({ phone }: { phone: string }) {
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 wa-pulse btn-primary !rounded-full !p-3.5"
      aria-label="Chat on WhatsApp"
    >
      <IconWhatsApp size={24} />
    </a>
  );
}

/** @deprecated use FloatingNav */
export function SiteHeader({ whatsapp }: { whatsapp: string }) {
  return <FloatingNav whatsapp={whatsapp} />;
}
