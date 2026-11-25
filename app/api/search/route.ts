import { apiResponse } from "@/lib/apiResponse";
import { normalizeQuery, parsePage, parseYear } from "@/lib/params";
import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = normalizeQuery(searchParams.get("query"));
  const typeParam = searchParams.get("type") || "";
  const type = ["movie", "tv"].includes(typeParam) ? typeParam : "multi";
  const year = parseYear(searchParams.get("year"));
  const minRating = searchParams.get("minRating");
  const lang = searchParams.get("lang") || "it";
  if (!query) {
    return apiResponse({ results: [], total_pages: 0 }, 600);
  }

  const page = parsePage(searchParams.get("page"));
  let endpoint = `/search/${type}?query=${encodeURIComponent(query)}&page=${page}`;

  if (year) {
    if (type === "movie") {
      endpoint += `&primary_release_year=${year}`;
    } else if (type === "tv") {
      endpoint += `&first_air_date_year=${year}`;
    }
  }

  const data = await tmdbFetch(endpoint, lang);
  let results = data.results || [];

  if (minRating) {
    const rating = parseFloat(minRating);
    results = results.filter((item: any) => (item.vote_average || 0) >= rating);
  }

  if (type === "multi" && year) {
    results = results.filter((item: any) => {
      const date = item.release_date || item.first_air_date;
      return date && date.startsWith(year);
    });
  }

  return apiResponse(
    { ...data, results, total_pages: Math.min(data.total_pages, 500) },
    600
  );
}
