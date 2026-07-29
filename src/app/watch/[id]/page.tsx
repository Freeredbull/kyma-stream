import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Player from "@/components/Player";

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const episode = await db.episode.findUnique({
    where: { id },
    include: { title: true },
  });

  if (!episode) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Player episodeId={episode.id} videoAssetId={episode.videoAssetId} />
      <h1 className="font-display text-2xl text-sand mt-6">{episode.title.title}</h1>
      <p className="text-sand/70 mt-1">
        {episode.number ? `Episode ${episode.number} — ` : ""}
        {episode.name}
      </p>
      {episode.synopsis && <p className="text-sand/60 mt-3 max-w-2xl">{episode.synopsis}</p>}
    </main>
  );
}
