import PosterPageSkeleton from "@/components/skeletons/PosterPageSkeleton";

export default function Loading() {
  return (
    <PosterPageSkeleton>
      <div className="space-y-4">
        {[...Array(4).keys()].map((i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-6 bg-white/5 rounded-2xl p-4 md:p-6"
          >
            <div className="flex-shrink-0 w-full md:w-64 aspect-video rounded-xl bg-white/15" />
            <div className="flex-1 flex flex-col justify-center gap-3">
              <div className="h-7 w-1/2 rounded bg-white/15" />
              <div className="h-5 w-40 rounded bg-white/15" />
              <div className="h-16 rounded bg-white/15" />
            </div>
          </div>
        ))}
      </div>
    </PosterPageSkeleton>
  );
}
