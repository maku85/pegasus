import assert from "node:assert/strict";
import test from "node:test";

import { buildFilmography, creditPeriod, mostVoted } from "./credits.ts";

const film = (id, year, more) => ({ id, media_type: "movie", title: `F${id}`, release_date: year && `${year}-01-01`, ...more });
const keys = (sections) => sections.map((s) => s.key);

test("a director's own films come first, interviews last", () => {
  const sections = buildFilmography(
    {
      cast: [film(1, 2020, { character: "Self" }), film(2, 2010, { character: "Man in bar" }), film(9, 2021, { character: "Himself - Host" })],
      crew: [film(3, 2000, { department: "Directing", job: "Director" }), film(3, 2000, { department: "Writing", job: "Writer" }), film(8, 2001, { department: "Sound", job: "Composer" })],
    },
    "Directing"
  );
  assert.deepEqual(keys(sections), ["Directing", "Acting", "Writing", "Sound", "Self"]);
  assert.deepEqual(sections[0].credits.map((c) => c.id), [3]);
  assert.deepEqual(sections.at(-1).credits.map((c) => c.id), [9, 1]);
});

test("a title appears once per section, with all its roles", () => {
  const job = (j) => film(1, 2000, { department: "Writing", job: j });
  const [writing] = buildFilmography({ crew: [job("Story"), job("Screenplay"), job("Story")] }, "Writing");
  assert.equal(writing.credits.length, 1);
  assert.deepEqual(writing.credits[0].roles, ["Story", "Screenplay"]);
});

test("a movie and a series with the same id stay separate", () => {
  const [acting] = buildFilmography({ cast: [film(1, 2000), { ...film(1), media_type: "tv", first_air_date: "2005-01-01" }] }, "Acting");
  assert.deepEqual(acting.credits.map((c) => c.media_type), ["tv", "movie"]);
});

test("newest first, undated last, thanks ignored", () => {
  const sections = buildFilmography({ cast: [film(1), film(2, 1990), film(3, 2030)], crew: [film(4, 2000, { department: "Crew", job: "Thanks" })] }, "Acting");
  assert.deepEqual(keys(sections), ["Acting"]);
  assert.deepEqual(sections[0].credits.map((c) => c.id), [3, 2, 1]);
});

test("self is a role, not a word inside a name", () => {
  const [section] = buildFilmography({ cast: [film(1, 2000, { character: "Selfridge" }), film(2, 2001, { character: "Will Self" })] }, "Acting");
  assert.equal(section.key, "Acting");
  assert.equal(section.credits.length, 2);
});

test("known for uses the main work, and empty people do not break", () => {
  const sections = buildFilmography({ cast: [film(1, 2000, { vote_count: 9 }), film(2, 2001, { vote_count: 50 })], crew: [] }, "Acting");
  assert.deepEqual(mostVoted(sections, 1).map((c) => c.id), [2]);
  assert.deepEqual(buildFilmography(undefined, "Acting"), []);
  assert.deepEqual(mostVoted([], 10), []);
});

test("periods", () => {
  assert.deepEqual(["2027-01-01", "2026-06-01", "1994-01-01", ""].map((d) => creditPeriod(d, "2026-11-25")), ["upcoming", "2020", "1990", "undated"]);
});
