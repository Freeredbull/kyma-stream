"use client";

import { useState } from "react";

export default function PlanButton({ tier, priceId }: { tier: string; priceId: string | null }) {
  const [loading, setLoading] = useState(false);

  if (!priceId) {
    return (
      <a
        href="/browse"
        className="mt-6 block text-center border border-sand/30 text-sand px-4 py-2.5 rounded-full hover:border-sand/60 transition-colors"
      >
        Start watching free
      </a>
    );
  }

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={startCheckout}
      disabled={loading}
      className="mt-6 bg-ochre text-night-deep font-medium px-4 py-2.5 rounded-full hover:bg-ochre-bright transition-colors disabled:opacity-60"
    >
      {loading ? "Redirecting…" : "Choose plan"}
    </button>
  );
}
