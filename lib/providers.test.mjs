import assert from "node:assert/strict";
import test from "node:test";

import { parseProviders, PROVIDERS, regionOf } from "./providers.ts";

test("the same selection always has one spelling", () => {
  assert.deepEqual(parseProviders("337,8", "IT"), [8, 337]);
  assert.deepEqual(parseProviders("8,337,8", "IT"), [8, 337]);
});

test("unknown or other countries' providers are dropped", () => {
  assert.deepEqual(parseProviders("8,15,999,x,-1", "IT"), [8]);
  assert.deepEqual(parseProviders("8|337&x=1", "IT"), []);
  for (const empty of [null, "", ","]) assert.deepEqual(parseProviders(empty, "US"), []);
});

test("every country lists distinct providers", () => {
  for (const list of Object.values(PROVIDERS))
    assert.equal(new Set(list.map((p) => p.id)).size, list.length);
  assert.deepEqual([regionOf("it"), regionOf("en")], ["IT", "US"]);
});
