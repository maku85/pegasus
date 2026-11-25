import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaStar } from "react-icons/fa";

import WatchlistToggle from "@/components/widgets/WatchlistToggle";
import { Link } from "@/i18n/routing";
import { tmdbImage } from "@/lib/image";
import { formatRating } from "@/lib/rating";

export interface RandomItem {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  overview?: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
}

export default function RandomResult({ item }: { item: RandomItem }) {
  const t = useTranslations("RandomPage");
  const common = useTranslations("Common");
  const title = item.title || common("untitled");
  const year = item.release_date?.slice(0, 4);
  const rating = formatRating(item.vote_average, item.vote_count);

  return (
    <article className="grid grid-cols-[6rem_1fr] sm:grid-cols-[13rem_1fr] sm:grid-rows-[auto_auto_1fr] gap-4 sm:gap-x-6 items-start bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10">
      <div className="relative sm:row-span-3 aspect-[2/3] rounded-2xl overflow-hidden bg-gray-800 shadow">
        <Image
          src={tmdbImage(item.poster_path, "w500")}
          alt=""
          fill
          className="object-cover"
          sizes="208px"
        />
      </div>
      <div className="min-w-0 space-y-2 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight break-words">
          {title}
        </h2>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-gray-200">
          <span>{common(item.media_type === "tv" ? "tvSeries" : "movie")}</span>
          {year && <span>{year}</span>}
          {rating && (
            <span className="flex gap-1 items-center">
              <FaStar className="text-orange-200" />
              {rating}
            </span>
          )}
        </p>
      </div>
      {item.overview && (
        <p className="col-span-2 sm:col-span-1 text-sm sm:text-base text-gray-200 leading-relaxed line-clamp-5">
          {item.overview}
        </p>
      )}
      <div className="col-span-2 sm:col-span-1 flex flex-wrap gap-3">
        <Link
          href={`/${item.media_type === "tv" ? "tv" : "movies"}/${item.id}`}
          prefetch={false}
          className="px-8 py-3 rounded-xl font-bold bg-yellow-500 hover:bg-yellow-400 text-black transition-colors"
        >
          {t("open")}
        </Link>
        <WatchlistToggle
          id={item.id}
          title={title}
          poster_path={item.poster_path}
          media_type={item.media_type}
          vote_average={rating ? item.vote_average : undefined}
          release_date={year}
        />
      </div>
    </article>
  );
}
