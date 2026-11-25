import LoadingStatus from "@/components/skeletons/LoadingStatus";

export default function Loading() {
  return (
    <LoadingStatus>
      <div className="pb-20 bg-[#141414]">
        <div className="w-full pt-6 md:pt-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="h-[42px] w-40 mb-6 rounded-full bg-white/15" />
            <div className="grid grid-cols-[7rem_minmax(0,1fr)] md:grid-cols-[18rem_minmax(0,1fr)] lg:grid-cols-[24rem_minmax(0,1fr)] md:grid-rows-[auto_1fr] gap-x-5 md:gap-x-12 lg:gap-x-16 gap-y-6 md:gap-y-8 items-start">
              <div className="md:row-span-2 aspect-[2/3] rounded-2xl md:rounded-3xl bg-white/15" />
              <div className="self-center h-9 md:h-[60px] w-4/5 rounded bg-white/15" />
              <div className="col-span-2 md:col-span-1 space-y-6 md:space-y-8">
                <div className="flex flex-wrap gap-4">
                  <div className="h-[70px] w-64 rounded-xl bg-white/15" />
                  <div className="h-[70px] w-32 rounded-xl bg-white/15" />
                </div>
                <div className="h-[58px] w-44 rounded-xl bg-white/15" />
                <div className="h-72 md:h-96 w-full rounded-2xl bg-white/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingStatus>
  );
}
