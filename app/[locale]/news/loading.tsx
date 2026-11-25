import LoadingStatus from "@/components/skeletons/LoadingStatus";
import NewsCardSkeleton from "@/components/skeletons/NewsCardSkeleton";

export default function Loading() {
  return (
    <LoadingStatus>
      <div className="pt-8 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="mb-16 flex flex-col items-center">
            <div className="h-20 md:h-[60px] w-4/5 md:w-1/2 mb-4 rounded bg-white/15" />
            <div className="h-[84px] md:h-14 w-full max-w-2xl rounded bg-white/15" />
          </div>
          {[...Array(3).keys()].map((section) => (
            <div key={section}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-9 w-40 rounded bg-white/15" />
                <div className="h-px bg-white/15 flex-1" />
              </div>
              <div className="h-8 md:h-9 w-48 mb-6 rounded bg-white/15" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6).keys()].map((item) => (
                  <NewsCardSkeleton key={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LoadingStatus>
  );
}
