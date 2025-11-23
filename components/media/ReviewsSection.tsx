import { useTranslations } from 'next-intl';
import { FaQuoteLeft, FaStar, FaUserCircle } from 'react-icons/fa';

interface Review {
    id: string;
    author: string;
    content: string;
    created_at: string;
    author_details: {
        rating: number | null;
        avatar_path: string | null;
    };
}

interface ReviewsSectionProps {
    reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
    const t = useTranslations('ReviewsSection');

    if (!reviews || reviews.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-green-500 rounded-full"></span>
                {t('title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.slice(0, 4).map((review) => (
                    <div
                        key={review.id}
                        className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                    {review.author_details?.avatar_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}`}
                                            alt={review.author}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-2xl text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white">{review.author}</h3>
                                    <p className="text-xs text-gray-400">
                                        {new Date(review.created_at).toLocaleDateString("it-IT", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                            {review.author_details?.rating && (
                                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded text-yellow-500 text-xs font-bold">
                                    <FaStar />
                                    <span>{review.author_details.rating}/10</span>
                                </div>
                            )}
                        </div>
                        <div className="relative flex-1">
                            <FaQuoteLeft className="absolute -top-1 -left-1 text-white/5 text-4xl" />
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 relative z-10">
                                {review.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
