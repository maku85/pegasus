"use client";

import { useTranslations } from "next-intl";
import { FaFilter } from "react-icons/fa";

interface Genre {
  id: number;
  name: string;
}

interface MovieFiltersProps {
  activeCategory: "popular" | "trending" | "top_rated";
  activeGenre: string;
  genres: Genre[] | null;
  onCategoryChange: (category: "popular" | "trending" | "top_rated") => void;
  onGenreChange: (genreId: string) => void;
}

export default function MovieFilters({
  activeCategory,
  activeGenre,
  genres,
  onCategoryChange,
  onGenreChange,
}: MovieFiltersProps) {
  const t = useTranslations("MovieFilters");

  return (
    <div className="mb-8 space-y-6">
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {[
          { id: "popular", label: t("popular") },
          { id: "trending", label: t("trending") },
          { id: "top_rated", label: t("topRated") },
        ].map((cat) => (
          <button
            type="button"
            key={cat.id}
            aria-pressed={activeCategory === cat.id}
            onClick={() => onCategoryChange(cat.id as any)}
            className={`px-4 md:px-6 py-2 text-sm md:text-base rounded-full font-semibold transition-all duration-300 ${
              activeCategory === cat.id
                ? "bg-yellow-500 text-black shadow-lg scale-105"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar w-full md:flex-wrap">
          <div className="flex items-center gap-2 text-gray-400 px-2">
            <FaFilter />
            <span className="font-medium">{t("genres")}</span>
          </div>

          <button
            type="button"
            aria-pressed={!activeGenre}
            onClick={() => onGenreChange("")}
            className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !activeGenre
                ? "bg-white text-black"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {t("all")}
          </button>

          {/* Keeps the bar as tall as it will be with the genres */}
          {!genres &&
            [...Array(18).keys()].map((i) => (
              <span
                key={i}
                className="h-8 w-24 shrink-0 rounded-lg bg-white/5 animate-pulse motion-reduce:animate-none"
              />
            ))}

          {genres?.map((g) => (
            <button
              type="button"
              key={g.id}
              aria-pressed={activeGenre === String(g.id)}
              onClick={() => onGenreChange(String(g.id))}
              className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeGenre === String(g.id)
                  ? "bg-white text-black"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
