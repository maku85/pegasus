import LoadingStatus from "@/components/skeletons/LoadingStatus";

export default function Loading() {
  return (
    <LoadingStatus>
      <div className="max-w-4xl mx-auto px-6 md:px-12 pb-20">
        <div className="pt-4 mb-6 md:pt-8 md:mb-8">
          <div className="h-9 sm:h-10 md:h-12 w-72 md:w-[28rem] max-w-full mx-auto rounded bg-white/15" />
        </div>
        <div className="h-[238px] md:h-[98px] mb-4 rounded-2xl bg-white/5" />
        <div className="h-[126px] mb-8 rounded-2xl bg-white/5" />
        <div className="h-[60px] rounded-xl bg-white/15" />
      </div>
    </LoadingStatus>
  );
}
