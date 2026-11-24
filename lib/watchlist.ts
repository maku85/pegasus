export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
  vote_average?: number;
  release_date?: string;
}

// TMDB ids overlap between movies and TV series
export const itemKey = (item: Pick<WatchlistItem, "id" | "media_type">) =>
  `${item.media_type}-${item.id}`;

export function parseWatchlist(json: string | null): WatchlistItem[] {
  try {
    const data = JSON.parse(json ?? "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
