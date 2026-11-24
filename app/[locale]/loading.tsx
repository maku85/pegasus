import MovieCardSkeleton from "@/components/media/MovieCardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="w-full h-[50vh] md:h-[70vh] bg-gray-800 animate-pulse relative">
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <div className="h-8 md:h-12 w-2/3 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 md:h-6 w-1/2 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 md:h-6 w-1/3 bg-gray-700 rounded"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-20">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-800 rounded animate-pulse"></div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6).keys()].map((i) => (
              <div key={i} className="min-w-[160px] md:min-w-[200px]">
                <MovieCardSkeleton />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-800 rounded animate-pulse"></div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6).keys()].map((i) => (
              <div key={i} className="min-w-[160px] md:min-w-[200px]">
                <MovieCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
