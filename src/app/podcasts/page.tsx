import { db } from "@/lib/db";
import TitleCard from "@/components/TitleCard";

export default async function PodcastsPage() {
  const titles = await db.title.findMany({ where: { type: "PODCAST" }, orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-display text-3xl text-sand mb-2">Podcasts</h1>
      <p className="text-sand/70 mb-8">Audio and video podcasts from Cypriot creators.</p>
      {titles.length === 0 ? (
        <p className="text-sand-dim font-mono text-sm">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {titles.map((t) => (
            <TitleCard
              key={t.slug}
              data={{
                slug: t.slug,
                title: t.title,
                posterUrl: t.posterUrl,
                type: t.type,
                isOriginal: t.isOriginal,
                freeWithAds: t.freeWithAds,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
