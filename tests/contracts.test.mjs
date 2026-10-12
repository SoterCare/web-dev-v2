// CT (AR-11) for web-dev-v2: the vendored contracts in contracts/v1 must match
// the back-end source of truth (CHECKSUMS.sha256), and the web's alert event
// handling must accept every valid alert event fixture.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseAlertNew,
  parseAlertUpdated,
  alertUpdateAction,
  applyAlertUpdated,
  severityOf,
} from "../src/lib/alertEvents.ts";

const ROOT = fileURLToPath(new URL("../contracts/v1/", import.meta.url));
const VALID = join(ROOT, "fixtures", "valid");

// git (core.autocrlf) may check files out with CRLF; checksums are over LF bytes.
const sha256 = (path) =>
  createHash("sha256").update(readFileSync(path, "utf8").replace(/\r\n/g, "\n"), "utf8").digest("hex");

const checksumLines = readFileSync(join(ROOT, "CHECKSUMS.sha256"), "utf8")
  .split(/\r?\n/)
  .filter((l) => l.trim() !== "");

test("CHECKSUMS.sha256 is non-empty and lists the alert contracts", () => {
  const files = checksumLines.map((l) => l.split(/\s+/)[1]);
  for (const f of ["alert_new.schema.json", "alert_updated.schema.json", "fixtures/valid/alert_new.json", "fixtures/valid/alert_updated.json"]) {
    assert.ok(files.includes(f), `${f} listed`);
  }
});

for (const line of checksumLines) {
  const [hash, file] = line.split(/\s+/);
  test(`vendored ${file} matches CHECKSUMS.sha256`, () => {
    assert.equal(sha256(join(ROOT, file)), hash);
  });
}

const readJson = (name) => JSON.parse(readFileSync(join(VALID, name), "utf8"));

// Socket events the web consumes, by fixture-name prefix. `*.request.json` fixtures
// are REST request bodies (e.g. alert_seen), not events, and are out of scope here.
const HANDLERS = {
  alert_new: (payload) => {
    const a = parseAlertNew(payload);
    assert.ok(a, "alert.new accepted");
    assert.equal(a.id, payload.id);
    assert.equal(a.deviceId, payload.deviceId);
    assert.equal(a.timestamp, payload.timestamp);
    if (payload.severity) assert.equal(severityOf(a), payload.severity);
  },
  alert_updated: (payload) => {
    const ev = parseAlertUpdated(payload);
    assert.ok(ev, "alert.updated accepted");
    const list = [{ id: payload.id, type: "fall", title: "t", timestamp: 1 }];
    const after = applyAlertUpdated(list, ev);
    if (alertUpdateAction(ev) === "remove") assert.deepEqual(after, []);
    else assert.equal(after, list);
  },
};

const eventFixtures = readdirSync(VALID).filter((f) => f.startsWith("alert_") && !f.endsWith(".request.json"));

test("there is at least one alert event fixture of each handled kind", () => {
  for (const kind of Object.keys(HANDLERS)) {
    assert.ok(eventFixtures.some((f) => f.split(".")[0] === kind), `${kind} fixture present`);
  }
});

for (const file of eventFixtures) {
  test(`web accepts fixtures/valid/${file}`, () => {
    const kind = file.split(".")[0];
    const handler = HANDLERS[kind];
    assert.ok(handler, `no web handler for ${kind}`);
    handler(readJson(file));
  });
}

test("every alert_updated status in the schema is handled (remove or ignore)", () => {
  const schema = JSON.parse(readFileSync(join(ROOT, "alert_updated.schema.json"), "utf8"));
  for (const status of schema.properties.status.enum) {
    const ev = parseAlertUpdated({ id: "x", deviceId: "d", status, at: 1 });
    assert.ok(ev, status);
    const expected = ["attended", "false_alarm", "dismissed"].includes(status) ? "remove" : "ignore";
    assert.equal(alertUpdateAction(ev), expected, status);
  }
});

test("every alert_new severity in the schema is honoured", () => {
  const schema = JSON.parse(readFileSync(join(ROOT, "alert_new.schema.json"), "utf8"));
  for (const severity of schema.properties.severity.enum) {
    const a = parseAlertNew({ id: "x", type: "moisture", title: "t", timestamp: 1, deviceId: "d", severity });
    assert.equal(severityOf(a), severity);
  }
});
