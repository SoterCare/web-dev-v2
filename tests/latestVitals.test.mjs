import { test } from "node:test";
import assert from "node:assert/strict";
import {
  extractDeviceIds,
  resolveSelectedDevice,
  mapLatestVitals,
  loadLatestVitals,
  mergeLiveVitals,
  deviceIdQueryError,
  acceptLiveDeviceId,
} from "../src/lib/latestVitals.ts";

// Real backend envelopes (back-end/apps/api-gateway/src/devices/devices.controller.ts,
// dashboard/dashboard.controller.ts + DashboardService.getLatestVitals).
const devicesBody = { success: true, data: { devices: [{ id: "dev-a" }, { id: "dev-b" }] } };
const vitalsBody = (deviceId = "dev-a") => ({
  success: true,
  data: { deviceId, timestamp: 1773302409000, temperature: 36.6, roomTemperature: 24.1, moisture: 12, gaitAnalysis: "walking" },
});

test("extractDeviceIds reads the real /devices envelope and tolerates legacy shapes", () => {
  assert.deepEqual(extractDeviceIds(devicesBody), ["dev-a", "dev-b"]);
  assert.deepEqual(extractDeviceIds({ devices: [{ deviceId: "x" }] }), ["x"]);
  assert.deepEqual(extractDeviceIds({ data: [{ id: "y" }] }), ["y"]);
  assert.deepEqual(extractDeviceIds({ success: true, data: { devices: [] } }), []);
  assert.deepEqual(extractDeviceIds(null), []);
});

test("resolveSelectedDevice keeps a valid cached selection and drops a stale one", () => {
  assert.equal(resolveSelectedDevice(["dev-a", "dev-b"], "dev-b"), "dev-b");
  assert.equal(resolveSelectedDevice(["dev-a", "dev-b"], "someone-elses"), "dev-a");
  assert.equal(resolveSelectedDevice([], "dev-a"), null);
  assert.equal(resolveSelectedDevice(["dev-a"], null), "dev-a");
});

test("mapLatestVitals maps backend field names (°C, %, label) for the selected device only", () => {
  assert.deepEqual(mapLatestVitals(vitalsBody(), "dev-a"), {
    deviceId: "dev-a", timestamp: 1773302409000, skinTemp: 36.6, roomTemp: 24.1, moisture: 12, gaitLabel: "walking",
  });
  assert.equal(mapLatestVitals(vitalsBody("dev-b"), "dev-a"), null, "never shows another device's reading");
  assert.equal(mapLatestVitals({ success: true, data: null, message: "No vitals" }, "dev-a"), null);
  assert.equal(mapLatestVitals({ payload: [] }, "dev-a"), null);
});

const fakeFetch = (status, body) => {
  const calls = [];
  const fn = async (path) => { calls.push(path); return { status, body }; };
  fn.calls = calls;
  return fn;
};

test("loadLatestVitals never calls the API without a device", async () => {
  const fetchJson = fakeFetch(200, vitalsBody());
  assert.deepEqual(await loadLatestVitals(null, fetchJson), { status: "no-device" });
  assert.deepEqual(await loadLatestVitals("", fetchJson), { status: "no-device" });
  assert.equal(fetchJson.calls.length, 0);
});

test("loadLatestVitals requests the selected device and maps the reading", async () => {
  const fetchJson = fakeFetch(200, vitalsBody("dev a/1"));
  const result = await loadLatestVitals("dev a/1", fetchJson);
  assert.equal(fetchJson.calls[0], "/dashboard/vitals/latest?deviceId=dev%20a%2F1");
  assert.equal(result.status, "ok");
  assert.equal(result.vitals.skinTemp, 36.6);
});

test("loadLatestVitals reports an empty device distinctly", async () => {
  assert.deepEqual(await loadLatestVitals("dev-a", fakeFetch(200, { success: true, data: null })), { status: "empty" });
});

test("loadLatestVitals classifies authorization and client errors", async () => {
  assert.deepEqual(await loadLatestVitals("dev-a", fakeFetch(400, { message: "deviceId is required" })), { status: "bad-request" });
  assert.deepEqual(await loadLatestVitals("dev-a", fakeFetch(403, {})), { status: "forbidden" });
  assert.deepEqual(await loadLatestVitals("dev-a", fakeFetch(404, {})), { status: "not-found" });
  assert.deepEqual(await loadLatestVitals("dev-a", fakeFetch(500, {})), { status: "error" });
  const throwing = async () => { throw new Error("network"); };
  assert.deepEqual(await loadLatestVitals("dev-a", throwing), { status: "error" });
});

test("mergeLiveVitals ignores live data and snapshots that belong to another device", () => {
  const snapshot = mapLatestVitals(vitalsBody("dev-a"), "dev-a");
  const liveA = { device_id: "dev-a", skinTemp: 37.2, moisture: 15 };
  const liveB = { device_id: "dev-b", skinTemp: 39.9, moisture: 88 };
  assert.equal(mergeLiveVitals(snapshot, liveA, "dev-a").skinTemp, 37.2);
  assert.equal(mergeLiveVitals(snapshot, liveB, "dev-a").skinTemp, 36.6);
  // user switched to dev-b: the dev-a snapshot must not be shown for dev-b
  assert.deepEqual(mergeLiveVitals(snapshot, null, "dev-b"), {});
  assert.equal(mergeLiveVitals(null, liveB, "dev-b").moisture, 88);
  assert.deepEqual(mergeLiveVitals(snapshot, liveA, null), {});
});

test("deviceIdQueryError guards the BFF route", () => {
  assert.equal(deviceIdQueryError("https://x/api/dashboard/vitals/latest?deviceId=dev-a"), null);
  assert.equal(deviceIdQueryError("https://x/api/dashboard/vitals/latest"), "deviceId is required");
  assert.equal(deviceIdQueryError("https://x/api/dashboard/vitals/latest?deviceId=%20"), "deviceId is required");
});

test("acceptLiveDeviceId only follows socket-reported devices that belong to the account", () => {
  assert.equal(acceptLiveDeviceId(["dev-a", "dev-b"], "dev-b"), true);
  assert.equal(acceptLiveDeviceId(["dev-a"], "someone-elses"), false);
  assert.equal(acceptLiveDeviceId([], "dev-a"), false, "account has no devices");
  assert.equal(acceptLiveDeviceId(null, "dev-a"), true, "device list unknown (REST failed): keep legacy behaviour");
  assert.equal(acceptLiveDeviceId(["dev-a"], null), false);
});
