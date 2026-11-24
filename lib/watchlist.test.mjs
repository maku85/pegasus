import assert from "node:assert/strict";
import test from "node:test";

import { itemKey, parseWatchlist } from "./watchlist.ts";

test("a movie and a series with the same id have different keys", () => {
  assert.notEqual(
    itemKey({ id: 1, media_type: "movie" }),
    itemKey({ id: 1, media_type: "tv" })
  );
});

test("a saved list is read back in order", () => {
  const items = [{ id: 2 }, { id: 1 }];
  assert.deepEqual(parseWatchlist(JSON.stringify(items)), items);
});

test("missing or corrupted storage gives an empty list", () => {
  for (const raw of [null, "", "{broken", "{}", "null"])
    assert.deepEqual(parseWatchlist(raw), []);
});
