import assert from "node:assert/strict";
import test from "node:test";

import { pickRandom, randomPath } from "./random.ts";

const items = (...ids) => ids.map((id) => ({ id }));
const filters = { genre: null, providers: [], region: "IT", decade: null, isShort: false };

test("three titles come out once each, then again, never twice in a row", () => {
  let seen = [];
  const drawn = [];
  for (let i = 0; i < 60; i++) {
    const pick = pickRandom([items(1, 2, 3)], seen);
    drawn.push(pick.item.id);
    seen = pick.seen;
  }
  assert.deepEqual(drawn.slice(0, 3).sort(), [1, 2, 3]);
  assert.ok(drawn.every((id, i) => id !== drawn[i - 1]));
  assert.equal(new Set(drawn.slice(3)).size, 3);
});

test("a page already seen falls back to the other one", () => {
  assert.equal(pickRandom([items(1, 2), items(3)], [1, 2]).item.id, 3);
  assert.equal(pickRandom([[], items(3)], []).item.id, 3);
});

test("a single title can come out again, no title gives nothing", () => {
  assert.equal(pickRandom([items(7)], [7]).item.id, 7);
  assert.deepEqual(pickRandom([[]], [7]), { item: null, seen: [7] });
});

test("starting again forgets only the titles of this draw", () => {
  const { item, seen } = pickRandom([items(1, 2)], [50, 1, 2]);
  assert.equal(item.id, 1);
  assert.deepEqual(seen, [50, 1]);
});

test("the list of seen titles stays short", () => {
  const old = Array.from({ length: 100 }, (_, i) => i + 1000);
  assert.equal(pickRandom([items(1)], old).seen.length, 100);
});

test("filters reach TMDB", () => {
  const all = { ...filters, genre: "37", providers: [8], decade: 1970, isShort: true };
  const path = randomPath("movie", all, "popularity");
  for (const part of ["with_genres=37", "watch_region=IT", "primary_release_date.gte=1970-01-01", "primary_release_date.lte=1979-12-31", "with_runtime.lte=100"])
    assert.ok(path.includes(part), part);
  assert.match(randomPath("tv", all, "popularity"), /first_air_date\.gte=1970/);
  assert.doesNotMatch(randomPath("tv", all, "popularity"), /runtime/);
  assert.doesNotMatch(randomPath("movie", filters, "vote_count"), /release_date|runtime|genres|watch/);
});
