"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaDice, FaFilter, FaTimes } from "react-icons/fa";

const GENRES_MOVIE = [
  { id: 28, name: "Azione" }, { id: 12, name: "Avventura" }, { id: 16, name: "Animazione" },
  { id: 35, name: "Commedia" }, { id: 80, name: "Crime" }, { id: 99, name: "Documentario" },
  { id: 18, name: "Drammatico" }, { id: 10751, name: "Famiglia" }, { id: 14, name: "Fantasy" },
  { id: 36, name: "Storia" }, { id: 27, name: "Horror" }, { id: 10402, name: "Musica" },
  { id: 9648, name: "Mistero" }, { id: 10749, name: "Romance" }, { id: 878, name: "Fantascienza" },
  { id: 10770, name: "TV Movie" }, { id: 53, name: "Thriller" }, { id: 10752, name: "Guerra" },
  { id: 37, name: "Western" }
];

const GENRES_TV = [
  { id: 10759, name: "Action & Adventure" }, { id: 16, name: "Animazione" }, { id: 35, name: "Commedia" },
  { id: 80, name: "Crime" }, { id: 99, name: "Documentario" }, { id: 18, name: "Drammatico" },
  { id: 10751, name: "Famiglia" }, { id: 10762, name: "Kids" }, { id: 9648, name: "Mistero" },
  { id: 10763, name: "News" }, { id: 10764, name: "Reality" }, { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" }, { id: 10767, name: "Talk" }, { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" }
];

export default function RandomMoviePage() {
  const router = useRouter();
  const [currentText, setCurrentText] = useState("Pronto?");
  const [isFound, setIsFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [type, setType] = useState<"movie" | "tv">("movie");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const genres = type === "movie" ? GENRES_MOVIE : GENRES_TV;

  const startSearch = async () => {
    setIsSearching(true);
    setIsFound(false);
    setShowFilters(false);

    // Shuffle effect
    const interval = setInterval(() => {
      const randomGenre = genres[Math.floor(Math.random() * genres.length)].name;
      setCurrentText(`Cercando ${randomGenre}...`);
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
      const data = await res.json();

      clearInterval(interval);

      if (data.id) {
        setIsFound(true);
        setCurrentText("Trovato!");
        setTimeout(() => {
          router.replace(data.type === "tv" ? `/tv/${data.id}` : `/movies/${data.id}`);
        }, 500);
      } else {
        setIsSearching(false);
        setCurrentText("Nessun risultato trovato con questi filtri.");
      }
    } catch (error) {
      console.error("Error fetching random movie:", error);
      clearInterval(interval);
      setIsSearching(false);
      setCurrentText("Errore durante la ricerca.");
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="z-10 w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="mb-8 relative inline-block">
            <FaDice className={`text-7xl mx-auto ${isFound ? 'text-green-500' : 'text-yellow-500'} ${isSearching ? 'animate-spin-slow' : ''}`} />
          </div>

          <h1 className="text-3xl font-black mb-2 tracking-tight">
            {isFound ? "Trovato!" : "Cosa guardiamo oggi?"}
          </h1>

          <div className="h-8 mb-8 text-gray-400 font-medium">
            {currentText}
          </div>

          {!isSearching && (
            <div className="flex flex-col gap-4">
              <button
                onClick={startSearch}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Gira la Ruota! 🎲
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <FaFilter /> {showFilters ? "Chiudi Filtri" : "Imposta Filtri"}
              </button>
            </div>
          )}
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 bg-gray-900/90 backdrop-blur-md p-6 rounded-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filtri di Ricerca</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Tipo</label>
                  <div className="flex bg-black/50 rounded-lg p-1">
                    <button
                      onClick={() => setType("movie")}
                      className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${type === "movie" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      Film
                    </button>
                    <button
                      onClick={() => setType("tv")}
                      className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${type === "tv" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      Serie TV
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Genere</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Qualsiasi</option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Anno (Opzionale)</label>
                  <input
                    type="number"
                    placeholder="Es. 2023"
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
