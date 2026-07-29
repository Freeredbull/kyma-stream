import Link from "next/link";
import Image from "next/image";

export type ContinueWatchingItem = {
  episodeId: string;
  positionSeconds: number;
  durationSeconds: number;
  episodeName: string;
  title: { slug: string; title: string; posterUrl: string | null };
};

export default function ContinueWatchingShelf({ items }: { items: ContinueWatchingItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <h2 className="font-display text-xl text-sand mb-4">Continue watching</h2>
      <div className="shelf-scroll flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => {
          const pct = Math.min(100, Math.round((item.positionSeconds / item.durationSeconds) * 100));
          return (
            <Link
              key={item.episodeId}
              href={`/watch/${item.episodeId}`}
              className="group relative flex-shrink-0 w-56 rounded-lg overflow-hidden bg-night-light"
            >
              <div className="relative aspect-video w-full">
                {item.title.posterUrl ? (
                  <Image
                    src={item.title.posterUrl}
                    alt={item.title.title}
                    fill
                    sizes="224px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sand-dim text-xs font-mono px-2 text-center">
                    {item.title.title}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-night-deep/80">
                  <div className="h-full bg-ochre-bright" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="p-2">
                <p className="text-sm text-sand/90 truncate">{item.title.title}</p>
                <p className="text-xs text-sand-dim truncate">{item.episodeName}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
