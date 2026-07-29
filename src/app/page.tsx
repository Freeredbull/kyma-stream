import Link from "next/link";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getContinueWatching, getBecauseYouWatched } from "@/lib/recommendations";
import Shelf from "@/components/Shelf";
import ContinueWatchingShelf from "@/components/ContinueWatchingShelf";
import Coastline from "@/components/Coastline";

// Personalized shelves mean this page can't be a static/ISR page for signed-in
// visitors — render per-request. Logged-out visitors still get a fast page;
// consider splitting the anonymous shell out to a cached component if this
// ever becomes a bottleneck at scale.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;

  const [featured, series, movies, podcasts, continueWatching, becauseYouWatched] = await Promise.all([
    db.title.findFirst({ where: { featured: true } }),
    db.title.findMany({ where: { type: "SERIES" }, take: 12, orderBy: { createdAt: "desc" } }),
    db.title.findMany({ where: { type: "MOVIE" }, take: 12, orderBy: { createdAt: "desc" } }),
    db.title.findMany({ where: { type: "PODCAST" }, take: 12, orderBy: { createdAt: "desc" } }),
    userId ? getContinueWatching(userId) : Promise.resolve([]),
    userId ? getBecauseYouWatched(userId) : Promise.resolve(null),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="relative border-b border-night-light">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="font-mono text-xs tracking-widest text-ochre-bright uppercase mb-4">
            Made in Cyprus
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-2xl text-sand">
            {featured?.title ?? "Stories from the island, for everyone watching."}
          </h1>
          <p className="mt-5 max-w-xl text-sand/80 text-lg">
            {featured?.synopsis ??
              "Series, films, and podcasts made by Cypriot creators. Start free with ads, or go ad-free with Plus and Premium."}
          </p>
          <div className="mt-8 flex gap-4">
            {featured ? (
              <Link
                href={`/title/${featured.slug}`}
                className="bg-ochre text-night-deep font-medium px-6 py-3 rounded-full hover:bg-ochre-bright transition-colors"
              >
                Watch now
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="bg-ochre text-night-deep font-medium px-6 py-3 rounded-full hover:bg-ochre-bright transition-colors"
              >
                See plans
              </Link>
            )}
            <Link
              href="/browse"
              className="border border-sand/30 text-sand px-6 py-3 rounded-full hover:border-sand/60 transition-colors"
            >
              Browse catalog
            </Link>
          </div>
        </div>
        <Coastline className="text-teal absolute bottom-0 left-0" />
      </section>

      <ContinueWatchingShelf items={continueWatching} />
      {becauseYouWatched && (
        <Shelf heading={`Because you watched ${becauseYouWatched.basedOn}`} items={becauseYouWatched.titles} />
      )}
      <Shelf heading="New series" items={series} />
      <Shelf heading="Films" items={movies} />
      <Shelf heading="Podcasts" items={podcasts} />

      {series.length === 0 && movies.length === 0 && podcasts.length === 0 && (
        <div className="mx-auto max-w-7xl px-6 py-16 text-center text-sand-dim font-mono text-sm">
          No titles yet — add some with `npx prisma studio` or seed the database.
        </div>
      )}
    </main>
  );
}
