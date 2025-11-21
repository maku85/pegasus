import Link from "next/link";
import { FaStar } from "react-icons/fa";

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

export default function MovieCard({ className, movie, media_type = "movie" }: MovieCardProps) {
  const link = media_type === "movie" ? `/movies/${movie.id}` : `/tv/${movie.id}`;
  const title = movie.title || movie.name || "Senza titolo";
  const date = (media_type === "movie" ? movie.release_date : movie.first_air_date)?.slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);

  return (
    <div className={`relative w-full ${className}`}>
      <Link href={link}>
        <div className="rounded-2xl group">
          <div className="relative w-full aspect-[2/3] rounded-2xl shadow overflow-hidden flex flex-col justify-end group-hover:scale-[1.02] transition-transform bg-gray-800">
            <img
              src={tmdbImage(movie.poster_path, "w500")}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
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
