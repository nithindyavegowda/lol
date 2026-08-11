import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 22, className, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
    ...rest,
  };
}

export function IconSearch(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5 21 21" />
    </svg>
  );
}

export function IconHeart(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

export function IconCart(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h2.2l1.8 10h9.5l2-7H8" />
      <circle cx="10" cy="19" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconMenu(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 7h16M4 12h16M4 17h12" />
    </svg>
  );
}

export function IconClose(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconArrowRight(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconHandmade(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

export function IconCustom(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4v4M12 16v4" />
      <path d="M8 8c2 2 6 2 8 0" />
      <path d="M7 14c3 3 7 3 10 0" />
    </svg>
  );
}

export function IconPremium(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3l2.2 6.5H21l-5.2 3.8 2 6.7L12 16.8 6.2 20l2-6.7L3 9.5h6.8L12 3Z" />
    </svg>
  );
}

export function IconShipping(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}

export function IconSecure(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconPackage(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 8l9-4 9 4v9l-9 4-9-4V8Z" />
      <path d="M12 12v9M3 8l9 4 9-4" />
    </svg>
  );
}

/** PHASE 9 — Choose */
export function IconChoose(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="10" cy="10" r="5.5" />
      <path d="M14.5 14.5 20 20" />
      <path d="M8 10h4M10 8v4" />
    </svg>
  );
}

/** PHASE 9 — Crochet */
export function IconCrochetHook(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 18c2-2 4-4 6-4s3 1.5 5 3" />
      <path d="M15 17c1.5 1.5 3 2.5 5 2" />
      <path d="M7 8c1.5-2 4-3 6-1.5" />
      <circle cx="7" cy="8" r="1.4" />
    </svg>
  );
}

/** PHASE 9 — Quality Check */
export function IconQuality(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="7" />
      <path d="M8.5 12.2 11 14.7 15.5 9.5" />
    </svg>
  );
}

/** PHASE 9 — Packed */
export function IconPacked(p: IconProps) {
  return <IconPackage {...p} />;
}

/** PHASE 9 — Arrives */
export function IconArrives(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M7 10.5V19h10v-8.5" />
      <path d="M10 19v-5h4v5" />
    </svg>
  );
}

export function IconWhatsApp(p: IconProps) {
  return (
    <svg {...base({ ...p, strokeWidth: 0 })} fill="currentColor">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Zm4.2 11.1c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.2.2-.5.7-.6.8-.1.1-.2.2-.4.1s-.8-.3-1.5-.9c-.6-.5-1-1.1-1.1-1.3-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.4 0-.1 0-.3-.1-.4-.1-.1-.5-1.1-.6-1.5-.2-.4-.3-.3-.5-.3h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 2.3.9 2.3.6 2.7.6.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.2-.2-.4-.2Z" />
    </svg>
  );
}

export function IconInstagram(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Back-compat aliases used by older components */
export function LoopIcon({ className }: { className?: string }) {
  return <IconHeart className={className} />;
}
export function YarnBallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 10c3 1 6 1 9-1M7 14c3 .8 6 .8 9-1M15 6.5c1 3 1 6-1 9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
export function CartLoopIcon({ className }: { className?: string }) {
  return <IconCart className={className} />;
}
export function WhatsAppIcon({ className }: { className?: string }) {
  return <IconWhatsApp className={className} />;
}
export function YarnDivider() {
  return <hr className="yarn-divider" aria-hidden />;
}
