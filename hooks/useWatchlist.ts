"use client";

import { useSyncExternalStore } from "react";

import {
  itemKey,
  mergeWatchlists,
  parseWatchlist,
  type WatchlistItem,
} from "@/lib/watchlist";

const STORAGE_KEY = "watchlist";
const INITIAL = { watchlist: [] as WatchlistItem[], isLoaded: false };

// One store for the whole page: every MovieCard reads it
let state = INITIAL;
let askedToPersist = false;
const listeners = new Set<() => void>();

const publish = (watchlist: WatchlistItem[]) => {
  state = { watchlist, isLoaded: true };
  for (const listener of listeners) listener();
};

const save = (items: WatchlistItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  publish(items);

  // Ask the browser not to evict the list; it may refuse
  if (!askedToPersist) {
    askedToPersist = true;
    navigator.storage?.persist?.().catch(() => {});
  }
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
  save(wasInList ? others : [...others, item]);
};

// Returns how many titles were added, or null if the file holds none
const importWatchlist = (json: string) => {
  const imported = parseWatchlist(json);
  if (imported.length === 0) return null;
  const current = read();
  const merged = mergeWatchlists(current, imported);
  save(merged);
  return merged.length - current.length;
};

export function useWatchlist() {
  const { watchlist, isLoaded } = useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL
  );

  const isInWatchlist = (item: Pick<WatchlistItem, "id" | "media_type">) =>
    watchlist.some((w) => itemKey(w) === itemKey(item));

  return {
    watchlist,
    isLoaded,
    isInWatchlist,
    toggleWatchlist,
    importWatchlist,
  };
}
