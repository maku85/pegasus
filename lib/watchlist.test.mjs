import assert from "node:assert/strict";
import test from "node:test";

import { mergeWatchlists, parseWatchlist } from "./watchlist.ts";

const movie = { id: 1, title: "A", poster_path: "/a.jpg", media_type: "movie", vote_average: 7.5, release_date: "1999" };
const tv = { id: 1, title: "B", poster_path: null, media_type: "tv" };

test("an exported list is read back unchanged", () => {
  assert.deepEqual(parseWatchlist(JSON.stringify([tv, movie])), [tv, movie]);
});

test("missing or corrupted data gives an empty list", () => {
  for (const raw of [null, "", "{broken", "{}", "null", '"x"', "[null, 1, []]"])
    assert.deepEqual(parseWatchlist(raw), []);
});

test("invalid items are dropped, the valid ones stay", () => {
  const bad = [{ ...movie, id: "1" }, { ...movie, id: -1 }, { ...movie, id: 1.5 }, { ...movie, title: "" }, { ...movie, media_type: "person" }];
  assert.deepEqual(parseWatchlist(JSON.stringify([...bad, movie])), [movie]);
});

test("unexpected fields and unsafe posters are removed", () => {
  const [item] = parseWatchlist(JSON.stringify([{ ...movie, poster_path: "/../x?y", vote_average: "9", extra: 1 }]));
  assert.deepEqual(item, { id: 1, title: "A", poster_path: null, media_type: "movie", release_date: "1999" });
});

test("merging adds only new titles and keeps the existing ones", () => {
  assert.deepEqual(mergeWatchlists([movie], [{ ...movie, title: "Z" }, tv, tv]), [movie, tv]);
});
