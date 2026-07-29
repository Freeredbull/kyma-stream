import TitleCard, { TitleCardData } from "./TitleCard";

export default function Shelf({ heading, items }: { heading: string; items: TitleCardData[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <h2 className="font-display text-xl text-sand mb-4">{heading}</h2>
      <div className="shelf-scroll flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <TitleCard key={item.slug} data={item} />
        ))}
      </div>
    </section>
  );
}
