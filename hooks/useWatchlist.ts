"use client";

import { useSyncExternalStore } from "react";

import { itemKey, parseWatchlist, type WatchlistItem } from "@/lib/watchlist";

const STORAGE_KEY = "watchlist";
const INITIAL = { watchlist: [] as WatchlistItem[], isLoaded: false };

// One store for the whole page: every MovieCard reads it
let state = INITIAL;
const listeners = new Set<() => void>();

const publish = (watchlist: WatchlistItem[]) => {
  state = { watchlist, isLoaded: true };
  for (const listener of listeners) listener();
};

const read = () => parseWatchlist(localStorage.getItem(STORAGE_KEY));

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!state.isLoaded) publish(read());
  return () => {
    listeners.delete(listener);
  };
}

const toggleWatchlist = (item: WatchlistItem) => {
  const wasInList = state.watchlist.some(
    (w) => itemKey(w) === itemKey(item)
  );
  // Read again: another tab may have changed the list
  const others = read().filter((w) => itemKey(w) !== itemKey(item));
  const items = wasInList ? others : [...others, item];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  publish(items);
};

export function useWatchlist() {
  const { watchlist, isLoaded } = useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL
  );

  const isInWatchlist = (item: Pick<WatchlistItem, "id" | "media_type">) =>
    watchlist.some((w) => itemKey(w) === itemKey(item));

  return { watchlist, isLoaded, isInWatchlist, toggleWatchlist };
}
