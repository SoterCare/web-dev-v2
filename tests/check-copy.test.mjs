import { test } from "node:test";
import assert from "node:assert/strict";
import { findViolations, findMissing } from "../scripts/check-copy.mjs";

test("flags banned consumer and vitals copy", () => {
  assert.ok(findViolations("includes a Wrist Node", "src/components/Pricing.tsx").length > 0);
  assert.ok(findViolations("only $329 one-time", "src/components/Pricing.tsx").length > 0);
  assert.ok(findViolations("live Heart Rate and SpO2", "src/components/Product.tsx").length > 0);
  assert.ok(findViolations("Wellness Simplified", "src/emails/ContactAutoReply.tsx").length > 0);
  assert.ok(findViolations("Komudi Dhara", "src/components/Team.tsx").length > 0);
});

test("clean care-home copy passes", () => {
  assert.deepEqual(
    findViolations("Safer care for every resident. Book a demo.", "src/components/Hero.tsx"),
    [],
  );
});

test("allow-listed file may mention Raspberry Pi", () => {
  assert.deepEqual(findViolations("Raspberry Pi", "src/components/TechStack.tsx"), []);
  assert.ok(findViolations("Raspberry Pi", "src/components/FAQ.tsx").length > 0);
});

test("findMissing reports absent required copy and anchors", () => {
  const missing = findMissing(() => null);
  assert.ok(missing.length > 0);
  assert.ok(missing.some((m) => m.includes("src/components/Hero.tsx")));
});
