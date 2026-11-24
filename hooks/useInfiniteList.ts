"use client";

import { type ComponentProps, useEffect, useState } from "react";

import type MovieCard from "@/components/media/MovieCard";

type Item = ComponentProps<typeof MovieCard>["movie"];

// `url` must already have a query string: the page number is appended to it
export function useInfiniteList(url: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Local to this url, so a late response can never reach another list
    let ignore = false;
    let busy = false;
    let page = 0;
    let hasMore = true;

    async function loadMore() {
      if (busy || !hasMore) return;
      busy = true;
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${url}&page=${page + 1}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: { results: Item[]; total_pages: number } = await res.json();
        if (ignore) return;
        page += 1;
        hasMore = page < data.total_pages;
        // TMDB can repeat an item on the next page when rankings shift
        setItems((prev) => {
          const seen = new Set(prev.map((item) => item.id));
          return [...prev, ...data.results.filter(({ id }) => !seen.has(id))];
        });
      } catch (err) {
        if (ignore) return;
        console.error("Error loading list:", err);
        setError(true);
      }
      busy = false;
      setLoading(false);
    }

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 500;
      if (scrollPosition >= threshold) loadMore();
    };

    setItems([]);
    loadMore();
    window.addEventListener("scroll", handleScroll);
    return () => {
      ignore = true;
      window.removeEventListener("scroll", handleScroll);
    };
  }, [url]);

  return { items, loading, error };
}
