"use client";

import { usePathname } from "next/navigation";
import {
  AnnouncementBar,
  FloatingNav,
  SiteFooter,
  StickyWhatsApp,
} from "./site-chrome";

export function ChromeGate({
  children,
  announcement,
  paused,
  whatsapp,
}: {
  children: React.ReactNode;
  announcement: string;
  paused: boolean;
  whatsapp: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isDev = pathname.startsWith("/dev");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar text={announcement} paused={paused} />
      <FloatingNav whatsapp={whatsapp} />
      <main className="min-h-[70vh]">{children}</main>
      {!isDev ? <SiteFooter /> : null}
      <StickyWhatsApp phone={whatsapp} />
    </>
  );
}
