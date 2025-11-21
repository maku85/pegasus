import { tmdbFetch } from "@/lib/tmdb";

export async function GET() {
  // Recupera la lista dei generi da TMDB
  const data = await tmdbFetch("/genre/movie/list?language=it-IT");
  return new Response(JSON.stringify(data), { status: 200 });
}
