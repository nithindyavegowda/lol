export async function sendOrderEmail(opts: {
  to: string;
  subject: string;
  text: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("[order-email:fallback]", {
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
    return { ok: true, mode: "console" as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "LOL Orders <onboarding@resend.dev>",
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[order-email:error]", body);
    return { ok: false, mode: "resend" as const };
  }
  return { ok: true, mode: "resend" as const };
}
