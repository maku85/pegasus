"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaStar,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { tmdbImage } from "@/lib/tmdb";

interface HeroSliderProps {
  items: any[];
}

import { useTranslations } from "next-intl";

export default function HeroSlider({ items }: HeroSliderProps) {
  const t = useTranslations("HeroSlider");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const isMovie = currentItem.media_type === "movie" || currentItem.title;

  return (
    <div className="relative w-full h-[500px] md:h-[700px] rounded-3xl overflow-hidden mb-12 shadow-2xl group">
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
              "original"
            )})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 z-10">
        <motion.div
          key={`content-${currentItem.id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 rounded-lg text-sm font-bold backdrop-blur-md flex items-center gap-2">
              <FaStar /> {currentItem.vote_average?.toFixed(1)}
            </span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-medium backdrop-blur-md">
              {isMovie ? t("movie") : t("tvSeries")}
            </span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-medium backdrop-blur-md">
              {(currentItem.release_date || currentItem.first_air_date)?.slice(
                0,
                4
              )}
            </span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black text-white mb-4 drop-shadow-lg leading-tight">
            {currentItem.title || currentItem.name}
          </h1>

          <p className="text-base md:text-lg text-gray-200 mb-8 line-clamp-3 max-w-2xl drop-shadow-md">
            {currentItem.overview}
          </p>

          <div className="flex gap-4">
            <Link
              href={`/${isMovie ? "movies" : "tv"}/${currentItem.id}`}
              className="px-8 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg hover:scale-105 transform duration-200"
            >
              <FaInfoCircle /> {t("moreInfo")}
            </Link>
          </div>
        </motion.div>
      </div>

      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 border border-white/10 text-white rounded-full hover:bg-white/20 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 border border-white/10 text-white rounded-full hover:bg-white/20 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20"
      >
        <FaChevronRight size={24} />
      </button>

      <div className="absolute bottom-0 md:bottom-6 right-8 flex gap-2 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
