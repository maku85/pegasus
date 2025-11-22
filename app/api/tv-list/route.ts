import { tmdbFetch } from "@/lib/tmdb";

const ENDPOINTS: Record<string, string> = {
    popular: "/tv/popular?language=it-IT",
    trending: "/trending/tv/week?language=it-IT",
    top_rated: "/tv/top_rated?language=it-IT",
    discover: "/discover/tv?language=it-IT",
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "popular";
    const page = searchParams.get("page") || "1";
    const genre = searchParams.get("genre");
    let endpoint = ENDPOINTS[type] || ENDPOINTS.popular;
    // Se è selezionato un genere, usa discover
    if (genre) {
        endpoint = ENDPOINTS.discover + `&with_genres=${genre}`;
    }
    const data = await tmdbFetch(`${endpoint}&page=${page}`);
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Cache-Control": "public, max-age=3600",
            "Content-Type": "application/json",
        },
    });
}
