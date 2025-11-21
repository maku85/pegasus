import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "tv" ? "tv" : "movie";
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");

  const cookieName = `random_seen_${type}s`;
  const cookie = req.cookies.get(cookieName)?.value || "";
  const seenIds = cookie ? cookie.split(",").map(Number) : [];

  // Costruisci query base
  let query = `/${type === "tv" ? "discover/tv" : "discover/movie"}?language=it-IT&include_adult=false&vote_count.gte=100`;

  if (genre) query += `&with_genres=${genre}`;
  if (year) {
    if (type === "movie") query += `&primary_release_year=${year}`;
    else query += `&first_air_date_year=${year}`;
  }

  // 1. Ottieni il numero totale di pagine
  const initialFetch = await tmdbFetch(`${query}&page=1`);
  const totalPages = Math.min(initialFetch.total_pages, 500); // TMDB limita a 500 pagine

  let randomResult = null;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts && !randomResult) {
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    const pageData = await tmdbFetch(`${query}&page=${randomPage}`);

    // Filtra quelli già visti
    const results = pageData.results?.filter((item: any) => !seenIds.includes(item.id));

    if (results && results.length > 0) {
      randomResult = results[Math.floor(Math.random() * results.length)];
    }
    attempts++;
  }

  if (!randomResult) {
    // Se non troviamo nulla (o tutto visto), resetta cookie e riprova (o restituisci null)
    // Per semplicità, se non troviamo nulla dopo 10 tentativi, restituiamo null
    // Ma se è perché li abbiamo visti tutti, potremmo resettare.
    // Qui resettiamo solo se abbiamo fatto tentativi validi ma erano tutti seen.
    // Se la ricerca è troppo restrittiva, potrebbe non trovare nulla.

    const response = NextResponse.json({ id: null, type });
    // Opzionale: resetta cookie se vuoi ricominciare il giro
    // response.cookies.set(cookieName, "", { path: "/", httpOnly: false });
    return response;
  }

  // Aggiorna cookie
  const newSeen = Array.from(new Set([...seenIds, randomResult.id])).slice(-100);
  const response = NextResponse.json({ id: randomResult.id, type });
  response.cookies.set(cookieName, newSeen.join(","), { path: "/", httpOnly: false });

  return response;
}
