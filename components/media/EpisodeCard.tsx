import { useLocale, useTranslations } from "next-intl";
import { FaCalendar, FaStar } from "react-icons/fa";

import { tmdbImage } from "@/lib/tmdb";

interface EpisodeCardProps {
  episode: any;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const t = useTranslations("EpisodeCard");
  const locale = useLocale();

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-6 shadow-lg hover:bg-white/10 transition-colors group">
      {/* Image */}
      <div className="flex-shrink-0 w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-gray-800 relative shadow-md border border-white/5">
        <img
          src={tmdbImage(episode.still_path, "w500")}
          alt={episode.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
              <span className="text-yellow-500 mr-2">
                #{episode.episode_number}
              </span>
              {episode.name}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              {episode.air_date && (
                <div className="flex items-center gap-1.5">
                  <FaCalendar className="text-gray-400" />
                  <span>
                    {new Date(episode.air_date).toLocaleDateString(locale)}
                  </span>
                </div>
              )}
              {episode.vote_average > 0 && (
                <div className="flex items-center gap-1.5">
                  <FaStar className="text-yellow-500" />
                  <span>{episode.vote_average.toFixed(1)}</span>
                </div>
              )}
              <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono">
                {episode.runtime} min
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 md:line-clamp-none">
          {episode.overview || t("noOverview")}
        </p>
      </div>
    </div>
  );
}
