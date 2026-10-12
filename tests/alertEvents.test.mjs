import { test } from "node:test";
import assert from "node:assert/strict";
import {
  REMOVAL_STATUSES,
  parseAlertNew,
  parseAlertUpdated,
  alertUpdateAction,
  applyAlertUpdated,
  applyAlertRemoved,
  severityOf,
  sortBySeverity,
  visibleAlerts,
  shouldSynthesize,
  synthesizeAlertFromLog,
  normaliseRestAlerts,
  unwrapAlerts,
  reconcileRecent,
  belongsToDevice,
} from "../src/lib/alertEvents.ts";

const T0 = 1_791_770_400_000;
const alert = (id, type, timestamp, extra = {}) => ({ id, type, title: id, timestamp, ...extra });

// ─── alert.updated (canonical) ───────────────────────────────────────────────

test("removal statuses are exactly attended, false_alarm, dismissed", () => {
  assert.deepEqual([...REMOVAL_STATUSES].sort(), ["attended", "dismissed", "false_alarm"]);
});

for (const status of ["attended", "false_alarm", "dismissed"]) {
  test(`alert.updated status=${status} removes the alert`, () => {
    const list = [alert("a", "fall", T0), alert("b", "moisture", T0 + 1)];
    const ev = { id: "a", deviceId: "d1", status, at: T0 + 5 };
    assert.equal(alertUpdateAction(ev), "remove");
    assert.deepEqual(applyAlertUpdated(list, ev).map((a) => a.id), ["b"]);
  });
}

for (const status of ["restored", "escalated", "condition_cleared"]) {
  test(`alert.updated status=${status} keeps the list unchanged`, () => {
    const list = [alert("a", "fall", T0)];
    const ev = { id: "a", deviceId: "d1", status, at: T0 + 5 };
    assert.equal(alertUpdateAction(ev), "ignore");
    assert.equal(applyAlertUpdated(list, ev), list);
  });
}

test("alert.updated with an unknown status is ignored", () => {
  const list = [alert("a", "fall", T0)];
  const ev = { id: "a", deviceId: "d1", status: "teleported", at: T0 };
  assert.equal(alertUpdateAction(ev), "ignore");
  assert.equal(applyAlertUpdated(list, ev), list);
});

test("parseAlertUpdated rejects payloads without id or status", () => {
  assert.equal(parseAlertUpdated(null), null);
  assert.equal(parseAlertUpdated({ status: "attended" }), null);
  assert.equal(parseAlertUpdated({ id: "a" }), null);
  assert.equal(parseAlertUpdated({ id: "", status: "attended" }), null);
  const ok = parseAlertUpdated({ id: "a", deviceId: "d1", status: "attended", at: T0, actorUserId: 4 });
  assert.equal(ok.id, "a");
  assert.equal(ok.status, "attended");
  assert.equal(ok.deviceId, "d1");
});

test("legacy alert.attended + canonical alert.updated for the same alert is idempotent", () => {
  const list = [alert("a", "fall", T0), alert("b", "moisture", T0 + 1)];
  const legacyFirst = applyAlertUpdated(
    applyAlertRemoved(list, "a"),
    { id: "a", deviceId: "d1", status: "attended", at: T0 },
  );
  const canonicalFirst = applyAlertRemoved(
    applyAlertUpdated(list, { id: "a", deviceId: "d1", status: "attended", at: T0 }),
    "a",
  );
  assert.deepEqual(legacyFirst.map((a) => a.id), ["b"]);
  assert.deepEqual(canonicalFirst, legacyFirst);
  // Delivering the same event again changes nothing.
  assert.deepEqual(applyAlertRemoved(legacyFirst, "a"), legacyFirst);
});

test("legacy alert.dismissed + canonical false_alarm are idempotent", () => {
  const list = [alert("a", "help_call", T0)];
  const once = applyAlertRemoved(list, "a");
  const twice = applyAlertUpdated(once, { id: "a", deviceId: "d1", status: "false_alarm", at: T0 });
  assert.deepEqual(twice, []);
});

// ─── alert.new ───────────────────────────────────────────────────────────────

test("parseAlertNew keeps id, type, severity, deviceId and late", () => {
  const a = parseAlertNew({
    id: "fall_d1_1", type: "fall", title: "Fall Detected", timestamp: T0,
    deviceId: "d1", severity: "critical", eventId: "e1", late: true,
  });
  assert.deepEqual(a, {
    id: "fall_d1_1", type: "fall", title: "Fall Detected", timestamp: T0,
    deviceId: "d1", severity: "critical", late: true,
  });
});

test("parseAlertNew rejects payloads without an id (they could never be attended)", () => {
  assert.equal(parseAlertNew({ type: "fall", title: "x", timestamp: T0, deviceId: "d1" }), null);
  assert.equal(parseAlertNew(null), null);
});

test("parseAlertNew drops an unknown severity instead of trusting it", () => {
  const a = parseAlertNew({ id: "x", type: "moisture", title: "t", timestamp: T0, deviceId: "d", severity: "urgent" });
  assert.equal(a.severity, undefined);
  assert.equal(severityOf(a), "normal");
});

test("belongsToDevice filters alerts for another device", () => {
  assert.equal(belongsToDevice({ deviceId: "d1" }, "d1"), true);
  assert.equal(belongsToDevice({ deviceId: "d2" }, "d1"), false);
  assert.equal(belongsToDevice({}, "d1"), true); // REST rows are already device-scoped
  assert.equal(belongsToDevice({ deviceId: "d2" }, null), true);
});

// ─── severity ordering ───────────────────────────────────────────────────────

test("severityOf uses explicit severity, else derives from type", () => {
  assert.equal(severityOf({ type: "moisture", severity: "critical" }), "critical");
  assert.equal(severityOf({ type: "fall" }), "critical");
  assert.equal(severityOf({ type: "help_call" }), "critical");
  assert.equal(severityOf({ type: "sos" }), "critical");
  assert.equal(severityOf({ type: "temperature" }), "high");
  assert.equal(severityOf({ type: "moisture" }), "normal");
  assert.equal(severityOf({ type: "urine" }), "normal");
  assert.equal(severityOf({ type: "movement" }), "normal");
});

test("sortBySeverity: critical > high > normal, then newest first", () => {
  const list = [
    alert("m-new", "moisture", T0 + 300),
    alert("t", "temperature", T0 + 100),
    alert("f-old", "fall", T0),
    alert("sos", "help_call", T0 + 200),
    alert("m-old", "moisture", T0 + 50),
  ];
  assert.deepEqual(sortBySeverity(list).map((a) => a.id), ["sos", "f-old", "t", "m-new", "m-old"]);
  assert.equal(list[0].id, "m-new", "input is not mutated");
});

test("a fall older than many moisture alerts is still shown first after the cap", () => {
  const moisture = Array.from({ length: 20 }, (_, i) => alert(`m${i}`, "moisture", T0 + 1000 + i));
  const fall = alert("fall_d1_old", "fall", T0);
  const shown = visibleAlerts([], [...moisture, fall], 5);
  assert.equal(shown.length, 5);
  assert.equal(shown[0].id, "fall_d1_old");
  assert.deepEqual(shown.slice(1).map((a) => a.id), ["m19", "m18", "m17", "m16"]);
});

test("visibleAlerts dedupes ws and REST copies by id", () => {
  const ws = [alert("a", "fall", T0, { severity: "critical" })];
  const rest = [alert("a", "fall", T0), alert("b", "moisture", T0 + 1)];
  const shown = visibleAlerts(ws, rest, 5);
  assert.deepEqual(shown.map((a) => a.id), ["a", "b"]);
});

// ─── synthesis flag ──────────────────────────────────────────────────────────

test("synthesis is off by default and only 'true' turns it on", () => {
  assert.equal(shouldSynthesize(undefined), false);
  assert.equal(shouldSynthesize(""), false);
  assert.equal(shouldSynthesize("false"), false);
  assert.equal(shouldSynthesize("0"), false);
  assert.equal(shouldSynthesize("yes"), false);
  assert.equal(shouldSynthesize("true"), true);
  assert.equal(shouldSynthesize(" TRUE "), true);
});

test("legacy synthesis (flag on) keeps the old fall / sos / urine behaviour", () => {
  const now = T0 + 10 * 60_000;
  const fall = synthesizeAlertFromLog({ fall_alert: 1, timestamp: T0 }, "d1", 0, now);
  assert.equal(fall.alert.id, `fall_d1_${T0}`);
  assert.equal(fall.alert.type, "fall");
  const sos = synthesizeAlertFromLog({ sos: "true", timestamp: T0 }, "d1", 0, now);
  assert.equal(sos.alert.type, "help_call");
  const wet = synthesizeAlertFromLog({ moisture: 40, timestamp: T0 }, "d1", 0, now);
  assert.equal(wet.alert.id, `urine_d1_${T0}`);
  assert.equal(wet.lastUrineTs, now);
  const wetAgain = synthesizeAlertFromLog({ moisture: 40, timestamp: T0 + 1000 }, "d1", now, now + 1000);
  assert.equal(wetAgain.alert, null, "5-minute moisture cooldown");
  const dry = synthesizeAlertFromLog({ moisture: 10, fall_alert: "0", sos: false, timestamp: T0 }, "d1", 0, now);
  assert.equal(dry.alert, null);
});

// ─── REST normalisation + reconnect reconciliation ───────────────────────────

test("unwrapAlerts accepts the backend envelope { success, data: { alerts } }", () => {
  const body = { success: true, data: { alerts: [{ id: "a" }], total: 1 } };
  assert.deepEqual(unwrapAlerts(body), [{ id: "a" }]);
  assert.deepEqual(unwrapAlerts([{ id: "b" }]), [{ id: "b" }]);
  assert.deepEqual(unwrapAlerts(null), []);
});

test("normaliseRestAlerts maps rows and skips rows without an id", () => {
  const rows = [
    { id: "fall_d1_1", type: "fall", title: "Fall Detected", timestamp: T0, deviceId: "d1" },
    { type: "moisture", title: "no id", timestamp: T0 },
  ];
  const out = normaliseRestAlerts(rows);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, "fall_d1_1");
  assert.equal(out[0].timestamp, T0);
  assert.equal(out[0].deviceId, "d1");
});

test("reconcileRecent: REST is the durable source after a (re)connect", () => {
  const removed = new Set(["acted-on"]);
  const requestStartedAt = T0 + 1000;
  const rest = [
    alert("missed-while-offline", "fall", T0 + 100),
    alert("acted-on", "moisture", T0 + 50),
    alert("old", "moisture", T0),
  ];
  const ws = [
    // now covered by REST
    alert("missed-while-offline", "fall", T0 + 100, { receivedAt: T0 + 900 }),
    // received while the REST request was in flight: REST may not have it yet
    alert("in-flight", "help_call", T0 + 200, { receivedAt: requestStartedAt + 5 }),
    // received before the request and absent from REST: attended elsewhere / gone
    alert("gone", "moisture", T0 + 300, { receivedAt: T0 + 400 }),
    // removed locally this session
    alert("acted-on", "moisture", T0 + 50, { receivedAt: requestStartedAt + 10 }),
  ];
  const out = reconcileRecent(rest, ws, removed, requestStartedAt);
  assert.deepEqual(out.rest.map((a) => a.id), ["missed-while-offline", "old"]);
  assert.deepEqual(out.ws.map((a) => a.id), ["in-flight"]);
  const shown = visibleAlerts(out.ws, out.rest, 5).map((a) => a.id);
  assert.deepEqual(shown, ["in-flight", "missed-while-offline", "old"]);
});

test("reconcileRecent keeps a fall that arrived during an empty REST response", () => {
  const fall = alert("fall_d1_1", "fall", T0, { receivedAt: T0 + 2000 });
  const out = reconcileRecent([], [fall], new Set(), T0 + 1000);
  assert.deepEqual(out.ws.map((a) => a.id), ["fall_d1_1"]);
  const stale = reconcileRecent([], [{ ...fall, receivedAt: T0 + 500 }], new Set(), T0 + 1000);
  assert.deepEqual(stale, { rest: [], ws: [] });
});
