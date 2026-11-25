// Same box as the cards in NewsSection
export default function NewsCardSkeleton() {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <div className="h-14 mb-3 space-y-3">
        <div className="h-4 bg-white/15 rounded w-full" />
        <div className="h-4 bg-white/15 rounded w-2/3" />
      </div>
      <div className="h-8 pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="h-3 bg-white/15 rounded w-24" />
        <div className="h-3 bg-white/15 rounded w-16" />
      </div>
    </div>
  );
}
