"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";

import MovieCard from "@/components/media/MovieCard";
import MovieFilters from "@/components/media/MovieFilters";
import { useInfiniteList } from "@/hooks/useInfiniteList";

type Category = "popular" | "trending" | "top_rated";

interface Genre {
  id: number;
  name: string;
}

function TVListContent() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ListPage");
  const searchParams = useSearchParams();
  const filter = (searchParams.get("category") as Category) || "popular";
  const genre = searchParams.get("genre") || "";
  const { items, loading, error } = useInfiniteList(
    `/api/tv-list?lang=${locale}&type=${filter}&genre=${encodeURIComponent(genre)}`
  );
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    fetch(`/api/genres/tv?lang=${locale}`)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
      .catch((err) => console.error("Error loading genres:", err));
  }, [locale]);

  const handleCategoryChange = (newCategory: Category) => {
    const params = new URLSearchParams(window.location.search);
    params.set("category", newCategory);
    params.delete("genre");
    router.push(`?${params.toString()}`);
  };

  const handleGenreChange = (newGenreId: string) => {
    const params = new URLSearchParams(window.location.search);
    if (newGenreId) {
      params.set("genre", newGenreId);
    } else {
      params.delete("genre");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-10 pt-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
          {t("tvTitle")}
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          {t("tvDescription")}
        </p>
      </div>

      <MovieFilters
        activeCategory={filter}
        activeGenre={genre}
        genres={genres}
        onCategoryChange={handleCategoryChange}
        onGenreChange={handleGenreChange}
      />

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {items.map((tv, index) => (
          <motion.div
            key={tv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <MovieCard movie={tv} media_type="tv" className="h-full" />
          </motion.div>
        ))}

        {loading &&
          [...Array(6).keys()].map((i) => (
            <div
              key={i}
              className="min-w-[150px] h-[300px] bg-gray-800/50 animate-pulse rounded-2xl"
            ></div>
          ))}
      </motion.div>

      {error && (
        <p role="alert" className="text-center text-red-400 py-10">
          {t("error")}
        </p>
      )}
    </div>
  );
}

export default function TVListPage() {
  return (
    <Suspense>
      <TVListContent />
    </Suspense>
  );
}
