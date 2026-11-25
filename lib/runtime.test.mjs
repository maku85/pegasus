import assert from "node:assert/strict";
import test from "node:test";

import { formatRuntime } from "./runtime.ts";

test("only the parts that are there", () => {
  assert.deepEqual([45, 60, 136, 120, 61].map(formatRuntime), ["45m", "1h", "2h 16m", "2h", "1h 1m"]);
});
