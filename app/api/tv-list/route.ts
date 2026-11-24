import { tmdbFetch } from "@/lib/tmdb";

const ENDPOINTS: Record<string, string> = {
  popular: "/tv/popular",
  trending: "/trending/tv/week",
  top_rated: "/tv/top_rated",
  discover: "/discover/tv",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "popular";
  const page = searchParams.get("page") || "1";
  const genre = searchParams.get("genre");
  const lang = searchParams.get("lang") || "it";
  let endpoint = ENDPOINTS[type] || ENDPOINTS.popular;

  if (genre) {
    endpoint = ENDPOINTS.discover;
    const separator = endpoint.includes("?") ? "&" : "?";
    endpoint += `${separator}with_genres=${encodeURIComponent(genre)}`;
  }

  endpoint = endpoint.replace(/[?&]language=[a-zA-Z-]+/g, "");

  const separator = endpoint.includes("?") ? "&" : "?";
  const data = await tmdbFetch(`${endpoint}${separator}page=${encodeURIComponent(page)}`, lang);
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
