import assert from "node:assert/strict";
import test from "node:test";

import {
  isId,
  normalizeQuery,
  parseGenre,
  parsePage,
  parseYear,
} from "./params.ts";

test("pages stay within TMDB's 1-500", () => {
  for (const [input, page] of [[null, 1], ["", 1], ["abc", 1], ["-4", 1], ["0", 1], ["7", 7], ["501", 500], ["1e9", 1]])
    assert.equal(parsePage(input), page);
});

test("genres and years must be numeric", () => {
  assert.equal(parseGenre("37"), "37");
  assert.equal(parseYear("1999"), "1999");
  assert.equal(parseGenre("7001"), null);
  for (const year of ["1500", "3001", "0000"]) assert.equal(parseYear(year), null);
  for (const bad of [null, "", "x1", "28&api_key=1", "28,12", "12345678"]) {
    assert.equal(parseGenre(bad), null);
    assert.equal(parseYear(bad), null);
  }
});

test("equivalent searches share one query", () => {
  assert.equal(normalizeQuery("  The   MATRIX "), normalizeQuery("the matrix"));
  assert.equal(normalizeQuery(null), "");
  assert.equal(normalizeQuery("a".repeat(500)).length, 100);
});

test("ids have a single spelling", () => {
  for (const id of ["603", "0"]) assert.ok(isId(id));
  for (const id of ["603-matrix", "0603", "", "..", "1?x=1", "9999999999"])
    assert.ok(!isId(id), id);
});
