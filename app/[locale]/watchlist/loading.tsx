import MovieCardSkeleton from "@/components/media/MovieCardSkeleton";

export default function Loading() {
  return (
    <div className="text-white pt-8 pb-20 px-6 md:px-12 min-h-screen bg-[#141414]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 p-6 bg-white/5 rounded-2xl border border-white/10 animate-pulse h-48"></div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {[...Array(10).keys()].map((i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
