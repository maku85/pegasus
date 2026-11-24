import { NextRequest, NextResponse } from "next/server";
import { parseGenre, parseYear } from "@/lib/params";
import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "tv" ? "tv" : "movie";
  const genre = parseGenre(searchParams.get("genre"));
  const year = parseYear(searchParams.get("year"));

  const cookieName = `random_seen_${type}s`;
  const cookie = req.cookies.get(cookieName)?.value || "";
  const seenIds = cookie ? cookie.split(",").map(Number) : [];

  let query = `/${
    type === "tv" ? "discover/tv" : "discover/movie"
  }?include_adult=false&vote_count.gte=100`;

  if (genre) query += `&with_genres=${genre}`;
  if (year) {
    if (type === "movie") query += `&primary_release_year=${year}`;
    else query += `&first_air_date_year=${year}`;
  }

  const initialFetch = await tmdbFetch(`${query}&page=1`);
  // Few pages, so picks come mostly from cache: 25 pages are 500 titles per filter
  const totalPages = Math.min(initialFetch.total_pages, 25);

  let randomResult = null;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts && !randomResult) {
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    const pageData = await tmdbFetch(`${query}&page=${randomPage}`);
    const results = pageData.results?.filter(
      (item: any) => !seenIds.includes(item.id)
    );
    if (results && results.length > 0) {
      randomResult = results[Math.floor(Math.random() * results.length)];
    }
    attempts++;
  }

  if (!randomResult) {
    const response = NextResponse.json({ id: null, type });
    return response;
  }

  const newSeen = Array.from(new Set([...seenIds, randomResult.id])).slice(
    -100
  );
  const response = NextResponse.json({ id: randomResult.id, type });
  response.cookies.set(cookieName, newSeen.join(","), {
    path: "/",
    httpOnly: false,
  });

  return response;
}
