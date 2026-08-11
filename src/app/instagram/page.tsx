import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { YarnDivider } from "@/components/icons";

export const dynamic = "force-dynamic";

type IgLink = {
  url: string;
  caption?: string;
  thumb?: string;
};

export default async function InstagramPage() {
  const settings = await prisma.shopSettings.findUnique({ where: { id: "default" } });
  const links = parseJson<IgLink[]>(settings?.instagramLinks, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Instagram</h1>
      <p className="opacity-75 mt-2 mb-4">Curated peeks from the LOL feed.</p>
      <YarnDivider />

      {links.length === 0 ? (
        <p className="opacity-70">Gallery links will appear here soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {links.map((item, idx) => (
            <a
              key={`${item.url}-${idx}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group stitched rounded-2xl overflow-hidden bg-[rgba(255,255,255,0.35)] block"
            >
              <div className="relative aspect-square bg-[rgba(170,127,102,0.15)]">
                <Image
                  src={item.thumb || "/placeholders/flower.svg"}
                  alt={item.caption || "Instagram post"}
                  fill
                  unoptimized={(item.thumb || "").endsWith(".svg") || !item.thumb}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, 33vw"
                />
              </div>
              {item.caption ? (
                <p className="p-3 text-sm font-medium">{item.caption}</p>
              ) : null}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
