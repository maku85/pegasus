"use client";

import { useState, useEffect } from "react";

interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
}

export function useLocalWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    if (stored) {
      setWatchlist(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = (item: WatchlistItem) => {
    if (!watchlist.find((w) => w.id === item.id && w.media_type === item.media_type)) {
      setWatchlist([...watchlist, item]);
    }
  };

  const removeFromWatchlist = (id: number, media_type: "movie" | "tv") => {
    setWatchlist(watchlist.filter((w) => !(w.id === id && w.media_type === media_type)));
  };

  const isInWatchlist = (id: number, media_type: "movie" | "tv") => {
    return watchlist.some((w) => w.id === id && w.media_type === media_type);
  };

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, isLoaded };
}
