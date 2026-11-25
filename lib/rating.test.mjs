import assert from "node:assert/strict";
import test from "node:test";

import { formatRating } from "./rating.ts";

test("a rating needs enough votes to be shown", () => {
  assert.equal(formatRating(10, 1), null);
  assert.equal(formatRating(8.16, 9), null);
  assert.equal(formatRating(8.16, 10), "8.2");
});

test("no votes, no rating; an unknown count is trusted", () => {
  assert.equal(formatRating(0, 0), null);
  assert.equal(formatRating(undefined, 50), null);
  assert.equal(formatRating(7, undefined), "7.0");
});
