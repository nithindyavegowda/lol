import type { Metadata } from "next";
import { Caveat, Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { ChromeGate } from "@/components/chrome-gate";
import { Providers } from "@/components/providers";

export const dynamic = "force-dynamic";

/** Editorial serif — headlines / brand */
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
});

/** Modern sans — UI, nav, body, prices */
const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

/** Handwritten accent — microcopy / annotations only */
const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:1234"
  ),
  title: {
    default: "LOL — Loops of Love",
    template: "%s · LOL",
  },
  description: "Made by me, made for you — handmade crochet, made to order.",
  applicationName: "LOL — Loops of Love",
  keywords: [
    "handmade crochet",
    "made to order",
    "amigurumi",
    "custom crochet",
    "Loops of Love",
    "LOL",
  ],
  icons: {
    icon: "/assets/brand/LOL-favicon.svg",
  },
  openGraph: {
    title: "LOL — Loops of Love",
    description: "Made by me, made for you — handmade crochet, made to order.",
    siteName: "LOL — Loops of Love",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/assets/hero/hero-fallback.webp",
        width: 1200,
        height: 630,
        alt: "LOL — Loops of Love handmade crochet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOL — Loops of Love",
    description: "Made by me, made for you — handmade crochet, made to order.",
    images: ["/assets/hero/hero-fallback.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let announcement = "";
  let paused = false;
  let whatsapp =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918884558657";

  if (hasDatabaseUrl()) {
    try {
      const settings = await prisma.shopSettings.findUnique({
        where: { id: "default" },
      });
      announcement = settings?.announcement || "";
      paused = !!settings?.paused;
      if (settings?.whatsappNumber) whatsapp = settings.whatsappNumber;
    } catch {
      // Build/runtime without reachable DB — fall back to env defaults
    }
  }

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body
        className="antialiased"
        style={
          {
            "--font-display": "var(--font-display-loaded), Georgia, serif",
            "--font-body": "var(--font-body-loaded), 'Segoe UI', sans-serif",
            "--font-hand": "var(--font-hand-loaded), 'Segoe Print', cursive",
          } as React.CSSProperties
        }
        data-sprint="1-foundation"
      >
        <Providers>
          <ChromeGate
            announcement={announcement}
            paused={paused}
            whatsapp={whatsapp}
          >
            {children}
          </ChromeGate>
        </Providers>
      </body>
    </html>
  );
}
