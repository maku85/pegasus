import { cookies } from "next/headers";

import { apiResponse } from "@/lib/apiResponse";
import { parseDecade, parseGenre } from "@/lib/params";
import { parseProviders, regionOf } from "@/lib/providers";
import { MAX_PAGES, pickRandom, randomPath } from "@/lib/random";
import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "tv" ? "tv" : "movie";
  const lang = searchParams.get("lang") || "it";
  const region = regionOf(lang);
  const filters = {
    genre: parseGenre(searchParams.get("genre")),
    providers: parseProviders(searchParams.get("providers"), region),
    region,
    decade: parseDecade(searchParams.get("decade")),
    isShort: searchParams.get("short") === "1",
  };

  const first = await tmdbFetch(
    `${randomPath(type, filters, "popularity")}&page=1`,
    lang
  );
  const totalPages = Math.min(first.total_pages, MAX_PAGES);
  const pages = [first.results];
  if (totalPages > 1) {
    // Half of the draws among the most voted titles: the popular ones are recent
    const order = Math.random() < 0.5 ? "popularity" : "vote_count";
    const page = Math.floor(Math.random() * totalPages) + 1;
    const second = await tmdbFetch(
      `${randomPath(type, filters, order)}&page=${page}`,
      lang
    );
    pages.unshift(second.results);
  }

  const cookieName = `random_seen_${type}s`;
  const store = await cookies();
  const { item, seen } = pickRandom<any>(
    pages,
    (store.get(cookieName)?.value ?? "").split(",").map(Number).filter(Boolean)
  );
  if (!item) return apiResponse({ item: null, total: 0 }, 0);

  store.set(cookieName, seen.join(","), { httpOnly: true, sameSite: "lax" });
  return apiResponse(
    {
      item: {
        id: item.id,
        media_type: type,
        title: item.title ?? item.name,
        overview: item.overview,
        poster_path: item.poster_path,
        release_date: item.release_date ?? item.first_air_date,
        vote_average: item.vote_average,
        vote_count: item.vote_count,
      },
      total: first.total_results,
    },
    0
  );
}
