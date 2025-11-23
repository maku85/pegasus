"use client";

import Link from "next/link";
import Image from "next/image";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/hooks/useFavorites";

import { tmdbImage } from "@/lib/tmdb";

interface MovieCardProps {
  className?: string;
  movie: {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    vote_average?: number;
    first_air_date?: string;
    release_date?: string;
  }
  media_type?: "movie" | "tv";
}

import { useTranslations } from 'next-intl';

export default function MovieCard({ className, movie, media_type = "movie" }: MovieCardProps) {
  const t = useTranslations('MovieCard');
  const link = media_type === "movie" ? `/movies/${movie.id}` : `/tv/${movie.id}`;
  const title = movie.title || movie.name || t('untitled');
  const date = (media_type === "movie" ? movie.release_date : movie.first_air_date)?.slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);

  const { isFavorite, addToFavorites, removeFromFavorites, isAvailable } = useFavorites();
  const favorite = isFavorite(movie.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Ensure movie object has necessary fields for saving
    const movieToSave = {
      id: movie.id,
      title: title,
      poster_path: movie.poster_path || "",
      vote_average: movie.vote_average || 0,
      release_date: date || "",
    };

    if (favorite) {
      removeFromFavorites(movieToSave);
    } else {
      addToFavorites(movieToSave);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <Link href={link}>
        <div className="rounded-2xl group">
          <div className="relative w-full aspect-[2/3] rounded-2xl shadow overflow-hidden flex flex-col justify-end group-hover:scale-[1.02] transition-transform bg-gray-800">
            <Image
              src={tmdbImage(movie.poster_path, "w500")}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            {isAvailable && (
              <button
                onClick={toggleFavorite}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-red-500/20 hover:text-red-500 transition-colors z-10"
              >
                {favorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </button>
            )}
          </div>
          <div className="py-2">
            <p className="text-sm md:text-base font-bold text-white drop-shadow mb-1 truncate" title={title}>{title}</p>
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
    </div>
  );
}
