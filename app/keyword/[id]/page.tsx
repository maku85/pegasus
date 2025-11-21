import { tmdbFetch } from "@/lib/tmdb";
import Link from "next/link";
import { FaChevronLeft, FaHashtag } from "react-icons/fa";
import MovieCard from "@/components/media/MovieCard";
import Carousel from "@/components/media/Carousel";

interface KeywordPageProps {
    params: Promise<{ id: string }>;
}

export default async function KeywordPage({ params }: KeywordPageProps) {
    const { id } = await params;

    // Fetch keyword name (we need to fetch a movie or tv list to get the keyword name usually, 
    // but there is a specific endpoint for keyword details: /keyword/{keyword_id})
    const keyword = await tmdbFetch(`/keyword/${id}`);

    // Fetch movies and tv shows with this keyword
    const [movies, tvShows] = await Promise.all([
        tmdbFetch(`/discover/movie?language=it-IT&with_keywords=${id}&sort_by=popularity.desc`),
        tmdbFetch(`/discover/tv?language=it-IT&with_keywords=${id}&sort_by=popularity.desc`)
    ]);

    return (
        <div className="text-white pb-20 relative overflow-hidden min-h-screen bg-[#141414]">
            {/* FIXED BACKGROUND */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 to-black pointer-events-none" />

            {/* Navigation */}
            <div className="absolute top-0 left-0 p-6 z-50">
                <Link
                    href="/movies"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/50"
                >
                    <FaChevronLeft /> Torna alla home
                </Link>
            </div>

            {/* HERO SECTION */}
            <div className="relative w-full z-10 pt-32 pb-12 px-6 md:px-12">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
                        <FaHashtag className="text-4xl text-gray-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl leading-tight mb-4">
                        {keyword.name}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Esplora contenuti correlati a questo tema
                    </p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-16 relative z-10">

                {movies.results.length > 0 && (
                    <Carousel title="Film Correlati" accentColor="blue">
                        {movies.results.map((m: any) => (
                            <MovieCard key={m.id} movie={m} media_type="movie" />
                        ))}
                    </Carousel>
                )}

                {tvShows.results.length > 0 && (
                    <Carousel title="Serie TV Correlate" accentColor="purple">
                        {tvShows.results.map((tv: any) => (
                            <MovieCard key={tv.id} movie={tv} media_type="tv" />
                        ))}
                    </Carousel>
                )}

                {movies.results.length === 0 && tvShows.results.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        Nessun contenuto trovato per questa keyword.
                    </div>
                )}

            </div>
        </div>
    );
}
