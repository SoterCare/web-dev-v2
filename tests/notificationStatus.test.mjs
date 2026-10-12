import { test } from "node:test";
import assert from "node:assert/strict";
import {
  NO_PHONE_BANNER_TEXT,
  parseNotificationStatus,
  shouldShowNoPhoneBanner,
} from "../src/lib/notificationStatus.ts";

test("banner copy follows the §2.3 wording", () => {
  assert.equal(
    NO_PHONE_BANNER_TEXT,
    "No phone registered for alerts — install the SoterCare app and allow notifications to be alerted when the browser is closed.",
  );
  assert.doesNotMatch(NO_PHONE_BANNER_TEXT, /deliver/i);
});

test("parses { success, data: { activeTokens } }", () => {
  assert.deepEqual(parseNotificationStatus(200, { success: true, data: { activeTokens: 0 } }), {
    status: "ok",
    activeTokens: 0,
  });
  assert.deepEqual(parseNotificationStatus(200, { success: true, data: { activeTokens: 2 } }), {
    status: "ok",
    activeTokens: 2,
  });
});

test("anything unexpected is an error (banner hidden)", () => {
  for (const [status, body] of [
    [500, { success: true, data: { activeTokens: 0 } }],
    [401, { error: "Unauthorized" }],
    [404, null],
    [200, { success: false, data: { activeTokens: 0 } }],
    [200, { success: true, data: {} }],
    [200, { success: true, data: { activeTokens: "0" } }],
    [200, { success: true, data: { activeTokens: -1 } }],
    [200, { payload: [] }],
  ]) {
    assert.deepEqual(parseNotificationStatus(status, body), { status: "error" }, JSON.stringify([status, body]));
  }
});

test("banner only when the backend confirms zero active phones", () => {
  assert.equal(shouldShowNoPhoneBanner({ status: "ok", activeTokens: 0 }), true);
  assert.equal(shouldShowNoPhoneBanner({ status: "ok", activeTokens: 1 }), false);
  assert.equal(shouldShowNoPhoneBanner({ status: "error" }), false);
  assert.equal(shouldShowNoPhoneBanner(null), false);
});
