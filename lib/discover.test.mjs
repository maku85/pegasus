import assert from "node:assert/strict";
import test from "node:test";

import { discoverPath } from "./discover.ts";

const today = new Date("2026-08-31T12:00:00Z");

test("each category gives a different list for the same genre", () => {
  const paths = ["popular", "trending", "top_rated"].map((c) => discoverPath("movie", c, "28", today));
  assert.equal(new Set(paths).size, 3);
  for (const path of paths) assert.match(path, /^\/discover\/movie\?with_genres=28&/);
});

test("trending covers the last six months, up to today", () => {
  const path = discoverPath("tv", "trending", "18", today);
  assert.match(path, /air_date\.gte=2026-0[23]-\d\d/);
  assert.match(path, /air_date\.lte=2026-08-31/);
});
