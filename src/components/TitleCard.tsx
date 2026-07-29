import Link from "next/link";
import Image from "next/image";

export type TitleCardData = {
  slug: string;
  title: string;
  posterUrl: string | null;
  type: "MOVIE" | "SERIES" | "PODCAST";
  isOriginal: boolean;
  freeWithAds: boolean;
};

export default function TitleCard({ data }: { data: TitleCardData }) {
  return (
    <Link
      href={`/title/${data.slug}`}
      className="group relative flex-shrink-0 w-44 sm:w-52 rounded-lg overflow-hidden bg-night-light"
    >
      <div className="relative aspect-[2/3] w-full">
        {data.posterUrl ? (
          <Image
            src={data.posterUrl}
            alt={data.title}
            fill
            sizes="208px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sand-dim text-xs font-mono px-2 text-center">
            {data.title}
          </div>
        )}
        {data.isOriginal && (
          <span className="absolute top-2 left-2 bg-teal text-sand text-[10px] font-mono tracking-wide px-2 py-0.5 rounded">
            KYMA ORIGINAL
          </span>
        )}
        {data.freeWithAds && (
          <span className="absolute bottom-2 left-2 bg-night/80 text-ochre-bright text-[10px] font-mono px-2 py-0.5 rounded">
            Free with ads
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-sand/90 truncate">{data.title}</p>
    </Link>
  );
}
