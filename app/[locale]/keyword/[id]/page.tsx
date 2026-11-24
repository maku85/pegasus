import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { FaChevronLeft, FaHashtag } from "react-icons/fa";

import Carousel from "@/components/media/Carousel";
import MovieCard from "@/components/media/MovieCard";
import { requireIds, tmdbFetch } from "@/lib/tmdb";

interface KeywordPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function KeywordPage({ params }: KeywordPageProps) {
  const { id, locale } = await params;
  requireIds(id);
  const t = await getTranslations({ locale, namespace: "KeywordPage" });
  const keyword = await tmdbFetch(`/keyword/${id}`, locale);

  const [movies, tvShows] = await Promise.all([
    tmdbFetch(
      `/discover/movie?with_keywords=${id}&sort_by=popularity.desc`,
      locale
    ),
    tmdbFetch(
      `/discover/tv?with_keywords=${id}&sort_by=popularity.desc`,
      locale
    ),
  ]);

  return (
    <div className="text-white pb-20 relative overflow-hidden min-h-screen bg-[#141414]">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 to-black pointer-events-none" />
      <div className="relative w-full z-10 pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
            <FaHashtag className="text-4xl text-gray-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl leading-tight mb-4">
            {keyword.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-16 relative z-10">
        {movies.results.length > 0 && (
          <Carousel title={t("movies")} accentColor="blue">
            {movies.results.map((m: any) => (
              <MovieCard key={m.id} movie={m} media_type="movie" />
            ))}
          </Carousel>
        )}

        {tvShows.results.length > 0 && (
          <Carousel title={t("tv")} accentColor="purple">
            {tvShows.results.map((tv: any) => (
              <MovieCard key={tv.id} movie={tv} media_type="tv" />
            ))}
          </Carousel>
        )}

        {movies.results.length === 0 && tvShows.results.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            {t("empty")}
          </div>
        )}
      </div>
    </div>
  );
}
