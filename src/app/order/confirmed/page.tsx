"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WhatsAppIcon, YarnBallIcon } from "@/components/icons";

type OrderPayload = {
  orderNumber?: string;
  whatsappText?: string;
  total?: number;
  error?: string;
};

function ConfirmedInner() {
  const sp = useSearchParams();
  const token = sp.get("token") || "";
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(!!token);

  const statusHref = useMemo(
    () => (token ? `/order/${encodeURIComponent(token)}` : ""),
    [token]
  );

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(token)}`);
        const data = (await res.json()) as OrderPayload & {
          whatsappUrl?: string;
          shortWhatsappUrl?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setLoading(false);
          return;
        }
        setOrderNumber(data.orderNumber || "");
        setMessage(data.whatsappText || "");
        // Prefer short URL from API if present; else build from status page later
        if (typeof data.shortWhatsappUrl === "string") {
          setWhatsapp(data.shortWhatsappUrl);
        } else if (typeof data.whatsappUrl === "string") {
          setWhatsapp(data.whatsappUrl);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const copy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <YarnBallIcon className="w-10 h-10 mb-4 opacity-80" />
      <h1 className="font-display text-4xl">Order saved</h1>
      <p className="mt-3 opacity-85">
        {orderNumber
          ? `Order #${orderNumber} is saved. Next: message Amie on WhatsApp to confirm your slot and payment.`
          : "Next step: send the order on WhatsApp so Amie can confirm your slot and payment."}
      </p>
      {loading ? <p className="mt-4 text-sm opacity-60">Loading order…</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="btn-primary btn-yarn inline-flex items-center gap-2"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Open WhatsApp
          </a>
        ) : null}
        {message ? (
          <button type="button" className="btn-primary !bg-transparent" onClick={copy}>
            {copied ? "Copied!" : "Copy full message"}
          </button>
        ) : null}
        {statusHref ? (
          <Link href={statusHref} className="btn-primary !bg-transparent">
            Track status
          </Link>
        ) : null}
      </div>

      {message ? (
        <pre className="mt-8 stitched rounded-2xl p-4 bg-[rgba(255,255,255,0.45)] text-sm whitespace-pre-wrap font-sans">
          {message}
        </pre>
      ) : null}

      <p className="mt-8 text-sm">
        <Link href="/shop" className="underline underline-offset-4">
          Continue shopping
        </Link>
      </p>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 text-center opacity-70">
          Loading confirmation…
        </div>
      }
    >
      <ConfirmedInner />
    </Suspense>
  );
}
