import { type Category, discoverPath, type MediaType } from "./discover";
import { parseGenre, parsePage } from "./params";
import { tmdbFetch } from "./tmdb";

const PATHS: Record<Category, (media: MediaType) => string> = {
  popular: (media) => `/${media}/popular`,
  trending: (media) => `/trending/${media}/week`,
  top_rated: (media) => `/${media}/top_rated`,
};

export async function getMediaList(media: MediaType, params: URLSearchParams) {
  const type = params.get("type") ?? "";
  const category = Object.hasOwn(PATHS, type) ? (type as Category) : "popular";
  const genre = parseGenre(params.get("genre"));
  const path = genre
    ? `${discoverPath(media, category, genre, new Date())}&`
    : `${PATHS[category](media)}?`;

  const data = await tmdbFetch(
    `${path}page=${parsePage(params.get("page"))}`,
    params.get("lang") || "it"
  );
  // TMDB rejects pages above 500
  data.total_pages = Math.min(data.total_pages, 500);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json",
    },
  });
}
