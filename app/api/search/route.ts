import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify({ results: [] }), { status: 200 });
  }

  const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&language=it-IT`);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=600",
      "Content-Type": "application/json",
    },
  });
}
