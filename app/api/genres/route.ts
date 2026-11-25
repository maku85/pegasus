import { apiResponse } from "@/lib/apiResponse";
import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "it";
  const data = await tmdbFetch("/genre/movie/list", lang);
  return apiResponse(data, 86400);
}
