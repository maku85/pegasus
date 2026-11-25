import assert from "node:assert/strict";
import test from "node:test";

import { pickTrailer } from "./trailer.ts";

const video = (key, iso_639_1, type = "Trailer", site = "YouTube") => ({ key, iso_639_1, type, site });

test("the page's language wins, even with a teaser", () => {
  const videos = [video("en", "en"), video("it", "it", "Teaser")];
  assert.equal(pickTrailer(videos, "it").key, "it");
  assert.equal(pickTrailer(videos, "en").key, "en");
});

test("another language is better than nothing, trailers before teasers", () => {
  assert.equal(pickTrailer([video("teaser", "en", "Teaser"), video("trailer", "en")], "it").key, "trailer");
  assert.equal(pickTrailer([video("none", null)], "it").key, "none");
});

test("clips and other sites are not trailers", () => {
  assert.equal(pickTrailer([video("a", "it", "Clip"), video("b", "it", "Trailer", "Vimeo")], "it"), undefined);
  assert.equal(pickTrailer(undefined, "it"), undefined);
});
