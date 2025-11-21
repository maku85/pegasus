import { tmdbFetch, tmdbImage } from "@/lib/tmdb";
import Link from "next/link";
import { FaPlay, FaStar, FaCalendar, FaClock, FaUser } from "react-icons/fa";
import MovieCard from "@/components/media/MovieCard";
import WatchlistToggle from "@/components/widgets/WatchlistToggle";
import SpotifyLink from "@/components/widgets/SpotifyLink";
import NewsSection from "@/components/widgets/NewsSection";
import ReviewsSection from "@/components/media/ReviewsSection";
import RedditSection from "@/components/social/RedditSection";
import WatchProviders from "@/components/media/WatchProviders";
import SocialLinks from "@/components/widgets/SocialLinks";
import CertificationBadge from "@/components/widgets/CertificationBadge";
import ProductionCompanies from "@/components/widgets/ProductionCompanies";

interface TVPageProps {
  params: Promise<{ id: string }>;
}

export default async function TVPage({ params }: TVPageProps) {
  const { id } = await params;

  // Fetch TV details with appended videos, credits, recommendations, reviews, watch providers, keywords, external_ids, and content_ratings
  const tv = await tmdbFetch(`/tv/${id}?language=it-IT&append_to_response=videos,credits,recommendations,reviews,watch/providers,keywords,external_ids,content_ratings`);

  const trailer = tv.videos?.results?.find(
    (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  // Filter crew for Creator or Executive Producer as "Directors" equivalent for TV
  const creators = tv.created_by || [];
  const cast = tv.credits?.cast?.slice(0, 15) || [];
  const recommendations = tv.recommendations?.results?.slice(0, 10) || [];

  // Extract certification (IT)
  const certification = tv.content_ratings?.results?.find((r: any) => r.iso_3166_1 === "IT")?.rating || "";

  return (
    <div className="text-white pb-20 relative overflow-hidden">
      {/* FIXED BACKGROUND */}
      <div
        className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-30 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${tmdbImage(tv.backdrop_path, "original")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#141414]/80 pointer-events-none" />

      {/* HERO SECTION */}
      <div className="relative w-full h-[70vh] md:h-[85vh] z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${tmdbImage(tv.backdrop_path, "original")})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-end">
            {/* Poster (Hidden on mobile, visible on desktop) */}
            <div className="hidden md:block w-64 lg:w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
              <img
                src={tmdbImage(tv.poster_path, "w780")}
                alt={tv.name}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-2xl leading-tight">
                {tv.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-gray-200">
                {tv.first_air_date && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                    <FaCalendar className="text-yellow-400" />
                    <span>{tv.first_air_date.slice(0, 4)}</span>
                  </div>
                )}
                <CertificationBadge certification={certification} />
                {tv.vote_average > 0 && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                    <FaStar className="text-yellow-400" />
                    <span>{tv.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {tv.number_of_seasons > 0 && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                    <FaClock className="text-yellow-400" />
                    <span>{tv.number_of_seasons} Stagion{tv.number_of_seasons !== 1 ? 'i' : 'e'}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {tv.genres?.map((g: any) => (
                  <span key={g.id} className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs md:text-sm hover:bg-white/20 transition-all cursor-default">
                    {g.name}
                  </span>
                ))}
                {tv.keywords?.results?.slice(0, 5).map((k: any) => (
                  <Link
                    key={k.id}
                    href={`/keyword/${k.id}`}
                    className="px-4 py-1.5 rounded-full bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 text-purple-400 text-xs md:text-sm hover:bg-purple-500/20 transition-all"
                  >
                    #{k.name}
                  </Link>
                ))}
              </div>

              <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed line-clamp-4 md:line-clamp-none">
                  {tv.overview}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {trailer && (
                  <a
                    href={`#trailer`}
                    className="flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                  >
                    <FaPlay /> Guarda Trailer
                  </a>
                )}
                <WatchlistToggle
                  id={tv.id}
                  title={tv.name}
                  poster_path={tv.poster_path}
                  media_type="tv"
                />
                <SpotifyLink title={tv.name} />
              </div>

              <SocialLinks external_ids={tv.external_ids} homepage={tv.homepage} />
              <ProductionCompanies companies={tv.production_companies} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-16 relative z-10">
        {cast.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              Cast Principale
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

        {/* SEASONS */}
        {tv.seasons && tv.seasons.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"></span>
              Stagioni
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
              {tv.seasons.map((season: any) => (
                <Link
                  key={season.id}
                  href={`/tv/${tv.id}/season/${season.season_number}`}
                  className="flex-shrink-0 w-40 md:w-48 group"
                >
                  <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-gray-800 relative flex items-center justify-center shadow-lg border border-white/5 group-hover:border-green-500/50 transition-all duration-300">
                    {season.poster_path ? (
                      <img
                        src={tmdbImage(season.poster_path, "w300")}
                        alt={season.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <span className="text-4xl font-bold text-gray-700 mb-2">{season.season_number}</span>
                        <span className="text-xs uppercase tracking-widest">Stagione</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-bold text-white truncate group-hover:text-green-400 transition-colors text-lg">{season.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{season.episode_count} Episodi</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CREATORS */}
        {creators.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              Creato da
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
              {creators.map((person: any) => (
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
                  </div>
                  <h3 className="font-bold text-white truncate group-hover:text-yellow-400 transition-colors text-lg">{person.name}</h3>
                  <p className="text-sm text-gray-400 truncate">Creatore</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* TRAILER */}
        {trailer && (
          <section id="trailer" className="scroll-mt-32 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              Trailer Ufficiale
            </h2>
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              ></iframe>
            </div>
          </section>
        )}

        {/* WATCH PROVIDERS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <WatchProviders providers={tv["watch/providers"]?.results?.IT} />
        </div>

        {/* REVIEWS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <ReviewsSection reviews={tv.reviews?.results} />
        </div>

        {/* REDDIT */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <RedditSection query={tv.name} />
        </div>

        {/* NEWS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <NewsSection query={tv.name} />
        </div>

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              Raccomandati per te
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.map((tv: any) => (
                <MovieCard key={tv.id} movie={tv} media_type="tv" />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
