"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaCheck, FaPlus, FaStar } from "react-icons/fa";

import { useWatchlist } from "@/hooks/useWatchlist";
import { Link } from "@/i18n/routing";
import { formatRating } from "@/lib/rating";
import { tmdbImage } from "@/lib/tmdb";

interface MovieCardProps {
  className?: string;
  movie: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    profile_path?: string | null;
    vote_average?: number;
    vote_count?: number;
    overview?: string;
    first_air_date?: string;
    release_date?: string;
  };
  media_type?: "movie" | "tv" | "person";
}

export default function MovieCard({
  className,
  movie,
  media_type = "movie",
}: MovieCardProps) {
  const t = useTranslations("MovieCard");
  // Created on first use: touch screens never need the text in the page
  const [hasDetails, setHasDetails] = useState(false);
  const link = `/${media_type === "movie" ? "movies" : media_type}/${movie.id}`;
  const title = movie.title || movie.name || t("untitled");
  const date = (movie.release_date || movie.first_air_date)?.slice(0, 4);
  const rating = formatRating(movie.vote_average, movie.vote_count);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList =
    media_type !== "person" && isInWatchlist({ id: movie.id, media_type });

  return (
    <div className={`relative w-full ${className}`}>
      <Link
        href={link}
        prefetch={false}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHasDetails(true)}
        onFocus={() => setHasDetails(true)}
        className="block rounded-2xl group"
      >
        <div>
          <div className="relative w-full aspect-[2/3] rounded-2xl shadow overflow-hidden flex flex-col justify-end group-hover:scale-[1.02] transition-transform bg-gray-800">
            <Image
              src={tmdbImage(
                movie.poster_path ?? movie.profile_path,
                "w500",
                media_type === "person" ? "person" : "poster"
              )}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            {/* Extra for mouse and keyboard; the same text is on the title's page */}
            {hasDetails && movie.overview && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pt-14 p-4 bg-black/85 text-white flex flex-col justify-end gap-2 opacity-0 starting:group-hover:opacity-0 starting:group-focus-visible:opacity-0 transition-opacity duration-200 motion-reduce:transition-none group-hover:opacity-100 group-hover:delay-200 group-focus-visible:opacity-100"
              >
                <p className="text-xs md:text-sm leading-snug line-clamp-8">
                  {movie.overview}
                </p>
                {rating && movie.vote_count ? (
                  <p className="text-xs text-gray-300">
                    {t("votes", { count: movie.vote_count })}
                  </p>
                ) : null}
              </div>
            )}
          </div>
          <div className="py-2">
            <p
              className="text-sm md:text-base font-bold text-white drop-shadow mb-1 truncate"
              title={title}
            >
              {title}
            </p>
            <div className="text-xs md:text-sm font-medium flex justify-between items-center gap-2 text-gray-200 drop-shadow">
              <span>{date}</span>
              {rating && (
                <span className="flex gap-1 items-center">
                  <FaStar className="text-orange-200" />
                  <span>{rating}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      {media_type !== "person" && (
        <button
          type="button"
          onClick={() =>
            toggleWatchlist({
              id: movie.id,
              title,
              poster_path: movie.poster_path ?? null,
              media_type,
              vote_average: rating ? movie.vote_average : undefined,
              release_date: date,
            })
          }
          aria-label={inList ? t("removeFromList") : t("addToList")}
          className={`absolute top-2 right-2 p-2 rounded-full text-white transition-colors z-10 ${
            inList
              ? "bg-green-700 hover:bg-green-600"
              : "bg-black/50 hover:bg-black/80"
          }`}
        >
          {inList ? <FaCheck /> : <FaPlus />}
        </button>
      )}
    </div>
  );
}
