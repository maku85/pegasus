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

// Keeps only known, well-formed fields: the data may come from a user's file
function parseItem(value: unknown): WatchlistItem[] {
  if (typeof value !== "object" || value === null) return [];
  const { id, title, poster_path, media_type, vote_average, release_date } =
    value as Record<string, unknown>;

  if (!Number.isSafeInteger(id) || (id as number) <= 0) return [];
  if (typeof title !== "string" || !title) return [];
  if (media_type !== "movie" && media_type !== "tv") return [];

  return [
    {
      id: id as number,
      title: title.slice(0, 300),
      poster_path:
        typeof poster_path === "string" && /^\/[\w.-]+$/.test(poster_path)
          ? poster_path
          : null,
      media_type,
      ...(typeof vote_average === "number" && { vote_average }),
      ...(typeof release_date === "string" && {
        release_date: release_date.slice(0, 10),
      }),
    },
  ];
}

export function parseWatchlist(json: string | null): WatchlistItem[] {
  try {
    const data = JSON.parse(json ?? "[]");
    return Array.isArray(data) ? data.flatMap(parseItem) : [];
  } catch {
    return [];
  }
}

export function mergeWatchlists(
  current: WatchlistItem[],
  imported: WatchlistItem[]
): WatchlistItem[] {
  const merged = new Map(current.map((item) => [itemKey(item), item]));
  for (const item of imported) {
    if (!merged.has(itemKey(item))) merged.set(itemKey(item), item);
  }
  return [...merged.values()];
}
