import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  const data = await tmdbFetch(`/tv/popular?language=it-IT&page=${page}`);
  return new Response(JSON.stringify(data), { status: 200 });
}
