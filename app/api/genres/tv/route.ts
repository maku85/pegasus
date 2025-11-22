import { tmdbFetch } from "@/lib/tmdb";

export async function GET() {
    // Recupera la lista dei generi TV da TMDB
    const data = await tmdbFetch("/genre/tv/list?language=it-IT");
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Cache-Control": "public, max-age=86400",
            "Content-Type": "application/json",
        },
    });
}
