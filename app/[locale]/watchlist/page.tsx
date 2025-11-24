"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaFilm, FaSearch } from "react-icons/fa";

import MovieCard from "@/components/media/MovieCard";
import { useLocalWatchlist } from "@/hooks/useLocalWatchlist";

export default function WatchlistPage() {
  const t = useTranslations("WatchlistPage");
  const { watchlist } = useLocalWatchlist();

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <FaFilm className="text-4xl text-gray-500" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("emptyTitle")}
        </h2>
        <p className="text-gray-400 text-lg max-w-md mb-8">
          {t("emptyDescription")}
        </p>
        <Link
          href="/movies"
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
        >
          <FaSearch /> {t("explore")}
        </Link>
      </div>
    );
  }

  return (
    <div className="text-white pt-8 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-400 text-lg">
              {t("itemsSaved", {
                count: watchlist.length,
                s: watchlist.length !== 1 ? "s" : "",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {watchlist.map((item, index) => (
            <motion.div
              key={`${item.media_type}-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MovieCard movie={item} media_type={item.media_type} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
