import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  new: "Received",
  confirmed: "Confirmed",
  making: "Making",
  shipped: "Shipped",
  done: "Done",
  cancelled: "Cancelled",
};

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await prisma.order.findUnique({
    where: { publicToken: token },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <p className="text-xs uppercase tracking-wide opacity-70">Order status</p>
      <h1 className="font-display text-4xl mt-1">{order.orderNumber}</h1>
      <p className="mt-3 inline-flex items-center gap-2">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--color-sakura)]">
          {STATUS_LABEL[order.status] || order.status}
        </span>
        <span className="text-sm opacity-70">
          Placed{" "}
          {order.createdAt.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </p>

      <div className="mt-8 stitched rounded-2xl p-4 bg-[rgba(255,255,255,0.4)] space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[rgba(170,127,102,0.15)] shrink-0">
              <Image
                src={item.imageUrl || "/placeholders/bunny.svg"}
                alt={item.productTitle}
                fill
                unoptimized={(item.imageUrl || "").endsWith(".svg") || !item.imageUrl}
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold leading-tight">{item.productTitle}</p>
              {item.variantLabel ? (
                <p className="text-sm opacity-70">{item.variantLabel}</p>
              ) : null}
              <p className="text-sm opacity-80">
                Qty {item.qty} · {formatInr(item.unitPrice)}
              </p>
            </div>
            <p className="font-semibold shrink-0">
              {formatInr(item.unitPrice * item.qty)}
            </p>
          </div>
        ))}
      </div>

      <dl className="mt-6 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatInr(order.subtotal)}</dd>
        </div>
        {order.discount > 0 ? (
          <div className="flex justify-between">
            <dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
            <dd>-{formatInr(order.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{formatInr(order.shippingFee)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold pt-2">
          <dt>Total</dt>
          <dd>{formatInr(order.total)}</dd>
        </div>
      </dl>

      <div className="mt-6 text-sm opacity-85 space-y-1">
        <p>
          <span className="font-semibold">Ship to: </span>
          {order.customerName}, {order.addressLine}, {order.city}, {order.state}{" "}
          {order.pincode}
        </p>
        {order.giftMessage ? (
          <p>
            <span className="font-semibold">Gift message: </span>
            {order.giftMessage}
          </p>
        ) : null}
      </div>

      <p className="mt-8 text-sm">
        <Link href="/shop" className="underline underline-offset-4">
          Back to shop
        </Link>
      </p>
    </div>
  );
}
