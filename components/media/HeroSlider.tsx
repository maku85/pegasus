"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import {
  FaStar,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaPause,
  FaPlay,
} from "react-icons/fa";

import { Link } from "@/i18n/routing";
import { formatRating } from "@/lib/rating";
import { tmdbImage } from "@/lib/tmdb";

interface HeroSliderProps {
  items: any[];
}

export default function HeroSlider({ items }: HeroSliderProps) {
  const t = useTranslations("HeroSlider");
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInUse, setIsInUse] = useState(false);
  const isPlaying = !isPaused && !reduceMotion;

  useEffect(() => {
    if (!isPlaying || isInUse) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length, isPlaying, isInUse]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const rating = formatRating(currentItem.vote_average, currentItem.vote_count);
  const isMovie = currentItem.media_type === "movie" || currentItem.title;
  const controlClass =
    "w-11 h-11 flex items-center justify-center bg-black/50 border border-white/20 text-white rounded-full hover:bg-white/20 transition-colors";

  return (
    <section
      aria-label={t("label")}
      onMouseEnter={() => setIsInUse(true)}
      onMouseLeave={() => setIsInUse(false)}
      onFocus={() => setIsInUse(true)}
      onBlur={() => setIsInUse(false)}
      className="relative w-full h-[500px] md:h-[700px] rounded-3xl overflow-hidden mb-12 shadow-2xl"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${tmdbImage(
              currentItem.backdrop_path,
              "w1280"
            )})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 w-full max-w-[86rem] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20 md:pb-16 z-10">
        <motion.div
          key={`content-${currentItem.id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            {rating && (
              <span className="px-3 py-1 bg-black/60 border border-yellow-500/40 text-yellow-300 rounded-lg text-sm font-bold flex items-center gap-2">
                <FaStar /> {rating}
              </span>
            )}
            <span className="px-3 py-1 bg-black/60 border border-white/20 text-white rounded-lg text-sm font-medium">
              {isMovie ? t("movie") : t("tvSeries")}
            </span>
            <span className="px-3 py-1 bg-black/60 border border-white/20 text-white rounded-lg text-sm font-medium">
              {(currentItem.release_date || currentItem.first_air_date)?.slice(
                0,
                4
              )}
            </span>
          </div>

          <h2 className="text-3xl md:text-6xl font-black text-white mb-4 drop-shadow-lg leading-tight">
            {currentItem.title || currentItem.name}
          </h2>

          <p className="text-base md:text-lg text-gray-200 mb-8 line-clamp-3 max-w-2xl drop-shadow-md">
            {currentItem.overview}
          </p>

          <div className="flex gap-4">
            <Link
              prefetch={false}
              href={`/${isMovie ? "movies" : "tv"}/${currentItem.id}`}
              className="px-8 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg hover:scale-105 transform duration-200"
            >
              <FaInfoCircle /> {t("moreInfo")}
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 md:bottom-6 inset-x-0 w-full max-w-[86rem] mx-auto px-6 md:px-12 flex items-center md:justify-end gap-2 z-20 pointer-events-none *:pointer-events-auto">
        <button
          type="button"
          onClick={prevSlide}
          aria-label={t("previous")}
          className={controlClass}
        >
          <FaChevronLeft />
        </button>
        <span className="min-w-14 text-center text-sm font-bold text-white tabular-nums">
          {currentIndex + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={nextSlide}
          aria-label={t("next")}
          className={controlClass}
        >
          <FaChevronRight />
        </button>
        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? t("play") : t("pause")}
            className={controlClass}
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
        )}
      </div>
    </section>
  );
}
