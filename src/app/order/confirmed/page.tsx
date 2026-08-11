"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WhatsAppIcon, YarnBallIcon } from "@/components/icons";

function ConfirmedInner() {
  const sp = useSearchParams();
  const token = sp.get("token") || "";
  const whatsapp = sp.get("whatsapp") || "";
  const message = sp.get("message") || "";
  const [copied, setCopied] = useState(false);

  const statusHref = useMemo(
    () => (token ? `/order/${encodeURIComponent(token)}` : ""),
    [token]
  );

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
        Next step: send the order on WhatsApp so Amie can confirm your slot and payment.
      </p>

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
            {copied ? "Copied!" : "Copy message"}
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
