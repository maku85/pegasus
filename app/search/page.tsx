"use client";

import { useState } from "react";
import Link from "next/link";
import { tmdbImage } from "@/lib/tmdb";
import { FaSearch, FaSpinner } from "react-icons/fa";
import MovieCard from "@/components/media/MovieCard";
import MovieCardSkeleton from "@/components/media/MovieCardSkeleton";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("multi");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams({
        query,
        type,
        ...(year && { year }),
        ...(minRating !== "0" && { minRating }),
      });
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 md:pt-32 pb-20 px-6">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Search Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">
            Cosa vuoi <span className="text-blue-500">guardare</span> oggi?
          </h1>

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
            <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all duration-300">
              <FaSearch className="text-gray-400 ml-4 text-xl" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca film, serie TV, attori..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 px-4 py-2 md:py-3 text-base md:text-lg font-medium w-full"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <><span className="hidden md:inline">Cerca</span><FaSearch className="md:hidden" /></>}
              </button>
            </div>
          </form>

          {/* Filters Toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              {showFilters ? "Nascondi Filtri" : "Mostra Filtri Avanzati"}
            </button>

            {showFilters && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 text-left animate-in fade-in slide-in-from-top-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Tipo</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="multi">Tutti</option>
                    <option value="movie">Film</option>
                    <option value="tv">Serie TV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Anno</label>
                  <input
                    type="number"
                    placeholder="Es. 2023"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Voto Minimo: {minRating}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-300 mb-8 px-2">
                  Risultati per <span className="text-white">"{query}"</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.map((item: any) => (
                    <MovieCard
                      key={item.id}
                      movie={item}
                      media_type={item.media_type || (item.first_air_date ? "tv" : "movie")}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-400 font-medium">
                  Nessun risultato trovato per "{query}"
                </p>
                <p className="text-gray-500 mt-2">Prova a cercare qualcos'altro.</p>
              </div>
            )
          ) : (
            <div className="text-center py-20 opacity-50">
              <p className="text-xl text-gray-500">Inizia a digitare per cercare...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
