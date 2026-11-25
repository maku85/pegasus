import LoadingStatus from "./LoadingStatus";

// Movie and TV pages
export default function DetailSkeleton() {
  return (
    <LoadingStatus>
      <div className="pb-20 bg-[#141414] overflow-hidden">
        <div className="relative w-full md:h-[85vh]">
          <div className="relative md:absolute bottom-0 left-0 w-full px-6 md:px-12 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-end">
              <div className="hidden md:flex flex-col items-center gap-4">
                <div className="w-64 lg:w-80 p-1">
                  <div className="w-full aspect-[2/3] rounded-2xl bg-white/15" />
                </div>
                <div className="h-14 w-44 rounded-xl bg-white/15" />
              </div>
              <div className="flex-1 w-full py-8 flex flex-col gap-6">
                <div className="flex items-end gap-4">
                  <div className="md:hidden w-24 shrink-0 aspect-[2/3] rounded-xl bg-white/15" />
                  <div className="h-10 md:h-20 w-2/3 rounded bg-white/15" />
                </div>
                <div className="flex flex-wrap gap-4">
                  {[...Array(4).keys()].map((i) => (
                    <div key={i} className="h-10 w-20 md:w-24 rounded-xl bg-white/15" />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(2).keys()].map((i) => (
                    <div key={i} className="h-8 w-24 rounded-full bg-white/15" />
                  ))}
                </div>
                <div className="order-last md:order-none h-40 md:h-64 rounded-2xl bg-white/15" />
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="h-14 md:w-52 rounded-xl bg-white/15" />
                  <div className="h-14 md:w-64 rounded-xl bg-white/15" />
                </div>
                <div className="md:hidden h-14 w-44 rounded-xl bg-white/15" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[86rem] mx-auto px-6 md:px-12 py-12">
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-10">
            <div className="h-8 md:h-9 w-48 mb-8 rounded bg-white/15" />
            <div className="flex gap-4 md:gap-6 overflow-hidden px-1 pt-1 pb-4">
              {[...Array(6).keys()].map((i) => (
                <div key={i} className="flex-shrink-0 w-36 md:w-44">
                  <div className="w-full aspect-[2/3] rounded-2xl mb-4 bg-white/15" />
                  <div className="h-7 w-3/4 rounded bg-white/15" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LoadingStatus>
  );
}
