import { notFound } from "next/navigation";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function tmdbFetch(path: string, locale: string = "it") {
  const tmdbLocale = locale === "en" ? "en-US" : "it-IT";

  // Rimuovi language=... se presente nel path per evitare duplicati
  const cleanPath = path.replace(/[?&]language=[a-zA-Z-]+/g, "");
  const finalSeparator = cleanPath.includes("?") ? "&" : "?";

  const token = process.env.TMDB_TOKEN ?? "";
  // TMDB issues v4 tokens (JWT, sent as Bearer) and v3 keys (sent in the URL)
  const isV4 = token.startsWith("eyJ");

  const res = await fetch(
    `${TMDB_BASE_URL}${cleanPath}${finalSeparator}language=${tmdbLocale}${
      isV4 ? "" : `&api_key=${token}`
    }`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(isV4 && { Authorization: `Bearer ${token}` }),
      },
      next: { revalidate: 86400 }, // cache server-side per 24 ore
    }
  );
  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error(`Errore TMDB: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function tmdbImage(path: string | null, size: string = "w500") {
  if (!path) return "/images/placeholders/poster-placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
