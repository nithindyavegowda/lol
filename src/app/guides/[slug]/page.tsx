import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { YarnDivider } from "@/components/icons";

export const dynamic = "force-dynamic";

function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display text-2xl mt-6 mb-2">
          {line.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (line.startsWith("- ")) {
      const inner = line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <li
          key={i}
          className="ml-4 list-disc"
          dangerouslySetInnerHTML={{ __html: inner }}
        />
      );
    }
    if (!line.trim()) return <br key={i} />;
    const inner = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: inner }} />;
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await prisma.guidePage.findFirst({
    where: { slug, published: true },
  });
  if (!guide) notFound();

  return (
    <article className="max-w-2xl mx-auto px-4 py-10">
      <p className="text-sm mb-2">
        <Link href="/guides" className="underline underline-offset-4 opacity-80">
          All guides
        </Link>
      </p>
      <h1 className="font-display text-4xl">{guide.title}</h1>
      <YarnDivider />
      <div className="leading-relaxed opacity-95">{renderContent(guide.content)}</div>
    </article>
  );
}
