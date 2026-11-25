import LoadingStatus from "@/components/skeletons/LoadingStatus";

export default function Loading() {
  return (
    <LoadingStatus>
      <div className="pb-20 bg-[#141414]">
        <div className="w-full pt-8 md:pt-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0 aspect-[2/3] rounded-3xl bg-white/15" />
            <div className="flex-1 w-full flex flex-col gap-8 items-center md:items-start">
              <div className="h-10 md:h-[60px] w-2/3 rounded bg-white/15" />
              <div className="flex flex-wrap justify-center gap-4">
                <div className="h-[70px] w-64 rounded-xl bg-white/15" />
                <div className="h-[70px] w-32 rounded-xl bg-white/15" />
              </div>
              <div className="h-96 w-full rounded-2xl bg-white/15" />
            </div>
          </div>
        </div>
      </div>
    </LoadingStatus>
  );
}
