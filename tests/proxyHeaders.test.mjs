import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProxyHeaders } from "../src/lib/proxyHeaders.ts";

// AR-4: the back-end records the acting channel in the alert audit trail from
// the X-Client header; the BFF must identify itself as the web client.
test("identifies the web client and carries the bearer token", () => {
  assert.deepEqual(buildProxyHeaders("tok"), {
    Authorization: "Bearer tok",
    "X-Client": "web",
  });
});

test("adds Content-Type only when a body is forwarded", () => {
  assert.equal(buildProxyHeaders("tok", true)["Content-Type"], "application/json");
  assert.equal("Content-Type" in buildProxyHeaders("tok", false), false);
});
