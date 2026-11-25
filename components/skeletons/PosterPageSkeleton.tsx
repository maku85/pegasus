import type { ReactNode } from "react";

import LoadingStatus from "./LoadingStatus";

// Season and collection pages: poster and text, then their own list
export default function PosterPageSkeleton({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LoadingStatus>
      <div className="pb-20 bg-[#141414]">
        <div className="w-full pt-8 md:pt-16 pb-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            <div className="flex-shrink-0 w-48 md:w-64 p-1 mx-auto md:mx-0">
              <div className="w-full aspect-[2/3] rounded-2xl bg-white/15" />
            </div>
            <div className="flex-1 w-full flex flex-col gap-4 items-center md:items-start">
              <div className="h-7 w-40 rounded bg-white/15" />
              <div className="h-10 md:h-[75px] w-3/4 rounded bg-white/15" />
              <div className="flex gap-4">
                <div className="h-10 w-24 rounded-xl bg-white/15" />
                <div className="h-10 w-28 rounded-xl bg-white/15" />
              </div>
              <div className="h-48 md:h-40 w-full max-w-3xl rounded-2xl bg-white/15" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-6">
          <div className="h-8 md:h-9 w-48 mb-8 rounded bg-white/15" />
          {children}
        </div>
      </div>
    </LoadingStatus>
  );
}
