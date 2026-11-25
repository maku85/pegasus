import CardGridSkeleton from "@/components/skeletons/CardGridSkeleton";
import LoadingStatus from "@/components/skeletons/LoadingStatus";

export default function Loading() {
  return (
    <LoadingStatus>
      <div className="pt-8 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto mb-12 flex flex-col items-center">
            <div className="h-[72px] md:h-12 w-4/5 mb-8 rounded bg-white/15" />
            <div className="h-[66px] w-full rounded-full bg-white/15" />
            <div className="h-9 w-44 mt-6 rounded bg-white/15" />
          </div>
          <div className="h-8 w-64 mb-8 rounded bg-white/15" />
          <CardGridSkeleton />
        </div>
      </div>
    </LoadingStatus>
  );
}
