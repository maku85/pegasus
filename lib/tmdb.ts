import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";

import { isId } from "./params";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const DAY = 86400;

export function requireIds(...values: string[]) {
  if (!values.every(isId)) notFound();
}

// Null is "TMDB does not have it": returned, not thrown, so it is cached too
// and made-up addresses cost one call only
async function requestTmdb(path: string, locale: string) {
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
      cache: "no-store",
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Errore TMDB: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// `cache` shares the answer between a page and its metadata
const cachedTmdb = cache((path: string, language: string, revalidate: number) =>
  unstable_cache(() => requestTmdb(path, language), ["tmdb", path, language], {
    revalidate,
  })()
);

export async function tmdbFetch(
  path: string,
  locale: string = "it",
  revalidate: number = DAY
) {
  const language = locale === "en" ? "en" : "it";
  let data: any;
  if (process.env.DEMO === "1") {
    const { demoResponse } = await import("./demo");
    data = demoResponse(path, language);
  } else {
    data = await cachedTmdb(path, language, revalidate);
  }
  if (data === null) notFound();
  return data;
}

// Text in the page's language, or the English one when TMDB has no translation
export async function withEnglishOverview(
  overview: string | undefined,
  path: string,
  locale: string,
  revalidate: number = DAY
) {
  if (overview || locale === "en") {
    return { text: overview ?? "", isEnglish: false };
  }
  const { overview: english } = await tmdbFetch(path, "en", revalidate);
  return { text: (english as string) ?? "", isEnglish: Boolean(english) };
}
