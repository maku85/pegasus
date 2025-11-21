"use client";

import { useState, useEffect } from "react";

export function useInfiniteMovies() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await fetch(`/api/movie?page=${page}`);
    const data = await res.json();
    console.log('API /api/movie response', data);

    if (Array.isArray(data.results)) {
      setItems((prev) => [...prev, ...data.results]);
      setPage((prev) => prev + 1);
      if (page >= data.total_pages) setHasMore(false);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
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
  }, [loading, hasMore, page]);

  useEffect(() => {
    loadMore();
  }, []);

  return { items, loading, hasMore };
}


export function useInfiniteTV() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await fetch(`/api/tv?page=${page}`);
    const data = await res.json();

    setItems((prev) => [...prev, ...data.results]);
    setPage((prev) => prev + 1);
    if (page >= data.total_pages) setHasMore(false);

    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return { items, loadMore, loading, hasMore };
}
