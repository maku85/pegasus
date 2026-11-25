import CardGridSkeleton from "./CardGridSkeleton";
import LoadingStatus from "./LoadingStatus";

// Movie and TV lists
export default function MediaListSkeleton() {
  return (
    <LoadingStatus>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 pt-8 flex flex-col items-center">
          <div className="h-10 md:h-12 w-64 md:w-96 mb-4 rounded bg-white/15" />
          <div className="h-14 md:h-7 w-full max-w-2xl rounded bg-white/15" />
        </div>
        <div className="mb-8 space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            {[...Array(3).keys()].map((i) => (
              <div key={i} className="h-10 w-32 rounded-full bg-white/15" />
            ))}
          </div>
          <div className="h-[66px] lg:h-[110px] rounded-2xl bg-white/5" />
        </div>
        <CardGridSkeleton />
      </div>
    </LoadingStatus>
  );
}
