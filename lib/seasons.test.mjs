import assert from "node:assert/strict";
import test from "node:test";

import { adjacentSeasons } from "./seasons.ts";

const season = (season_number, episode_count = 10) => ({ season_number, episode_count, name: `S${season_number}` });
const numbers = (seasons, current) => {
  const { previous, next } = adjacentSeasons(seasons, current);
  return [previous?.season_number, next?.season_number];
};
const show = [season(0), season(1), season(2), season(4), season(5, 0)];

test("moves between seasons, over gaps and past the ends", () => {
  assert.deepEqual(numbers(show, 1), [undefined, 2]);
  assert.deepEqual(numbers(show, 2), [1, 4]);
});

test("specials follow the last season that has episodes", () => {
  assert.deepEqual(numbers(show, 4), [2, 0]);
  assert.deepEqual(numbers(show, 0), [4, undefined]);
});

test("an announced season without episodes is reached only directly", () => {
  assert.deepEqual(numbers(show, 5), [4, 0]);
});

test("a single or unknown season has no neighbours", () => {
  assert.deepEqual(numbers([season(1)], 1), [undefined, undefined]);
  assert.deepEqual(numbers(show, 9), [undefined, undefined]);
  assert.deepEqual(numbers([], 1), [undefined, undefined]);
});
