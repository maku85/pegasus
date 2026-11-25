import assert from "node:assert/strict";
import test from "node:test";

import { discoverPath } from "./discover.ts";

const today = new Date("2026-08-31T12:00:00Z");
const action = { genre: "28", providers: [], region: "IT" };

test("each category gives a different list for the same genre", () => {
  const paths = ["popular", "trending", "top_rated"].map((c) => discoverPath("movie", c, action, today));
  assert.equal(new Set(paths).size, 3);
  for (const path of paths) assert.match(path, /^\/discover\/movie\?with_genres=28&/);
});

test("trending covers the last six months, up to today", () => {
  const path = discoverPath("tv", "trending", action, today);
  assert.match(path, /air_date\.gte=2026-0[23]-\d\d/);
  assert.match(path, /air_date\.lte=2026-08-31/);
});

test("providers work alone and together with a genre", () => {
  const alone = discoverPath("movie", "popular", { genre: null, providers: [8, 337], region: "US" }, today);
  assert.match(alone, /watch_region=US&with_watch_providers=8%7C337&with_watch_monetization_types=flatrate/);
  assert.doesNotMatch(alone, /with_genres/);
  assert.match(discoverPath("tv", "top_rated", { ...action, providers: [8] }, today), /with_genres=28&watch_region=IT&with_watch_providers=8&/);
});

test("without providers the country is not part of the query", () => {
  assert.doesNotMatch(discoverPath("movie", "popular", action, today), /watch/);
});
