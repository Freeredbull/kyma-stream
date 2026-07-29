import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export default async function TitleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const title = await db.title.findUnique({
    where: { slug: id },
    include: {
      episodes: { orderBy: { number: "asc" } },
      seasons: { include: { episodes: { orderBy: { number: "asc" } } }, orderBy: { number: "asc" } },
    },
  });

  if (!title) notFound();

  const firstEpisode = title.episodes[0] ?? title.seasons[0]?.episodes[0];

  return (
    <main>
      <div
        className="relative h-[42vh] bg-night-light bg-cover bg-center flex items-end"
        style={{ backgroundImage: title.backdropUrl ? `url(${title.backdropUrl})` : undefined }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-8 w-full">
          {title.isOriginal && (
            <span className="bg-teal text-sand text-xs font-mono px-2 py-1 rounded mb-3 inline-block">
              KYMA ORIGINAL
            </span>
          )}
          <h1 className="font-display text-4xl text-sand">{title.title}</h1>
          <p className="text-sand/70 font-mono text-sm mt-1">
            {title.releaseYear} · {title.ageRating ?? "All ages"} · {title.genres.join(", ")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sand/90 max-w-2xl mb-8">{title.synopsis}</p>

        {firstEpisode && (
          <Link
            href={`/watch/${firstEpisode.id}`}
            className="bg-ochre text-night-deep font-medium px-6 py-3 rounded-full hover:bg-ochre-bright transition-colors inline-block mb-10"
          >
            {title.type === "MOVIE" ? "Watch now" : "Play episode 1"}
          </Link>
        )}

        {title.seasons.length > 0 ? (
          title.seasons.map((season) => (
            <div key={season.id} className="mb-8">
              <h2 className="font-display text-xl text-sand mb-3">
                Season {season.number}
                {season.name ? ` — ${season.name}` : ""}
              </h2>
              <div className="space-y-3">
                {season.episodes.map((ep) => (
                  <Link
                    key={ep.id}
                    href={`/watch/${ep.id}`}
                    className="flex gap-4 p-3 rounded-lg hover:bg-night-light transition-colors"
                  >
                    <span className="font-mono text-sand-dim w-8">{ep.number}</span>
                    <div>
                      <p className="text-sand">{ep.name}</p>
                      <p className="text-sand/60 text-sm">{Math.round(ep.durationSeconds / 60)} min</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-3">
            {title.episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${ep.id}`}
                className="flex gap-4 p-3 rounded-lg hover:bg-night-light transition-colors"
              >
                <div>
                  <p className="text-sand">{ep.name}</p>
                  <p className="text-sand/60 text-sm">{Math.round(ep.durationSeconds / 60)} min</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
