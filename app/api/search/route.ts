import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const typeParam = searchParams.get("type") || "";
  const type = ["movie", "tv"].includes(typeParam) ? typeParam : "multi";
  const year = searchParams.get("year");
  const minRating = searchParams.get("minRating");
  const lang = searchParams.get("lang") || "it";
  if (!query) {
    return new Response(JSON.stringify({ results: [] }), { status: 200 });
  }

  let endpoint = `/search/${type}?query=${encodeURIComponent(query)}`;

  if (year) {
    if (type === "movie") {
      endpoint += `&primary_release_year=${encodeURIComponent(year)}`;
    } else if (type === "tv") {
      endpoint += `&first_air_date_year=${encodeURIComponent(year)}`;
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

  return new Response(JSON.stringify({ ...data, results }), {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=600",
      "Content-Type": "application/json",
    },
  });
}
