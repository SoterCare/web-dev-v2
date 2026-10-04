import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDemoRequest, buildSubject } from "../src/lib/demoRequest.ts";

const form = (fields) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};

test("required fields only: optional fields come back empty", () => {
  const r = parseDemoRequest(form({ name: "Nimal", email: "n@home.lk", message: "Hi" }));
  assert.deepEqual(r, { name: "Nimal", email: "n@home.lk", message: "Hi", home: "", beds: "", role: "" });
});

test("trims whitespace and caps lengths", () => {
  const r = parseDemoRequest(
    form({ name: "  Nimal  ", email: "n@home.lk", message: "x".repeat(5000), home: "h".repeat(500) }),
  );
  assert.equal(r.name, "Nimal");
  assert.equal(r.message.length, 4000);
  assert.equal(r.home.length, 150);
});

test("beds keeps digits only and caps at 5 digits", () => {
  const beds = (v) => parseDemoRequest(form({ name: "a", email: "a@b.co", message: "m", beds: v })).beds;
  assert.equal(beds("25 beds"), "25");
  assert.equal(beds("about twenty five"), "");
  assert.equal(beds("-3"), "3");
  assert.equal(beds("1234567"), "12345");
});

test("missing required field throws", () => {
  assert.throws(() => parseDemoRequest(form({ name: "a", email: "a@b.co" })), /required/i);
  assert.throws(() => parseDemoRequest(form({ email: "a@b.co", message: "m" })), /required/i);
});

test("invalid email throws", () => {
  assert.throws(() => parseDemoRequest(form({ name: "a", email: "nope", message: "m" })), /valid email/i);
});

test("subject flags care-home enquiries", () => {
  const base = { name: "Nimal", email: "n@h.lk", message: "m", beds: "", role: "" };
  assert.equal(buildSubject({ ...base, home: "Sunrise Care" }), "New care-home enquiry from Nimal (Sunrise Care) — SoterCare");
  assert.equal(buildSubject({ ...base, home: "" }), "New message from Nimal — SoterCare");
});
