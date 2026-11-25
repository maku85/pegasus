// Every distinct value reaching TMDB is an uncached call: accept only real ones

export const parsePage = (value: string | null) =>
  Math.min(Math.max(Number.parseInt(value ?? "", 10) || 1, 1), 500);

// TMDB's movie and TV genres
const GENRES = new Set([
  12, 14, 16, 18, 27, 28, 35, 36, 37, 53, 80, 99, 878, 9648, 10402, 10749,
  10751, 10752, 10759, 10762, 10763, 10764, 10765, 10766, 10767, 10768, 10770,
]);

export const parseGenre = (value: string | null) =>
  value && /^\d{2,5}$/.test(value) && GENRES.has(Number(value)) ? value : null;

export const parseYear = (value: string | null) =>
  value &&
  /^\d{4}$/.test(value) &&
  Number(value) >= 1880 &&
  Number(value) <= new Date().getFullYear() + 10
    ? value
    : null;

// Newest first. Decades rather than years: fewer distinct queries
export function decades() {
  const list: number[] = [];
  const current = Math.floor(new Date().getFullYear() / 10) * 10;
  for (let decade = current; decade >= 1950; decade -= 10) list.push(decade);
  return list;
}

export const parseDecade = (value: string | null) =>
  decades().find((decade) => String(decade) === value) ?? null;

export const normalizeQuery = (value: string | null) =>
  (value ?? "").trim().replace(/\s+/g, " ").toLowerCase().slice(0, 100);

export const isId = (value: string) => /^(0|[1-9]\d{0,8})$/.test(value);
