"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaDice, FaFilter, FaTimes } from "react-icons/fa";

import { useRouter } from "@/i18n/routing";

interface Genre {
  id: number;
  name: string;
}

export default function RandomMoviePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("RandomPage");
  const [currentText, setCurrentText] = useState(t("ready"));
  const [isFound, setIsFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [type, setType] = useState<"movie" | "tv">("movie");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/genres${type === "tv" ? "/tv" : ""}?lang=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setGenres(data.genres || []);
      })
      .catch((error) => console.error("Error fetching genres:", error));
    return () => {
      ignore = true;
    };
  }, [type, locale]);

  const startSearch = async () => {
    setIsSearching(true);
    setIsFound(false);
    setShowFilters(false);

    // Shuffle effect
    const interval = setInterval(() => {
      const randomGenre =
        genres[Math.floor(Math.random() * genres.length)]?.name ?? "";
      setCurrentText(t("searching", { genre: randomGenre }));
    }, 100);

    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("type", type);
      if (selectedGenre) params.append("genre", selectedGenre);
      if (year) params.append("year", year);

      // Artificial delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await fetch(`/api/random-movie?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      clearInterval(interval);

      if (data.id) {
        setIsFound(true);
        setCurrentText(t("found"));
        setTimeout(() => {
          router.replace(
            data.type === "tv" ? `/tv/${data.id}` : `/movies/${data.id}`
          );
        }, 500);
      } else {
        setIsSearching(false);
        setCurrentText(t("noResults"));
      }
    } catch (error) {
      console.error("Error fetching random movie:", error);
      clearInterval(interval);
      setIsSearching(false);
      setCurrentText(t("error"));
    }
  };

  return (
    <div className="min-h-[70vh] bg-[#141414] flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="z-10 w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="mb-8 relative inline-block">
            <FaDice
              className={`text-7xl mx-auto ${
                isFound ? "text-green-500" : "text-yellow-500"
              } ${isSearching ? "animate-spin-slow" : ""}`}
            />
          </div>

          <h1 className="text-3xl font-black mb-2 tracking-tight">
            {isFound ? t("found") : t("title")}
          </h1>

          <div className="h-8 mb-8 text-gray-400 font-medium">
            {currentText}
          </div>

          {!isSearching && (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={startSearch}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                {t("spin")} 🎲
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <FaFilter /> {showFilters ? t("closeFilters") : t("openFilters")}
              </button>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {showFilters && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 bg-gray-900/90 backdrop-blur-md p-6 rounded-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">{t("filters")}</h2>
                <button
                  type="button"
                  aria-label={t("closeFilters")}
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <fieldset>
                  <legend className="block text-xs text-gray-400 mb-1 uppercase font-bold">
                    {t("type")}
                  </legend>
                  <div className="flex bg-black/50 rounded-lg p-1">
                    <button
                      type="button"
                      aria-pressed={type === "movie"}
                      onClick={() => {
                        setType("movie");
                        setSelectedGenre("");
                      }}
                      className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                        type === "movie"
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {t("movie")}
                    </button>
                    <button
                      type="button"
                      aria-pressed={type === "tv"}
                      onClick={() => {
                        setType("tv");
                        setSelectedGenre("");
                      }}
                      className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                        type === "tv"
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {t("tv")}
                    </button>
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="random-genre" className="block text-xs text-gray-400 mb-1 uppercase font-bold">
                    {t("genre")}
                  </label>
                  <select
                    id="random-genre"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">{t("any")}</option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="random-year" className="block text-xs text-gray-400 mb-1 uppercase font-bold">
                    {t("year")}
                  </label>
                  <input
                    id="random-year"
                    type="number"
                    placeholder={t("yearExample")}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
