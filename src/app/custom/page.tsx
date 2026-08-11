"use client";

import { FormEvent, useState } from "react";
import { customRequestWhatsAppText, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon, YarnBallIcon } from "@/components/icons";

export default function CustomPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const number =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918884558657";
    const text = customRequestWhatsAppText({ name, phone, description });
    const url = whatsappUrl(number, text);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <YarnBallIcon className="w-8 h-8 mb-3 opacity-80" />
      <h1 className="font-display text-4xl">Custom request</h1>
      <p className="mt-2 opacity-80 mb-8">
        Describe what you&apos;d love — colours, size, occasion. We&apos;ll continue on WhatsApp.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="custom-name">
            Your name
          </label>
          <input
            id="custom-name"
            className="input"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="custom-phone">
            Phone
          </label>
          <input
            id="custom-phone"
            className="input"
            required
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="custom-desc">
            What should I make?
          </label>
          <textarea
            id="custom-desc"
            className="input min-h-[9rem]"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. bunny in sakura + cream, ~18cm, gift for niece…"
          />
        </div>
        <button type="submit" className="btn-primary btn-yarn inline-flex items-center gap-2">
          <WhatsAppIcon className="w-5 h-5" />
          Send on WhatsApp
        </button>
      </form>
    </div>
  );
}
