import { db } from "@/lib/db";
import TitleCard from "@/components/TitleCard";
import { TitleType } from "@/generated/prisma/client";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: typeParam } = await searchParams;
  const type = typeParam as TitleType | undefined;

  const titles = await db.title.findMany({
    where: type ? { type } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-display text-3xl text-sand mb-8">
        {type === "MOVIE" ? "Films" : type === "PODCAST" ? "Podcasts" : "All series & films"}
      </h1>
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
