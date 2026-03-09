"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Reservation = {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  source: string;
  submittedAt: string;
};

type ReservationsResponse = {
  ok: boolean;
  count?: number;
  data?: Reservation[];
  error?: string;
};

export default function ReservationsAdminPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reservations", { cache: "no-store" });
      const data = (await response.json()) as ReservationsResponse;

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to load reservations");
      }

      setRows(data.data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load reservations";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-scarlett-black px-4 py-8 text-scarlett-cream md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.24em] text-scarlett-gold">ADMIN</p>
            <h1 className="font-display text-3xl md:text-4xl">Reservations</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadReservations()}
              className="rounded-lg bg-scarlett-gold px-4 py-2 text-sm font-semibold text-scarlett-black"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="rounded-lg border border-white/25 px-4 py-2 text-sm"
            >
              Logout
            </button>
            <Link
              href="/"
              className="rounded-lg border border-white/25 px-4 py-2 text-sm"
            >
              Back to site
            </Link>
          </div>
        </div>

        {loading && <p className="text-sm text-scarlett-cream/80">Loading reservations...</p>}
        {error && <p className="text-sm text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-white/15 bg-black/50 text-scarlett-gold">
                <tr>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td className="px-4 py-5 text-scarlett-cream/75" colSpan={7}>
                      No reservations yet.
                    </td>
                  </tr>
                )}

                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/10 last:border-b-0">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(row.submittedAt).toLocaleString()}</td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.phone}</td>
                    <td className="px-4 py-3">{row.guests}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.time}</td>
                    <td className="px-4 py-3">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
