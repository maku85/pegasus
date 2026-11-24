// Every distinct value reaching TMDB is an uncached call: accept only real ones

export const parsePage = (value: string | null) =>
  Math.min(Math.max(Number.parseInt(value ?? "", 10) || 1, 1), 500);

export const parseGenre = (value: string | null) =>
  value && /^\d{1,6}$/.test(value) ? value : null;

export const parseYear = (value: string | null) =>
  value && /^\d{4}$/.test(value) ? value : null;

export const normalizeQuery = (value: string | null) =>
  (value ?? "").trim().replace(/\s+/g, " ").toLowerCase().slice(0, 100);

export const isId = (value: string) => /^(0|[1-9]\d{0,8})$/.test(value);
