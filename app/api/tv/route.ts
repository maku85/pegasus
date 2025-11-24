import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const lang = searchParams.get("lang") || "it";
  const data = await tmdbFetch(`/tv/popular?page=${page}`, lang);
  return new Response(JSON.stringify(data), { status: 200 });
}
