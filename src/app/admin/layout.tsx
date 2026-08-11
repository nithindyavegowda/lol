"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/guides", label: "Guides" },
  { href: "/admin/policies", label: "Policies" },
  { href: "/admin/instagram", label: "Instagram" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/admin/login");

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <div className="mx-auto flex max-w-6xl gap-6 p-4 md:p-8">
        <aside className="stitched hidden w-56 shrink-0 rounded-2xl bg-white/45 p-4 md:block h-fit sticky top-6">
          <div className="font-display text-2xl mb-1">LOL</div>
          <p className="text-xs opacity-60 mb-4">Admin</p>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    active ? "bg-[rgba(232,180,184,0.55)] font-semibold" : "hover:bg-white/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="mt-6 text-sm underline opacity-70"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            Sign out
          </button>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap gap-2 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-dashed border-[var(--color-chocolate)] px-3 py-1 text-xs"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
