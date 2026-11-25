import { type Filters, filterParams, type MediaType } from "./discover.ts";

export interface RandomFilters extends Filters {
  decade: number | null;
  isShort: boolean;
}

// Few pages, so picks come mostly from cache: 25 pages are 500 titles per order
export const MAX_PAGES = 25;
const MAX_SEEN = 100;

// Both orders hold the same titles, so a page of one exists in the other too
export function randomPath(
  media: MediaType,
  filters: RandomFilters,
  order: "popularity" | "vote_count"
) {
  const params = [
    ...filterParams(filters),
    "include_adult=false",
    "vote_count.gte=100",
    `sort_by=${order}.desc`,
  ];
  if (filters.decade) {
    const field = media === "movie" ? "primary_release_date" : "first_air_date";
    params.push(
      `${field}.gte=${filters.decade}-01-01`,
      `${field}.lte=${filters.decade + 9}-12-31`
    );
  }
  // From 40 minutes: shorter ones are short films
  if (filters.isShort && media === "movie") {
    params.push("with_runtime.gte=40", "with_runtime.lte=100");
  }
  return `/discover/${media}?${params.join("&")}`;
}

// A title not seen yet from the first page that has one. When all have been
// seen it starts again, without repeating the latest one
export function pickRandom<T extends { id: number }>(
  pages: T[][],
  seen: number[],
  random: () => number = Math.random
) {
  const choose = (items: T[]) => items[Math.floor(random() * items.length)];
  const all = pages.flat();
  const ids = new Set(all.map(({ id }) => id));

  for (const page of pages) {
    const unseen = page.filter(({ id }) => !seen.includes(id));
    if (unseen.length > 0) {
      const item = choose(unseen);
      return { item, seen: [...seen, item.id].slice(-MAX_SEEN) };
    }
  }

  const others = all.filter(({ id }) => id !== seen.at(-1));
  const item = all.length > 0 ? choose(others.length > 0 ? others : all) : null;
  return {
    item,
    seen: item ? [...seen.filter((id) => !ids.has(id)), item.id] : seen,
  };
}
