// Same box as MovieCard: 2:3 poster, title line, year and rating line
export default function MovieCardSkeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`w-full animate-pulse in-[.animate-pulse]:animate-none motion-reduce:animate-none ${className}`}
    >
      <div className="w-full aspect-[2/3] rounded-2xl bg-white/15" />
      <div className="py-2">
        <div className="h-5 md:h-6 mb-1 flex items-center">
          <div className="h-3 w-3/4 rounded bg-white/15" />
        </div>
        <div className="h-4 md:h-5 flex items-center">
          <div className="h-3 w-1/3 rounded bg-white/15" />
        </div>
      </div>
    </div>
  );
}
