export default function MovieCardSkeleton() {
  return (
    <div className="min-w-[150px] rounded overflow-hidden shadow animate-pulse">
      <div className="bg-gray-300 h-[225px] w-full"></div>
      <div className="h-4 bg-gray-300 mt-2 mx-2 rounded"></div>
      <div className="h-4 bg-gray-300 mt-1 mx-2 rounded w-3/4"></div>
    </div>
  );
}
