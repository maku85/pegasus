"use client";

import { useLocalWatchlist } from "@/hooks/useLocalWatchlist";
import { FaPlus, FaCheck } from "react-icons/fa";

interface WatchlistToggleProps {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
}

export default function WatchlistToggle({ id, title, poster_path, media_type }: WatchlistToggleProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useLocalWatchlist();
  const inList = isInWatchlist(id, media_type);

  const handleClick = () => {
    if (inList) {
      removeFromWatchlist(id, media_type);
    } else {
      addToWatchlist({ id, title, poster_path, media_type });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${inList
        ? "bg-green-600 hover:bg-green-500 text-white shadow-green-600/20"
        : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
        }`}
    >
      {inList ? <FaCheck /> : <FaPlus />}
      {inList ? "Nella Watchlist" : "Aggiungi alla Watchlist"}
    </button>
  );
}
