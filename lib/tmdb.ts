const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Funzione per fare fetch sicuri verso TMDB.
 * @param path - endpoint TMDB, es. "/movie/popular?page=1"
 * @param locale - lingua richiesta (es. "it", "en"), default "it"
 * @returns JSON dei dati TMDB
 */
export async function tmdbFetch(path: string, locale: string = "it") {
  const separator = path.includes("?") ? "&" : "?";
  const tmdbLocale = locale === "en" ? "en-US" : "it-IT";

  // Rimuovi language=... se presente nel path per evitare duplicati
  const cleanPath = path.replace(/[?&]language=[a-zA-Z-]+/g, "");
  const finalSeparator = cleanPath.includes("?") ? "&" : "?";

  const res = await fetch(`${TMDB_BASE_URL}${cleanPath}${finalSeparator}api_key=${process.env.TMDB_TOKEN}&language=${tmdbLocale}`, {
    headers: {
      //Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      "Content-Type": "application/json"
    },
    next: { revalidate: 86400 } // cache server-side per 24 ore
  });

  if (!res.ok) {
    throw new Error(`Errore TMDB: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Helper per costruire URL delle immagini TMDB
 * @param path - path restituito da TMDB (poster_path, backdrop_path)
 * @param size - w200 | w300 | w500 | w780 | original
 * @returns URL completo immagine
 */
export function tmdbImage(path: string | null, size: string = "w500") {
  if (!path) return "/images/placeholders/poster-placeholder.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
