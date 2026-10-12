// Pure alert-event logic for the dashboard (AR-12). No React or browser APIs
// here so it can be unit-tested with node:test (tests/alertEvents.test.mjs,
// tests/contracts.test.mjs).
//
// Contracts (contracts/v1, vendored from back-end/contracts/v1):
//   alert.new     { id, type, title, timestamp (epoch ms), deviceId,
//                   severity?: critical|high|normal, eventId?, late? }
//   alert.updated { id, deviceId, status, at, actorUserId?, escalationLevel? }
//                   status: attended|false_alarm|dismissed|restored|escalated|condition_cleared
//   Legacy alert.attended / alert.dismissed still arrive for one release; removal
//   is by id and idempotent, so double delivery is harmless.
//   GET /alerts/recent -> { success, data: { alerts: [{ id, type, title, timestamp, deviceId }] } }
//   is the durable source; socket events are only a fast path.

import type { AlertSeverity, RecentAlert } from "../types/dashboard";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null;
const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.length > 0;

// Same rules as timeUtils.parseToUnixMs (kept local so this module has no imports).
function toMs(raw: unknown, fallback: number): number {
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return raw < 1e11 ? raw * 1000 : raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const d = Date.parse(raw);
    if (!Number.isNaN(d)) return d;
    const n = Number(raw);
    if (!Number.isNaN(n) && n > 0) return toMs(n, fallback);
  }
  return fallback;
}

// ─── Severity ────────────────────────────────────────────────────────────────

const SEVERITIES: readonly AlertSeverity[] = ["critical", "high", "normal"];
const SEVERITY_RANK: Record<AlertSeverity, number> = { critical: 0, high: 1, normal: 2 };
const CRITICAL_TYPES = new Set(["fall", "help_call", "sos"]);
const HIGH_TYPES = new Set(["temperature"]);

const asSeverity = (v: unknown): AlertSeverity | undefined =>
  SEVERITIES.includes(v as AlertSeverity) ? (v as AlertSeverity) : undefined;

/** Explicit `severity` (from alert.new) wins; otherwise derived from the alert type. */
export function severityOf(alert: { type?: string; severity?: string }): AlertSeverity {
  const explicit = asSeverity(alert.severity);
  if (explicit) return explicit;
  const type = String(alert.type ?? "").toLowerCase();
  if (CRITICAL_TYPES.has(type)) return "critical";
  if (HIGH_TYPES.has(type)) return "high";
  return "normal";
}

/** critical > high > normal, then newest first. Returns a new array. */
export function sortBySeverity<T extends { type?: string; severity?: string; timestamp: number }>(alerts: T[]): T[] {
  return [...alerts].sort(
    (a, b) => SEVERITY_RANK[severityOf(a)] - SEVERITY_RANK[severityOf(b)] || b.timestamp - a.timestamp,
  );
}

/**
 * Merge live (socket) and REST copies, dedupe by id, order severity-first and
 * only then cap — so a fall is never hidden behind newer moisture alerts.
 */
export function visibleAlerts(ws: RecentAlert[], rest: RecentAlert[], cap = 5): RecentAlert[] {
  const byId = new Map<string, RecentAlert>();
  for (const a of [...ws, ...rest]) byId.set(a.id, { ...byId.get(a.id), ...a });
  return sortBySeverity([...byId.values()]).slice(0, cap);
}

// ─── alert.new ───────────────────────────────────────────────────────────────

/** Returns null for payloads without an id: such an alert could never be attended. */
export function parseAlertNew(data: unknown, now = Date.now()): RecentAlert | null {
  if (!isObj(data) || !nonEmpty(data.id)) return null;
  const alert: RecentAlert = {
    id: data.id,
    type: (nonEmpty(data.type) ? data.type : "movement") as RecentAlert["type"],
    title: nonEmpty(data.title) ? data.title : "Alert",
    timestamp: toMs(data.timestamp ?? data.ts, now),
  };
  if (nonEmpty(data.deviceId)) alert.deviceId = data.deviceId;
  const severity = asSeverity(data.severity);
  if (severity) alert.severity = severity;
  if (typeof data.late === "boolean") alert.late = data.late;
  return alert;
}

/** Socket events go to the device owner, who may own several devices; show only the selected one. */
export function belongsToDevice(alert: { deviceId?: string }, selectedDeviceId: string | null): boolean {
  return !alert.deviceId || !selectedDeviceId || alert.deviceId === selectedDeviceId;
}

// ─── alert.updated (canonical) + legacy removal ──────────────────────────────

export const REMOVAL_STATUSES: ReadonlySet<string> = new Set(["attended", "false_alarm", "dismissed"]);

export interface AlertUpdatedEvent {
  id: string;
  deviceId: string;
  status: string;
  at?: number;
  actorUserId?: number | null;
}

export function parseAlertUpdated(data: unknown): AlertUpdatedEvent | null {
  if (!isObj(data) || !nonEmpty(data.id) || !nonEmpty(data.status)) return null;
  return {
    id: data.id,
    deviceId: typeof data.deviceId === "string" ? data.deviceId : "",
    status: data.status,
    at: typeof data.at === "number" ? data.at : undefined,
    actorUserId: typeof data.actorUserId === "number" ? data.actorUserId : null,
  };
}

/** attended / false_alarm / dismissed remove the alert; every other status (incl. unknown) is ignored. */
export function alertUpdateAction(ev: { status: string }): "remove" | "ignore" {
  return REMOVAL_STATUSES.has(ev.status) ? "remove" : "ignore";
}

/** Idempotent removal by id (legacy alert.attended / alert.dismissed). */
export function applyAlertRemoved<T extends { id: string }>(alerts: T[], id: string): T[] {
  return alerts.some((a) => a.id === id) ? alerts.filter((a) => a.id !== id) : alerts;
}

/** Returns the same array when nothing changes. */
export function applyAlertUpdated<T extends { id: string }>(alerts: T[], ev: { id: string; status: string }): T[] {
  return alertUpdateAction(ev) === "remove" ? applyAlertRemoved(alerts, ev.id) : alerts;
}

// ─── Legacy client-side synthesis (NEXT_PUBLIC_ALERT_SYNTHESIS) ──────────────

/** Default OFF: the backend emits alert.new for every persisted live alert. Only "true" re-enables it. */
export function shouldSynthesize(flag: string | undefined): boolean {
  return (flag ?? "").trim().toLowerCase() === "true";
}

const truthyFlag = (v: unknown) => !!v && String(v) !== "0" && String(v) !== "false";
const URINE_COOLDOWN_MS = 5 * 60 * 1000;

/**
 * Pre-AR-12 behaviour, kept only behind the flag for rollback. Produces ids that
 * may not exist server-side (e.g. `urine_…`), which is why it is off by default.
 */
export function synthesizeAlertFromLog(
  log: Obj,
  deviceId: string,
  lastUrineTs: number,
  now = Date.now(),
): { alert: RecentAlert | null; lastUrineTs: number } {
  const tsMs = toMs(log.timestamp ?? log.ts, now);
  if (truthyFlag(log.fall_alert)) {
    return { alert: { id: `fall_${deviceId}_${tsMs}`, type: "fall", title: "Fall Detected", timestamp: tsMs }, lastUrineTs };
  }
  if (truthyFlag(log.sos)) {
    return { alert: { id: `sos_${deviceId}_${tsMs}`, type: "help_call", title: "Help Call", timestamp: tsMs }, lastUrineTs };
  }
  if (Number(log.moisture) > 25 && now - lastUrineTs >= URINE_COOLDOWN_MS) {
    return {
      alert: { id: `urine_${deviceId}_${tsMs}`, type: "urine", title: "High Moisture Detected", timestamp: tsMs },
      lastUrineTs: now,
    };
  }
  return { alert: null, lastUrineTs };
}

// ─── REST /alerts/recent ─────────────────────────────────────────────────────

/** Accepts every envelope the backend / proxy may return. */
export function unwrapAlerts(res: unknown): unknown[] {
  const raw = isObj(res) && "data" in res ? res.data : res;
  if (Array.isArray(raw)) return raw;
  if (!isObj(raw)) return [];
  for (const key of ["alerts", "items", "payload", "data"]) {
    if (Array.isArray(raw[key])) return raw[key] as unknown[];
  }
  return [];
}

/** Rows without an id are skipped: they cannot be attended or deduplicated. */
export function normaliseRestAlerts(list: unknown[], now = Date.now()): RecentAlert[] {
  const out: RecentAlert[] = [];
  for (const item of list) {
    if (!isObj(item) || (item.id == null || item.id === "")) continue;
    const alert: RecentAlert = {
      id: String(item.id),
      type: (nonEmpty(item.type) ? item.type : "movement") as RecentAlert["type"],
      title: nonEmpty(item.title) ? item.title : nonEmpty(item.label) ? item.label : "Alert",
      timestamp: toMs(item.timestamp ?? item.ts ?? item.createdAt, now),
    };
    if (item.attendedAt != null) alert.attendedAt = toMs(item.attendedAt, now);
    if (nonEmpty(item.deviceId)) alert.deviceId = item.deviceId;
    const severity = asSeverity(item.severity);
    if (severity) alert.severity = severity;
    if (typeof item.late === "boolean") alert.late = item.late;
    out.push(alert);
  }
  return out;
}

/**
 * Reconcile after a REST fetch (mount, 15 s poll, socket (re)connect).
 * REST is authoritative for everything that existed when the request started:
 *  - REST rows the user acted on this session are hidden;
 *  - live copies REST now returns are dropped (REST copy is used);
 *  - live copies received before the request started but absent from REST were
 *    resolved elsewhere (or fell out of the window) and are dropped;
 *  - live copies received while the request was in flight are kept.
 */
export function reconcileRecent(
  rest: RecentAlert[],
  ws: RecentAlert[],
  removed: ReadonlySet<string>,
  requestStartedAt: number,
): { rest: RecentAlert[]; ws: RecentAlert[] } {
  const keptRest = rest.filter((a) => !removed.has(a.id));
  const restIds = new Set(rest.map((a) => a.id));
  const keptWs = ws.filter(
    (a) => !removed.has(a.id) && !restIds.has(a.id) && (a.receivedAt ?? 0) >= requestStartedAt,
  );
  return { rest: keptRest, ws: keptWs };
}
