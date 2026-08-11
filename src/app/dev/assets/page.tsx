import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

function listFiles(dir: string, prefix = ""): { rel: string; abs: string }[] {
  const full = path.join(process.cwd(), "public", dir);
  if (!fs.existsSync(full)) return [];
  const out: { rel: string; abs: string }[] = [];
  for (const name of fs.readdirSync(full)) {
    const abs = path.join(full, name);
    const rel = `${prefix}/${name}`.replace(/\\/g, "/");
    if (fs.statSync(abs).isDirectory()) {
      out.push(...listFiles(path.join(dir, name), rel));
    } else {
      out.push({ rel: `/assets${rel}`.replace("/assets/assets", "/assets"), abs });
    }
  }
  return out;
}

export default function DevAssetsPage() {
  const root = path.join(process.cwd(), "public", "assets");
  const groups = fs.existsSync(root)
    ? fs.readdirSync(root).filter((n) => fs.statSync(path.join(root, n)).isDirectory())
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm font-semibold text-[var(--brown)]">
        ← Back to LOL
      </Link>
      <h1 className="font-display text-4xl mt-4 mb-2">Asset preview</h1>
      <p className="text-[var(--brown)] mb-8 text-sm">
        Internal page — inspect generated / organized assets. See also{" "}
        <code>docs/ASSET-MANIFEST.md</code>.
      </p>

      {groups.map((group) => {
        const files = listFiles(path.join("assets", group), `/${group}`);
        return (
          <section key={group} className="mb-10">
            <h2 className="font-display text-2xl mb-4 capitalize">{group}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {files.map((f) => {
                const url = f.rel.startsWith("/assets")
                  ? f.rel
                  : `/assets/${group}/${path.basename(f.abs)}`;
                const isImg = /\.(svg|png|jpe?g|webp|gif)$/i.test(f.abs);
                return (
                  <div
                    key={url}
                    className="rounded-xl border border-[rgba(48,35,31,0.08)] bg-[var(--cream-light)] p-3"
                  >
                    <div className="aspect-square relative mb-2 bg-white/50 rounded-lg overflow-hidden flex items-center justify-center">
                      {isImg ? (
                        <Image src={url} alt={url} fill unoptimized className="object-contain p-2" />
                      ) : (
                        <span className="text-xs opacity-60 px-2 text-center">{path.basename(f.abs)}</span>
                      )}
                    </div>
                    <p className="text-[0.65rem] break-all opacity-70">{url}</p>
                  </div>
                );
              })}
              {files.length === 0 ? (
                <p className="text-sm text-[var(--brown)] col-span-full">Empty or README only.</p>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
