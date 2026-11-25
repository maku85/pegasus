import MovieCardSkeleton from "./MovieCardSkeleton";

// Same spacing as Carousel and ScrollRow
export default function CarouselSkeleton() {
  return (
    <div className="mb-8">
      <div className="h-9 mb-8 w-56 rounded bg-white/15" />
      <div className="flex gap-4 md:gap-6 overflow-hidden px-1 pt-1 pb-4">
        {[...Array(8).keys()].map((i) => (
          <MovieCardSkeleton
            key={i}
            className="min-w-[160px] md:min-w-[200px]"
          />
        ))}
      </div>
    </div>
  );
}
