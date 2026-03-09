"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/admin/reservations");

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("next");
    if (value && value.startsWith("/")) {
      setNextPath(value);
    }
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password })
      });

      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "Login failed");
      }

      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-scarlett-black px-4 py-10 text-scarlett-cream md:px-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-black/40 p-6">
        <p className="text-xs tracking-[0.24em] text-scarlett-gold">ADMIN ACCESS</p>
        <h1 className="mt-2 font-display text-3xl">Login</h1>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="rounded-xl border border-white/15 bg-black/30 px-4 py-3"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-xl border border-white/15 bg-black/30 px-4 py-3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-scarlett-gold px-5 py-3 font-semibold text-scarlett-black"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error && <p className="text-sm text-red-300">{error}</p>}
        </form>
      </div>
    </main>
  );
}
