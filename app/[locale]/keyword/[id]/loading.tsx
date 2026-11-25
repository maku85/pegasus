import CarouselSkeleton from "@/components/skeletons/CarouselSkeleton";
import LoadingStatus from "@/components/skeletons/LoadingStatus";

export default function Loading() {
  return (
    <LoadingStatus>
      <div className="pb-20 min-h-screen bg-[#141414]">
        <div className="pt-32 pb-12 px-6 md:px-12 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full mb-6 bg-white/15" />
          <div className="h-[45px] md:h-[75px] w-2/3 max-w-xl mb-4 rounded bg-white/15" />
        </div>
        <div className="max-w-[86rem] mx-auto px-6 md:px-12 py-8 space-y-16">
          <CarouselSkeleton />
          <CarouselSkeleton />
        </div>
      </div>
    </LoadingStatus>
  );
}
