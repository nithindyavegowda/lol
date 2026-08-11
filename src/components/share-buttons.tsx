"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./icons";

export function ShareButtons({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url);

  useEffect(() => {
    setShareUrl(url || window.location.href);
  }, [url]);

  const waText = `Check out ${title} from LOL — Loops of Love: ${shareUrl}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        className="btn-primary !py-2 !px-3 text-sm inline-flex items-center gap-2"
      >
        <WhatsAppIcon className="w-4 h-4" />
        Share
      </a>
      <button type="button" className="btn-primary !bg-transparent !py-2 !px-3 text-sm" onClick={copy}>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
