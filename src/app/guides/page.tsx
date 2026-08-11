import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { YarnDivider } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function GuidesIndexPage() {
  const guides = await prisma.guidePage.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Guides</h1>
      <p className="opacity-75 mt-2 mb-4">Size, colour, and care notes for LOL pieces.</p>
      <YarnDivider />
      <ul className="space-y-3">
        {guides.map((g) => (
          <li key={g.id}>
            <Link
              href={`/guides/${g.slug}`}
              className="stitched rounded-2xl px-4 py-3 bg-[rgba(255,255,255,0.4)] block hover:translate-y-[-2px] transition-transform"
            >
              <span className="font-display text-xl">{g.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      {guides.length === 0 ? <p className="opacity-70">Guides coming soon.</p> : null}
    </div>
  );
}
