"use client";

import { type ComponentProps, useEffect, useRef, useState } from "react";

import type MovieCard from "@/components/media/MovieCard";
import { getNavigation } from "@/lib/navigation";

type Item = ComponentProps<typeof MovieCard>["movie"] & {
  media_type?: "movie" | "tv" | "person";
};

interface SavedList {
  items: Item[];
  page: number;
  hasMore: boolean;
  scrollY: number;
}

// Filters can empty a whole page: try a few more before asking the user
const MAX_EMPTY_PAGES = 5;

// Lists left by the user, to bring them back with the browser's back button
const savedLists = new Map<string, SavedList>();

// Identifies one visit in the history: going back finds the same entry
const historyEntry = () => getNavigation()?.currentEntry?.key;

// Browsers without the Navigation API: a recent popstate means back or forward
let lastPopState = Number.NEGATIVE_INFINITY;
if (typeof window !== "undefined") {
  window.addEventListener(
    "popstate",
    () => {
      lastPopState = performance.now();
    },
    true
  );
}
const cameFromHistory = () => performance.now() - lastPopState < 3000;

const itemKey = (item: Item) => `${item.media_type}-${item.id}`;

// `url` must already have a query string: the page number is appended to it.
// null means it is not known yet
export function usePagedList(url: string | null) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const loadMoreRef = useRef(() => {});

  useEffect(() => {
    if (!url) return;

    // Local to this url, so a late response can never reach another list
    const entry = historyEntry();
    const href = window.location.href;
    const savedKey = `${entry ?? ""} ${url}`;
    const saved =
      entry || cameFromHistory() ? savedLists.get(savedKey) : undefined;
    let ignore = false;
    let busy = false;
    let list = saved?.items ?? [];
    let page = saved?.page ?? 0;
    let hasMorePages = saved?.hasMore ?? true;
    let scrollY = saved?.scrollY ?? 0;

    async function loadMore(emptyPages = 0) {
      if (busy || !hasMorePages) return;
      busy = true;
      setLoading(true);
      setError(false);
      let added = 0;
      let failed = false;
      try {
        const res = await fetch(`${url}&page=${page + 1}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: { results: Item[]; total_pages: number } = await res.json();
        if (ignore) return;
        page += 1;
        hasMorePages = page < data.total_pages;
        // TMDB can repeat an item on the next page when rankings shift
        const seen = new Set(list.map(itemKey));
        const fresh = data.results.filter((i) => !seen.has(itemKey(i)));
        added = fresh.length;
        list = [...list, ...fresh];
        setItems(list);
      } catch (err) {
        if (ignore) return;
        console.error("Error loading list:", err);
        setError(true);
        failed = true;
      }
      busy = false;

      if (!failed && added === 0 && hasMorePages && emptyPages < MAX_EMPTY_PAGES) {
        loadMore(emptyPages + 1);
        return;
      }
      setLoading(false);
      setHasMore(hasMorePages);
    }
    loadMoreRef.current = () => loadMore();

    const handleScroll = () => {
      // Leaving the page scrolls to the top after the address has changed
      if (window.location.href === href) scrollY = window.scrollY;
    };

    setItems(list);
    setHasMore(saved?.hasMore ?? false);
    if (saved) {
      setLoading(false);
      setError(false);
      // Wait for the restored cards to be laid out
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!ignore) window.scrollTo(0, saved.scrollY);
        })
      );
    } else {
      loadMore();
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      ignore = true;
      window.removeEventListener("scroll", handleScroll);
      if (page > 0) {
        savedLists.set(savedKey, {
          items: list,
          page,
          hasMore: hasMorePages,
          scrollY,
        });
      }
    };
  }, [url]);

  const loadMore = () => loadMoreRef.current();

  return { items, loading, error, hasMore, loadMore };
}
