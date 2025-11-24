export default function NewsCardSkeleton() {
    return (
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow h-full flex flex-col animate-pulse border border-white/5">
            <div className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <div className="h-7 bg-gray-800 rounded w-3/4 mb-3"></div>
                <div className="h-7 bg-gray-800 rounded w-1/2 mb-4"></div>

                {/* Content Snippet */}
                <div className="space-y-2 mb-4 flex-1">
                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <div className="h-3 bg-gray-800 rounded w-24"></div>
                    <div className="h-3 bg-gray-800 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
}
