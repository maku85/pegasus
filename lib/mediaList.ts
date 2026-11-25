import { apiResponse } from "./apiResponse";
import { type Category, discoverPath, type MediaType } from "./discover";
import { parseGenre, parsePage } from "./params";
import { parseProviders, regionOf } from "./providers";
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
  const lang = params.get("lang") || "it";
  const region = regionOf(lang);
  const providers = parseProviders(params.get("providers"), region);
  const isFiltered = genre || providers.length > 0;
  const path = isFiltered
    ? `${discoverPath(media, category, { genre, providers, region }, new Date())}&`
    : `${PATHS[category](media)}?`;

  const data = await tmdbFetch(
    `${path}page=${parsePage(params.get("page"))}`,
    lang
  );
  // TMDB rejects pages above 500
  data.total_pages = Math.min(data.total_pages, 500);
  return apiResponse(data, 3600);
}
