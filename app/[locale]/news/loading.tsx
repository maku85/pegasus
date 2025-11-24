import NewsCardSkeleton from "@/components/widgets/NewsCardSkeleton";

export default function Loading() {
    return (
        <div className="text-white pt-8 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header Skeleton */}
                <header className="text-center mb-16 animate-pulse">
                    <div className="h-10 md:h-16 bg-gray-800 rounded w-3/4 md:w-1/2 mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-800 rounded w-full md:w-2/3 mx-auto"></div>
                </header>

                {/* Sections Skeleton */}
                {[1, 2, 3].map((section) => (
                    <section key={section}>
                        <div className="flex items-center gap-4 mb-8 animate-pulse">
                            <div className="h-8 w-48 bg-gray-800 rounded"></div>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="h-[250px]">
                                    <NewsCardSkeleton />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
