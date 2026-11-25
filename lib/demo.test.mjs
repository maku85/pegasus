import assert from "node:assert/strict";
import test from "node:test";

import { demoResponse } from "./demo.ts";
import { collection, people, titles } from "./demoData.ts";
import { demoImage } from "./demoImages.ts";

const imagesIn = (value) => [...new Set(JSON.stringify(value).match(/demo-[a-z]+-[\d-]+\.svg/g) ?? [])];

test("every title, season, person and collection opens, with all its images", () => {
  for (const locale of ["it", "en"]) {
    const answers = [
      ...titles.map((t) => demoResponse(`/${t.kind}/${t.id}`, locale)),
      ...titles.filter((t) => t.kind === "tv").map((t) => demoResponse(`/tv/${t.id}/season/1`, locale)),
      ...people.map((p) => demoResponse(`/person/${p.id}`, locale)),
      demoResponse(`/collection/${collection.id}`, locale),
    ];
    for (const answer of answers) {
      assert.ok(answer);
      for (const file of imagesIn(answer)) assert.match(demoImage(file) ?? "", /^<svg /, file);
    }
  }
});

test("what does not exist is null", () => {
  for (const path of ["/movie/9", "/tv/1001", "/tv/2001/season/99", "/person/1", "/collection/1", "/keyword/1", "/unknown"])
    assert.equal(demoResponse(path, "it"), null);
  for (const file of ["demo-poster-9.svg", "demo-logo-99.svg", "../x.svg", "demo-poster-1001.png"])
    assert.equal(demoImage(file), null);
});

test("lists are paged and filters narrow them", () => {
  const first = demoResponse("/movie/popular?page=1", "en");
  const second = demoResponse("/movie/popular?page=2", "en");
  assert.equal(first.results.length, 20);
  assert.ok(first.results.every((a) => second.results.every((b) => a.id !== b.id)));

  const action = demoResponse("/discover/movie?with_genres=28", "en");
  assert.ok(action.results.length > 0 && action.results.every((m) => m.genre_ids.includes(28)));
  const both = demoResponse("/discover/movie?with_genres=28&with_watch_providers=1%7C2", "en");
  assert.ok(both.total_results < action.total_results);
});

test("search finds titles and people in either language", () => {
  assert.equal(demoResponse("/search/multi?query=frutteto", "en").results[0].id, 1001);
  assert.equal(demoResponse("/search/multi?query=vellini", "it").results[0].media_type, "person");
  assert.equal(demoResponse("/search/tv?query=orchard", "it").results.length, 0);
});

test("incomplete titles are part of the demo", () => {
  const all = titles.map((t) => demoResponse(`/${t.kind}/${t.id}`, "it"));
  assert.ok(all.some((t) => !t.overview));
  assert.ok(all.some((t) => !t.poster_path));
  assert.ok(all.some((t) => t.poster_path && !t.backdrop_path));
  assert.ok(all.some((t) => t.vote_count === 0));
  assert.ok(all.some((t) => t.credits.cast.length === 0));
  assert.ok(all.some((t) => t.videos.results.length === 0));
});
