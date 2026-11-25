type Placeholder = "poster" | "person" | "still";

export function tmdbImage(
  path: string | null | undefined,
  size: string = "w500",
  placeholder: Placeholder = "poster"
) {
  if (!path) return `/images/placeholders/${placeholder}.svg`;
  if (path.startsWith("/demo-")) return `/demo-image${path}`;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
