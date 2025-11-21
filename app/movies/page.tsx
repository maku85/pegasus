"use client";


import MovieCard from "@/components/media/MovieCard";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Genre {
  id: number;
  name: string;
}


const ENDPOINTS = {
  popular: "/movie/popular?language=it-IT",
  trending: "/trending/movie/week?language=it-IT",
  top_rated: "/movie/top_rated?language=it-IT",
};

import { Suspense } from "react";

import { motion } from "framer-motion";
import MovieFilters from "@/components/media/MovieFilters";

function MoviesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get('category') as 'popular' | 'trending' | 'top_rated') || 'popular';
  const initialGenre = searchParams.get('genre') || '';
  const [filter, setFilter] = useState<'popular' | 'trending' | 'top_rated'>(initialFilter);
  const [genre, setGenre] = useState<string>(initialGenre);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);

  // Aggiorna filtro e genere se cambia la query nell'URL
  useEffect(() => {
    const urlFilter = (searchParams.get('category') as 'popular' | 'trending' | 'top_rated') || 'popular';
    setFilter(urlFilter);
    setGenre(searchParams.get('genre') || '');
  }, [searchParams]);

  // Recupera la lista dei generi una sola volta
  useEffect(() => {
    fetch('/api/genres')
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []));
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchMovies() {
      setLoading(true);
      setItems([]);
      setPage(1);
      setHasMore(true);
      let url = `/api/movie-list?type=${filter}&page=1`;
      if (genre) url += `&genre=${genre}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!ignore) {
        setItems(data.results || []);
        setHasMore(data.page < data.total_pages);
        setLoading(false);
      }
    }
    fetchMovies();
    return () => { ignore = true; };
  }, [filter, genre]);

  useEffect(() => {
    if (!hasMore || loading) return;
    const handleScroll = () => {
      if (!hasMore || loading) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 500;
      if (scrollPosition >= threshold) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, filter]);

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    let url = `/api/movie-list?type=${filter}&page=${nextPage}`;
    if (genre) url += `&genre=${genre}`;
    const res = await fetch(url);
    const data = await res.json();
    setItems((prev: any[]) => [...prev, ...(data.results || [])]);
    setPage(nextPage);
    setHasMore(nextPage < data.total_pages);
    setLoading(false);
  }

  const handleCategoryChange = (newCategory: 'popular' | 'trending' | 'top_rated') => {
    const params = new URLSearchParams(window.location.search);
    params.set('category', newCategory);
    params.delete('genre');
    router.push(`?${params.toString()}`);
  };

  const handleGenreChange = (newGenreId: string) => {
    const params = new URLSearchParams(window.location.search);
    if (newGenreId) {
      params.set('genre', newGenreId);
    } else {
      params.delete('genre');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-10 pt-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
          Esplora il Catalogo
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Scopri i film più popolari, le ultime uscite e i capolavori acclamati dalla critica.
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
        {items.map((movie: any, index: number) => (
          <motion.div
            key={`${movie.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <MovieCard
              movie={movie}
              media_type="movie"
              className="h-full"
            />
          </motion.div>
        ))}

        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[150px] h-[300px] bg-gray-800/50 animate-pulse rounded-2xl"
            ></div>
          ))}
      </motion.div>
    </div>
  );
}

export default function MoviesListPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Caricamento...</div>}>
      <MoviesListContent />
    </Suspense>
  );
}
