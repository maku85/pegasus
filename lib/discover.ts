export type MediaType = "movie" | "tv";
export type Category = "popular" | "trending" | "top_rated";

// TMDB lists have no genre filter, so each category becomes a discover query
export function discoverPath(
  media: MediaType,
  category: Category,
  genre: string,
  today: Date
) {
  let filters = "sort_by=popularity.desc";
  if (category === "top_rated") {
    filters = "sort_by=vote_average.desc&vote_count.gte=300";
  } else if (category === "trending") {
    // shortcut: "trending" is what is popular among the last 6 months
    const since = new Date(today);
    since.setUTCMonth(since.getUTCMonth() - 6);
    const field = media === "movie" ? "primary_release_date" : "air_date";
    const day = (date: Date) => date.toISOString().slice(0, 10);
    filters += `&${field}.gte=${day(since)}&${field}.lte=${day(today)}`;
  }
  return `/discover/${media}?with_genres=${genre}&${filters}`;
}
