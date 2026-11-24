"use client";

import { useTranslations } from "next-intl";
import { FaPlus, FaCheck } from "react-icons/fa";

import { useWatchlist } from "@/hooks/useWatchlist";
import type { WatchlistItem } from "@/lib/watchlist";

export default function WatchlistToggle(item: WatchlistItem) {
  const t = useTranslations("WatchlistToggle");
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList = isInWatchlist(item);

  return (
    <button
      type="button"
      onClick={() => toggleWatchlist(item)}
      className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
        inList
          ? "bg-green-600 hover:bg-green-500 text-white shadow-green-600/20"
          : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
      }`}
    >
      {inList ? <FaCheck /> : <FaPlus />}
      {inList ? t("inList") : t("add")}
    </button>
  );
}
