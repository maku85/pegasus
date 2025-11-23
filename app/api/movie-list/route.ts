import { tmdbFetch } from "@/lib/tmdb";

const ENDPOINTS: Record<string, string> = {
  popular: "/movie/popular",
  trending: "/trending/movie/week",
  top_rated: "/movie/top_rated",
  discover: "/discover/movie",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "popular";
  const page = searchParams.get("page") || "1";
  const genre = searchParams.get("genre");
  const lang = searchParams.get("lang") || "it";
  let endpoint = ENDPOINTS[type] || ENDPOINTS.popular;
  // Se è selezionato un genere, usa discover
  if (genre) {
    endpoint = ENDPOINTS.discover + `&with_genres=${genre}`;
  }
  // Rimuovi language hardcoded dagli endpoint se presente, anche se tmdbFetch lo gestisce
  endpoint = endpoint.replace(/[?&]language=[a-zA-Z-]+/g, "");

  const data = await tmdbFetch(`${endpoint}&page=${page}`, lang);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json",
    },
  });
}
