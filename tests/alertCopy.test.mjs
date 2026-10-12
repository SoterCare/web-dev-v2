// CT-07 (web): alert UI and alert logic must never claim an alert was "delivered" (§2.3, I-1).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const SCAN = [
  "src/components/dashboard",
  "src/lib/alertEvents.ts",
  "src/lib/notificationStatus.ts",
  "src/lib/useAlerts.ts",
  "src/app/dashboard",
  "src/app/api/alerts",
  "src/app/api/notifications",
];

function* files(rel) {
  const full = join(ROOT, rel);
  if (statSync(full).isDirectory()) {
    for (const entry of readdirSync(full)) yield* files(join(rel, entry));
  } else if (/\.(ts|tsx)$/.test(rel)) {
    yield rel;
  }
}

test("no alert-related web source says 'delivered'", () => {
  const offenders = [];
  for (const root of SCAN) {
    for (const rel of files(root)) {
      const text = readFileSync(join(ROOT, rel), "utf8");
      text.split(/\r?\n/).forEach((line, i) => {
        if (/\bdelivered\b/i.test(line)) offenders.push(`${relative(ROOT, join(ROOT, rel))}:${i + 1}`);
      });
    }
  }
  assert.deepEqual(offenders, []);
});
