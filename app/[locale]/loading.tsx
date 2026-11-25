import CarouselSkeleton from "@/components/skeletons/CarouselSkeleton";
import LoadingStatus from "@/components/skeletons/LoadingStatus";

export default function Loading() {
  return (
    <LoadingStatus>
      <div className="w-full h-[500px] md:h-[700px] rounded-3xl mb-12 bg-white/5 flex flex-col justify-end pb-20 md:pb-16">
        <div className="w-full max-w-[86rem] mx-auto px-6 md:px-12">
          <div className="h-8 w-56 mb-4 rounded-lg bg-white/15" />
          <div className="h-10 md:h-[75px] w-4/5 max-w-2xl mb-4 rounded bg-white/15" />
          <div className="h-[72px] md:h-[84px] max-w-2xl mb-8 rounded bg-white/15" />
          <div className="h-12 w-40 rounded-xl bg-white/15" />
        </div>
      </div>
      <div className="max-w-[86rem] mx-auto px-6 md:px-12 py-12 space-y-20">
        <CarouselSkeleton />
        <CarouselSkeleton />
      </div>
    </LoadingStatus>
  );
}
