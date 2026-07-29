// KYMA's signature element: a single continuous line, drawn like a coastline
// on a map, that recurs as a section divider across the app. It's an
// abstraction of Cyprus's south coast (Larnaca to Paphos) rather than a
// generic wave squiggle — order and irregularity both carry meaning here.
export default function Coastline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`w-full h-6 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 20 C 60 8, 120 32, 190 18 S 340 4, 410 22 S 560 36, 640 16 S 800 6, 900 24 S 1080 34, 1200 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-teal-bright/70"
      />
    </svg>
  );
}
