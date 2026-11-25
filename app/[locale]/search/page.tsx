"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { FaSearch } from "react-icons/fa";

import BackToTop from "@/components/media/BackToTop";
import LoadMore from "@/components/media/LoadMore";
import MovieCard from "@/components/media/MovieCard";
import LoadingStatus from "@/components/skeletons/LoadingStatus";
import MovieCardSkeleton from "@/components/skeletons/MovieCardSkeleton";
import { usePagedList } from "@/hooks/usePagedList";
import { useRouter } from "@/i18n/routing";

function SearchForm() {
  const t = useTranslations("SearchPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [type, setType] = useState(searchParams.get("type") || "multi");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [minRating, setMinRating] = useState(
    searchParams.get("minRating") || "0"
  );
  const [showFilters, setShowFilters] = useState(
    type !== "multi" || year !== "" || minRating !== "0"
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({
      query: query.trim(),
      ...(type !== "multi" && { type }),
      ...(year && { year }),
      ...(minRating !== "0" && { minRating }),
    });
    router.push(`/search?${params.toString()}`);
  };

  const fieldClass =
    "w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500";

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="flex items-center bg-white/5 border border-white/20 rounded-full p-2 shadow-2xl focus-within:border-yellow-500 focus-within:bg-white/10 transition-all duration-300">
          <FaSearch className="text-gray-400 ml-4 text-xl shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white placeholder-gray-400 px-4 py-2 md:py-3 text-base md:text-lg font-medium"
            // biome-ignore lint/a11y/noAutofocus: searching is the only purpose of this page
            autoFocus
          />
          <button
            type="submit"
            disabled={!query.trim()}
            aria-label={t("search")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 md:px-8 py-3 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden md:inline">{t("search")}</span>
            <FaSearch className="md:hidden" />
          </button>
        </div>
      </form>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium px-3 py-2 mx-auto transition-colors"
        >
          {showFilters ? t("hideFilters") : t("showFilters")}
        </button>

        {showFilters && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 text-left">
            <div>
              <label
                htmlFor="search-type"
                className="block text-xs text-gray-300 mb-2 uppercase font-bold"
              >
                {t("type")}
              </label>
              <select
                id="search-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={fieldClass}
              >
                <option value="multi">{t("all")}</option>
                <option value="movie">{t("movie")}</option>
                <option value="tv">{t("tv")}</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="search-year"
                className="block text-xs text-gray-300 mb-2 uppercase font-bold"
              >
                {t("year")}
              </label>
              <input
                id="search-year"
                type="number"
                placeholder={t("yearExample")}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label
                htmlFor="search-min-rating"
                className="block text-xs text-gray-300 mb-2 uppercase font-bold"
              >
                {t("minRating")}: {minRating}
              </label>
              <input
                id="search-min-rating"
                type="range"
                min="0"
                max="10"
                step="1"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full accent-yellow-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SearchContent() {
  const t = useTranslations("SearchPage");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const params = new URLSearchParams({ lang: locale });
  for (const key of ["query", "type", "year", "minRating"]) {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  }
  // Nothing searched yet: suggest what is trending
  const { items, loading, error, hasMore, loadMore } = usePagedList(
    query
      ? `/api/search?${params.toString()}`
      : `/api/movie-list?lang=${locale}&type=trending`
  );

  return (
    <div className="text-white pt-8 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="text-yellow-400">{chunks}</span>
              ),
            })}
          </h1>
          {/* A new search in the address resets the fields to its values */}
          <SearchForm key={searchParams.toString()} />
        </div>

        {(items.length > 0 || loading) && (
          <h2 className="text-2xl font-bold text-gray-300 mb-8">
            {query ? (
              <>
                {t("resultsFor")}{" "}
                <span className="text-white">“{query}”</span>
              </>
            ) : (
              t("suggestions")
            )}
          </h2>
        )}

        <div
          id="media-list"
          className="scroll-mt-28 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {items.map((item) => (
            <MovieCard
              key={`${item.media_type}-${item.id}`}
              movie={item}
              media_type={item.media_type || (item.title ? "movie" : "tv")}
            />
          ))}
          {loading &&
            [...Array(items.length > 0 ? 5 : 20).keys()].map((i) => (
              <MovieCardSkeleton key={i} />
            ))}
        </div>

        {loading && <LoadingStatus />}

        {error && (
          <p role="alert" className="text-center text-red-400 py-10">
            {t("error")}
          </p>
        )}

        {hasMore && (
          <LoadMore
            gridId="media-list"
            count={items.length}
            loading={loading}
            failed={error}
            onLoadMore={loadMore}
          />
        )}
        <BackToTop gridId="media-list" />

        {query && !loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-300 font-medium">
              {t("noResults")} “{query}”
            </p>
            <p className="text-gray-400 mt-2">{t("tryAgain")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
