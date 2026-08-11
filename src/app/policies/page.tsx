import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { YarnDivider } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function PoliciesIndexPage() {
  const policies = await prisma.policyPage.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Policies</h1>
      <p className="opacity-75 mt-2 mb-4">Shipping, returns, and custom order terms.</p>
      <YarnDivider />
      <ul className="space-y-3">
        {policies.map((p) => (
          <li key={p.id}>
            <Link
              href={`/policies/${p.slug}`}
              className="stitched rounded-2xl px-4 py-3 bg-[rgba(255,255,255,0.4)] block hover:translate-y-[-2px] transition-transform"
            >
              <span className="font-display text-xl">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      {policies.length === 0 ? <p className="opacity-70">Policies coming soon.</p> : null}
    </div>
  );
}
