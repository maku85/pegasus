import MovieCardSkeleton from "./MovieCardSkeleton";

export default function CardGridSkeleton({ count = 10, gap = "gap-6" }) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${gap}`}
    >
      {[...Array(count).keys()].map((i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
