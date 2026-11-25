import { FaCalendar, FaClock, FaStar, FaUser } from "react-icons/fa";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

import MovieCard from "@/components/media/MovieCard";
import ReviewsSection from "@/components/media/ReviewsSection";
import ScrollRow from "@/components/media/ScrollRow";
import TrailerButton from "@/components/media/TrailerButton";
import WatchProviders from "@/components/media/WatchProviders";
import CertificationBadge from "@/components/widgets/CertificationBadge";
import NewsSection from "@/components/widgets/NewsSection";
import SocialLinks from "@/components/widgets/SocialLinks";
import WatchlistToggle from "@/components/widgets/WatchlistToggle";
import { regionOf } from "@/lib/providers";
import { openGraph, pageTitle, yearSuffix } from "@/lib/metadata";
import { DAY, requireIds, tmdbFetch, tmdbImage } from "@/lib/tmdb";

interface TVPageProps {
  params: Promise<{ id: string; locale: string }>;
}

function getTV(id: string, locale: string) {
  requireIds(id);
  return tmdbFetch(
    `/tv/${id}?append_to_response=videos,credits,recommendations,reviews,watch/providers,keywords,external_ids,content_ratings`,
    locale,
    7 * DAY
  );
}

export async function generateMetadata({ params }: TVPageProps) {
  const { id, locale } = await params;
  const tv = await getTV(id, locale);
  return {
    title: pageTitle(tv.name + yearSuffix(tv.first_air_date)),
    ...(tv.overview && { description: tv.overview }),
    openGraph: openGraph(locale, tv.backdrop_path ?? tv.poster_path),
  };
}

export default async function TVPage({ params }: TVPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "MediaPage" });
  const region = regionOf(locale);
  const tv = await getTV(id, locale);

  const trailer = tv.videos?.results?.find(
    (v: any) =>
      v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const creators = tv.created_by || [];
  const cast = tv.credits?.cast?.slice(0, 15) || [];
  const recommendations = tv.recommendations?.results?.slice(0, 10) || [];

  const certification =
    tv.content_ratings?.results?.find((r: any) => r.iso_3166_1 === region)
      ?.rating || "";

  return (
    <div className="text-white pb-20 relative overflow-hidden">
      <div
        className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-30 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${tmdbImage(tv.backdrop_path, "w300")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#141414]/80 pointer-events-none" />

      <div className="relative w-full h-full md:h-[85vh] z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${tmdbImage(tv.backdrop_path, "w1280")})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/20 to-transparent" />
        </div>

        <div className="relative md:absolute bottom-0 left-0 w-full px-6 md:px-12 pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-end">
            <div className="hidden md:flex flex-col items-center gap-4">
              <div className="md:block w-64 lg:w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                <img
                  src={tmdbImage(tv.poster_path, "w780")}
                  alt={tv.name}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <SocialLinks
                external_ids={tv.external_ids}
                homepage={tv.homepage}
              />
            </div>

            <div className="flex-1 w-full py-8 flex flex-col gap-6">
              <div className="flex items-end gap-4">
                <img
                  src={tmdbImage(tv.poster_path, "w342")}
                  alt=""
                  className="md:hidden w-24 shrink-0 aspect-[2/3] object-cover rounded-xl border-2 border-white/10"
                />
                <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-2xl leading-tight">
                  {tv.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-gray-200">
                {tv.first_air_date && (
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl shadow-lg">
                    <FaCalendar className="text-yellow-400" />
                    <span>{tv.first_air_date.slice(0, 4)}</span>
                  </div>
                )}
                {certification && (
                  <CertificationBadge certification={certification} />
                )}
                {tv.vote_average > 0 && (
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl shadow-lg">
                    <FaStar className="text-yellow-400" />
                    <span>{tv.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {tv.number_of_seasons > 0 && (
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl shadow-lg">
                    <FaClock className="text-yellow-400" />
                    <span>
                      {tv.number_of_seasons} {t("seasons")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {tv.genres?.map((g: any) => (
                  <span
                    key={g.id}
                    className="px-4 py-1.5 rounded-full bg-black/60 border border-white/20 text-xs md:text-sm hover:bg-white/20 transition-all cursor-default"
                  >
                    {g.name}
                  </span>
                ))}
                {tv.keywords?.results?.slice(0, 5).map((k: any) => (
                  <Link
                    prefetch={false}
                    key={k.id}
                    href={`/keyword/${k.id}`}
                    className="px-4 py-1.5 rounded-full bg-black/60 border border-yellow-500/40 text-yellow-300 text-xs md:text-sm hover:bg-yellow-500/20 transition-all"
                  >
                    #{k.name}
                  </Link>
                ))}
              </div>

              <div className="order-last md:order-none bg-black/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed line-clamp-4 md:line-clamp-none">
                  {tv.overview}
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                {trailer && <TrailerButton trailerKey={trailer.key} />}
                <WatchlistToggle
                  id={tv.id}
                  title={tv.name}
                  poster_path={tv.poster_path}
                  media_type="tv"
                  vote_average={tv.vote_average}
                  release_date={tv.first_air_date}
                />
              </div>

              <div className="md:hidden">
                <SocialLinks
                  external_ids={tv.external_ids}
                  homepage={tv.homepage}
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
              {t("mainCast")}
            </h2>
            <ScrollRow label={t("mainCast")}>
              {cast.map((person: any) => (
                <Link
                  prefetch={false}
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
                  <h3 className="font-bold text-white truncate group-hover:text-yellow-400 transition-colors text-lg">
                    {person.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {person.character}
                  </p>
                </Link>
              ))}
            </ScrollRow>
          </section>
        )}

        {tv.seasons && tv.seasons.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t("seasons")}
            </h2>
            <ScrollRow label={t("seasons")}>
              {tv.seasons.map((season: any) => (
                <Link
                  prefetch={false}
                  key={season.id}
                  href={`/tv/${tv.id}/season/${season.season_number}`}
                  className="flex-shrink-0 w-40 md:w-48 group"
                >
                  <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-gray-800 relative flex items-center justify-center shadow-lg border border-white/5 group-hover:border-yellow-500/50 transition-all duration-300">
                    {season.poster_path ? (
                      <img
                        src={tmdbImage(season.poster_path, "w300")}
                        alt={season.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <span className="text-4xl font-bold text-gray-400 mb-2">
                          {season.season_number}
                        </span>
                        <span className="text-xs uppercase tracking-widest">
                          {t("season")}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-bold text-white truncate group-hover:text-yellow-400 transition-colors text-lg">
                    {season.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {season.episode_count} {t("episodes")}
                  </p>
                </Link>
              ))}
            </ScrollRow>
          </section>
        )}

        {creators.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t("creators")}
            </h2>
            <ScrollRow label={t("creators")}>
              {creators.map((person: any) => (
                <Link
                  prefetch={false}
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
                  <h3 className="font-bold text-white truncate group-hover:text-yellow-400 transition-colors text-lg">
                    {person.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{t("creator")}</p>
                </Link>
              ))}
            </ScrollRow>
          </section>
        )}

        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl empty:hidden">
          <WatchProviders
            providers={tv["watch/providers"]?.results?.[region]}
          />
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl empty:hidden">
          <ReviewsSection reviews={tv.reviews?.results} />
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl empty:hidden">
          <NewsSection
            query={`${tv.name} ${locale === "it" ? "serie tv" : "tv series"}`}
            locale={locale}
          />
        </div>

        {recommendations.length > 0 && (
          <section className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
              {t("recommended")}
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
