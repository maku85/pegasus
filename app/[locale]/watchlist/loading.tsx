import CardGridSkeleton from "@/components/skeletons/CardGridSkeleton";
import LoadingStatus from "@/components/skeletons/LoadingStatus";

export default function Loading() {
  return (
    <LoadingStatus>
      <div className="pt-8 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="h-9 md:h-12 w-64 md:w-96 mb-2 rounded bg-white/15" />
            <div className="h-7 w-40 rounded bg-white/15" />
          </div>
          <CardGridSkeleton count={5} gap="gap-6 md:gap-8" />
        </div>
      </div>
    </LoadingStatus>
  );
}
