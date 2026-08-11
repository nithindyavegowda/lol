import { prisma } from "@/lib/prisma";
import { YarnBallIcon, YarnDivider } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await prisma.shopSettings.findUnique({ where: { id: "default" } });
  const content =
    settings?.aboutContent ||
    "Hi — I'm the maker behind LOL (Loops of Love). Every piece is crocheted to order.";

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <YarnBallIcon className="w-8 h-8 mb-3 opacity-80" />
      <h1 className="font-display text-4xl">About</h1>
      <p className="mt-2 opacity-75 italic font-display text-lg">Made by me, made for you</p>
      <YarnDivider />
      <div className="whitespace-pre-wrap leading-relaxed text-base opacity-95">{content}</div>
    </div>
  );
}
