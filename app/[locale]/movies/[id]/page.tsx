import { tmdbFetch, tmdbImage } from "@/lib/tmdb";
import Link from "next/link";
import { FaStar, FaCalendar, FaClock, FaPlay, FaUser } from "react-icons/fa";
import MovieCard from "@/components/media/MovieCard";
import WatchlistToggle from "@/components/widgets/WatchlistToggle";
import NewsSection from "@/components/widgets/NewsSection";
import ReviewsSection from "@/components/media/ReviewsSection";
import RedditSection from "@/components/social/RedditSection";
import WatchProviders from "@/components/media/WatchProviders";
import SocialLinks from "@/components/widgets/SocialLinks";
import CertificationBadge from "@/components/widgets/CertificationBadge";
import TrailerButton from "@/components/media/TrailerButton";
import { getTranslations } from "next-intl/server";

interface MoviePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'MediaPage' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });

  const movie = await tmdbFetch(`/movie/${id}?append_to_response=videos,credits,recommendations,reviews,watch/providers,keywords,external_ids,release_dates,belongs_to_collection`, locale);

  const trailer = movie.videos?.results?.find(
    (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const directors = movie.credits?.crew?.filter((p: any) => p.job === "Director") || [];
  const cast = movie.credits?.cast?.slice(0, 15) || [];
  const recommendations = movie.recommendations?.results?.slice(0, 10) || [];

  const releaseDates = movie.release_dates?.results?.find((r: any) => r.iso_3166_1 === "IT")?.release_dates || [];
  const certification = releaseDates.length > 0 ? releaseDates[0].certification : "";

  return (
    <div className="text-white pb-20 relative overflow-hidden">
      <div
        className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-30 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${tmdbImage(movie.backdrop_path, "original")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#141414]/80 pointer-events-none" />

      <div className="relative w-full h-full md:h-[85vh] z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${tmdbImage(movie.backdrop_path, "original")})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/20 to-transparent" />
        </div>

        <div className="md:absolute bottom-0 left-0 w-full px-6 md:px-12 pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-end">
            <div className="hidden md:flex flex-col items-center gap-4">
              <div className="md:block w-64 lg:w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                <img
                  src={tmdbImage(movie.poster_path, "w780")}
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <SocialLinks external_ids={movie.external_ids} homepage={movie.homepage} />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-2xl leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-gray-200">
                {movie.release_date && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                    <FaCalendar className="text-yellow-400" />
                    <span>{movie.release_date.slice(0, 4)}</span>
                  </div>
                )}
                {certification && <CertificationBadge certification={certification} />}
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                    <FaStar className="text-yellow-400" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                    <FaClock className="text-yellow-400" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((g: any) => (
                  <span key={g.id} className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs md:text-sm hover:bg-white/20 transition-all cursor-default">
                    {g.name}
                  </span>
                ))}
                {movie.keywords?.keywords?.slice(0, 5).map((k: any) => (
                  <Link
                    key={k.id}
                    href={`/keyword/${k.id}`}
                    className="px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 text-blue-400 text-xs md:text-sm hover:bg-blue-500/20 transition-all"
                  >
                    #{k.name}
                  </Link>
                ))}
              </div>

              <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed line-clamp-4 md:line-clamp-none">
                  {movie.overview}
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                {trailer && (
                  <TrailerButton trailerKey={trailer.key} />
                )}
                <WatchlistToggle
                  id={movie.id}
                  title={movie.title}
                  poster_path={movie.poster_path}
                  media_type="movie"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-16 relative z-10">
        {cast.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t('mainCast')}
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
              {cast.map((person: any) => (
                <Link
                  key={person.id}
                  href={`/person/${person.id}`}
                  className="flex-shrink-0 w-36 md:w-44 group"
                >
                  <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-gray-800 relative flex items-center justify-center shadow-lg border border-white/5 group-hover:border-yellow-500/50 transition-all duration-300">
                    {person.profile_path ? (
                      <img
                        src={tmdbImage(person.profile_path, "w300")}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <FaUser className="text-4xl text-gray-600 group-hover:text-yellow-500 transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-bold text-white truncate group-hover:text-yellow-400 transition-colors text-lg">{person.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{person.character}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CREW */}
        {directors.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t('crew')}
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
              {directors.map((person: any) => (
                <Link
                  key={person.credit_id}
                  href={`/person/${person.id}`}
                  className="flex-shrink-0 w-36 md:w-44 group"
                >
                  <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-gray-800 relative flex items-center justify-center shadow-lg border border-white/5 group-hover:border-yellow-500/50 transition-all duration-300">
                    {person.profile_path ? (
                      <img
                        src={tmdbImage(person.profile_path, "w300")}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <FaUser className="text-4xl text-gray-600 group-hover:text-yellow-500 transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-bold text-white truncate group-hover:text-yellow-400 transition-colors text-lg">{person.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{person.job}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* WATCH PROVIDERS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <WatchProviders providers={movie["watch/providers"]?.results?.[locale === "en" ? "US" : "IT"]} />
        </div>

        {/* REVIEWS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <ReviewsSection reviews={movie.reviews?.results} />
        </div>

        {/* REDDIT */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <RedditSection query={movie.title} />
        </div>

        {/* NEWS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <NewsSection query={movie.title} locale={locale} />
        </div>

        {/* COLLECTION */}
        {movie.belongs_to_collection && (
          <section className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-blue-500/30 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 md:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <img
                  src={tmdbImage(movie.belongs_to_collection.poster_path, "w500")}
                  alt={movie.belongs_to_collection.name}
                  className="w-full h-auto"
                />
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <h3 className="text-xl text-gray-300 font-medium uppercase tracking-widest">{t('partOfCollection')}</h3>
                <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                  {movie.belongs_to_collection.name}
                </h2>
                <Link
                  href={`/collection/${movie.belongs_to_collection.id}`}
                  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                >
                  {t('viewCollection')}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t('recommended')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.map((m: any) => (
                <MovieCard key={m.id} movie={m} media_type="movie" />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
