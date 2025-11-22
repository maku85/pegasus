import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type") || "multi"; // multi, movie, tv
  const year = searchParams.get("year");
  const minRating = searchParams.get("minRating");

  if (!query) {
    return new Response(JSON.stringify({ results: [] }), { status: 200 });
  }

  let endpoint = `/search/${type}?query=${encodeURIComponent(query)}&language=it-IT`;

  // Add year filter if applicable
  if (year) {
    if (type === "movie") {
      endpoint += `&primary_release_year=${year}`;
    } else if (type === "tv") {
      endpoint += `&first_air_date_year=${year}`;
    }
    // 'multi' search doesn't support year filtering directly in the same way for mixed results easily via one param, 
    // but we can try to filter post-fetch or just ignore it for multi if strictness is needed.
    // However, let's stick to type-specific for year filtering to be accurate.
  }

  const data = await tmdbFetch(endpoint);

  let results = data.results || [];

  // Client-side filtering for rating (and year for 'multi' if we wanted, but let's just do rating)
  if (minRating) {
    const rating = parseFloat(minRating);
    results = results.filter((item: any) => (item.vote_average || 0) >= rating);
  }

  // If type is multi but year was requested, we might want to filter manually
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
