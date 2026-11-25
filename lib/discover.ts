import type { Region } from "./providers";

export type MediaType = "movie" | "tv";
export type Category = "popular" | "trending" | "top_rated";

interface Filters {
  genre: string | null;
  providers: number[];
  region: Region;
}

// TMDB lists take no filters, so each category becomes a discover query
export function discoverPath(
  media: MediaType,
  category: Category,
  { genre, providers, region }: Filters,
  today: Date
) {
  const params: string[] = [];
  if (genre) params.push(`with_genres=${genre}`);
  if (providers.length > 0) {
    // %7C is "|": available on any of them
    params.push(
      `watch_region=${region}`,
      `with_watch_providers=${providers.join("%7C")}`,
      "with_watch_monetization_types=flatrate"
    );
  }

  if (category === "top_rated") {
    params.push("sort_by=vote_average.desc", "vote_count.gte=300");
  } else {
    params.push("sort_by=popularity.desc");
  }
  if (category === "trending") {
    // shortcut: "trending" is what is popular among the last 6 months
    const since = new Date(today);
    since.setUTCMonth(since.getUTCMonth() - 6);
    const field = media === "movie" ? "primary_release_date" : "air_date";
    const day = (date: Date) => date.toISOString().slice(0, 10);
    params.push(`${field}.gte=${day(since)}`, `${field}.lte=${day(today)}`);
  }
  return `/discover/${media}?${params.join("&")}`;
}
