import { db } from "@/lib/db";

// MVP admin: read-only overview. For adding/editing titles day-to-day,
// use `npx prisma studio` (see README) until a proper CMS UI is built here.
// When you do build it out, gate this whole route with an isAdmin check
// in middleware.ts — it currently has NO auth guard.

export default async function AdminPage() {
  const [titleCount, subCounts, impressionCount] = await Promise.all([
    db.title.count(),
    db.subscription.groupBy({ by: ["tier"], _count: true }),
    db.adImpression.count(),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl text-sand mb-2">Admin overview</h1>
      <p className="text-coral font-mono text-xs mb-8">
        ⚠ Not auth-gated yet — add an admin check before deploying publicly.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <Stat label="Titles" value={titleCount} />
        <Stat label="Ad impressions" value={impressionCount} />
        <Stat label="Subscribers" value={subCounts.reduce((s, c) => s + c._count, 0)} />
      </div>

      <h2 className="font-display text-xl text-sand mb-3">Subscribers by tier</h2>
      <ul className="font-mono text-sm text-sand/80 space-y-1">
        {subCounts.map((c) => (
          <li key={c.tier}>
            {c.tier}: {c._count}
          </li>
        ))}
      </ul>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-night-light p-4">
      <p className="font-mono text-xs text-sand-dim uppercase">{label}</p>
      <p className="font-display text-3xl text-ochre-bright mt-1">{value}</p>
    </div>
  );
}
