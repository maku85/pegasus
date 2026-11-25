import { getTranslations } from "next-intl/server";
import { FaCalendar, FaStar } from "react-icons/fa";

import AmbientBackground from "@/components/media/AmbientBackground";
import EpisodeCard from "@/components/media/EpisodeCard";
import SeasonNav from "@/components/media/SeasonNav";
import { Link } from "@/i18n/routing";
import { openGraph, pageTitle } from "@/lib/metadata";
import { adjacentSeasons } from "@/lib/seasons";
import { requireIds, tmdbFetch, tmdbImage } from "@/lib/tmdb";

interface SeasonPageProps {
  params: Promise<{ id: string; season_number: string; locale: string }>;
}

function getSeason(id: string, seasonNumber: string, locale: string) {
  requireIds(id, seasonNumber);
  return Promise.all([
    tmdbFetch(`/tv/${id}/season/${seasonNumber}`, locale),
    tmdbFetch(`/tv/${id}`, locale),
  ]);
}

export async function generateMetadata({ params }: SeasonPageProps) {
  const { id, season_number, locale } = await params;
  const [season, show] = await getSeason(id, season_number, locale);
  return {
    title: pageTitle(`${show.name}: ${season.name}`),
    openGraph: openGraph(locale, show.backdrop_path ?? season.poster_path),
  };
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { id, season_number, locale } = await params;
  const t = await getTranslations({ locale, namespace: "MediaPage" });
  const [season, show] = await getSeason(id, season_number, locale);
  const neighbours = adjacentSeasons(
    show.seasons ?? [],
    Number(season_number)
  );

  return (
    <div className="text-white pb-20 relative overflow-hidden">
      <AmbientBackground path={show.backdrop_path ?? season.poster_path ?? show.poster_path} />

      <div className="relative w-full z-10 pt-8 md:pt-16 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          <div className="flex-shrink-0 w-48 md:w-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group mx-auto md:mx-0">
            <img
              src={tmdbImage(season.poster_path || show.poster_path, "w500")}
              alt={season.name}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <p className="text-xl text-gray-300 font-medium">
              <Link
                href={`/tv/${id}`}
                prefetch={false}
                className="underline decoration-gray-500 underline-offset-4 hover:text-yellow-400 hover:decoration-yellow-400 transition-colors"
              >
                {show.name}
              </Link>
            </p>
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
              {season.episodes?.length > 0 && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
                  <FaStar className="text-yellow-400" />
                  <span>{t("episodeCount", { count: season.episodes.length })}</span>
                </div>
              )}
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

      <div className="max-w-[86rem] mx-auto px-6 md:px-12 py-12 space-y-6 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
          {t("episodes")}
        </h2>
        <SeasonNav showId={id} {...neighbours} label={t("otherSeasons")} />
        {!season.episodes?.length && (
          <p className="text-gray-300 italic">{t("noEpisodes")}</p>
        )}
        <div className="space-y-4">
          {season.episodes?.map((episode: any) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
        <SeasonNav
          showId={id}
          {...neighbours}
          label={t("otherSeasonsEnd")}
        />
      </div>
    </div>
  );
}
