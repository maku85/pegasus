"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";

import MovieCard from "@/components/media/MovieCard";
import MovieFilters from "@/components/media/MovieFilters";
import LoadingStatus from "@/components/skeletons/LoadingStatus";
import MovieCardSkeleton from "@/components/skeletons/MovieCardSkeleton";
import { useInfiniteList } from "@/hooks/useInfiniteList";

type Category = "popular" | "trending" | "top_rated";

interface Genre {
  id: number;
  name: string;
}

function MoviesListContent() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ListPage");
  const searchParams = useSearchParams();
  const filter = (searchParams.get("category") as Category) || "popular";
  const genre = searchParams.get("genre") || "";
  const { items, loading, error } = useInfiniteList(
    `/api/movie-list?lang=${locale}&type=${filter}&genre=${encodeURIComponent(genre)}`
  );
  const [genres, setGenres] = useState<Genre[] | null>(null);

  useEffect(() => {
    fetch(`/api/genres?lang=${locale}`)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
      .catch((err) => {
        console.error("Error loading genres:", err);
        setGenres([]);
      });
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
          {t("moviesTitle")}
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          {t("moviesDescription")}
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
        {items.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index % 20) * 0.05 }}
          >
            <MovieCard movie={movie} media_type="movie" className="h-full" />
          </motion.div>
        ))}

        {loading &&
          [...Array(items.length > 0 ? 5 : 20).keys()].map((i) => (
            <MovieCardSkeleton key={i} />
          ))}
      </motion.div>

      {loading && <LoadingStatus />}

      {error && (
        <p role="alert" className="text-center text-red-400 py-10">
          {t("error")}
        </p>
      )}
    </div>
  );
}

export default function MoviesListPage() {
  return (
    <Suspense>
      <MoviesListContent />
    </Suspense>
  );
}
