import { tmdbFetch, tmdbImage } from "@/lib/tmdb";
import Link from "next/link";
import { FaChevronLeft, FaCalendar, FaStar } from "react-icons/fa";
import EpisodeCard from "@/components/media/EpisodeCard";

interface SeasonPageProps {
    params: Promise<{ id: string; season_number: string; locale: string }>;
}

export default async function SeasonPage({ params }: SeasonPageProps) {
    const { id, season_number, locale } = await params;

    // Fetch season details
    const season = await tmdbFetch(`/tv/${id}/season/${season_number}`, locale);
    // Fetch show details for context (name, backdrop)
    const show = await tmdbFetch(`/tv/${id}`, locale);

    return (
        <div className="text-white pb-20 relative overflow-hidden">
            {/* FIXED BACKGROUND */}
            <div
                className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-30 blur-3xl scale-110"
                style={{
                    backgroundImage: `url(${tmdbImage(show.backdrop_path, "original")})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="fixed inset-0 z-0 bg-[#141414]/80 pointer-events-none" />

            {/* Navigation */}
            <div className="absolute top-0 left-0 p-6 z-50">
                <Link
                    href={`/tv/${id}`}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/50"
                >
                    <FaChevronLeft /> Torna alla serie
                </Link>
            </div>

            {/* HERO SECTION */}
            <div className="relative w-full z-10 pt-32 pb-12 px-6 md:px-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-end">
                    {/* Poster */}
                    <div className="flex-shrink-0 w-48 md:w-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group mx-auto md:mx-0">
                        <img
                            src={tmdbImage(season.poster_path || show.poster_path, "w500")}
                            alt={season.name}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h2 className="text-xl text-gray-400 font-medium">{show.name}</h2>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl leading-tight">
                            {season.name}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm md:text-base font-medium text-gray-200">
                            {season.air_date && (
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                                    <FaCalendar className="text-yellow-400" />
                                    <span>{season.air_date.slice(0, 4)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                                <FaStar className="text-yellow-400" />
                                <span>{season.episodes?.length || 0} Episodi</span>
                            </div>
                        </div>

                        {season.overview && (
                            <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl max-w-3xl">
                                <p className="text-lg text-gray-200 leading-relaxed">
                                    {season.overview}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* EPISODES LIST */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-6 relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
                    Episodi
                </h2>
                <div className="space-y-4">
                    {season.episodes?.map((episode: any) => (
                        <EpisodeCard key={episode.id} episode={episode} />
                    ))}
                </div>
            </div>
        </div>
    );
}
