"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    const callback =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("callbackUrl")
        : null;
    router.push(callback || "/admin");
    router.refresh();
  }

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="stitched w-full max-w-md rounded-2xl bg-white/50 p-8"
      >
        <h1 className="font-display text-3xl mb-1">LOL Admin</h1>
        <p className="mb-6 text-sm opacity-70">Sign in to manage the shop</p>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="input mb-4"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="input mb-4"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
