// Pure helpers for the dashboard's device selection and initial vitals
// snapshot. No React or browser APIs here so they can be unit-tested.
//
// Backend contracts (back-end/apps/api-gateway):
//   GET /devices                 -> { success, data: { devices: [{ id, ... }] } }
//   GET /dashboard/vitals/latest -> { success, data: { deviceId, timestamp (epoch ms),
//                                   temperature (°C), roomTemperature (°C),
//                                   moisture (%), gaitAnalysis (label) } | null }
//   deviceId is required and must belong to the caller (400 / 404 otherwise).

export type LatestVitalsView = {
  deviceId: string;
  timestamp?: number;
  skinTemp?: number;
  roomTemp?: number;
  moisture?: number | string;
  gaitLabel?: string;
};

export type LiveVitals = Omit<Partial<LatestVitalsView>, "deviceId"> & {
  device_id?: string;
};

export type LatestVitalsResult =
  | { status: "ok"; vitals: LatestVitalsView }
  | { status: "empty" }
  | { status: "no-device" }
  | { status: "bad-request" }
  | { status: "forbidden" }
  | { status: "not-found" }
  | { status: "error" };

export type FetchJson = (path: string) => Promise<{ status: number; body: unknown }>;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null;

function deviceList(body: unknown): unknown[] {
  if (!isObj(body)) return [];
  if (Array.isArray(body.devices)) return body.devices;
  if (Array.isArray(body.data)) return body.data;
  if (isObj(body.data) && Array.isArray(body.data.devices)) return body.data.devices;
  return [];
}

export function extractDeviceIds(body: unknown): string[] {
  return deviceList(body)
    .map((d) => (isObj(d) ? d.id ?? d.deviceId : undefined))
    .filter((id): id is string => typeof id === "string" && id.length > 0);
}

/** A cached selection is only kept while it is still one of the caller's devices. */
export function resolveSelectedDevice(ids: string[], cached: string | null): string | null {
  if (cached && ids.includes(cached)) return cached;
  return ids[0] ?? null;
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

export function mapLatestVitals(body: unknown, deviceId: string): LatestVitalsView | null {
  const data = isObj(body) && isObj(body.data) ? body.data : null;
  if (!data || data.deviceId !== deviceId) return null;
  return {
    deviceId,
    timestamp: num(data.timestamp),
    skinTemp: num(data.temperature),
    roomTemp: num(data.roomTemperature),
    moisture: num(data.moisture),
    gaitLabel: typeof data.gaitAnalysis === "string" ? data.gaitAnalysis : undefined,
  };
}

export async function loadLatestVitals(
  deviceId: string | null,
  fetchJson: FetchJson,
): Promise<LatestVitalsResult> {
  if (!deviceId) return { status: "no-device" };
  try {
    const { status, body } = await fetchJson(
      `/dashboard/vitals/latest?deviceId=${encodeURIComponent(deviceId)}`,
    );
    if (status === 400) return { status: "bad-request" };
    if (status === 403) return { status: "forbidden" };
    if (status === 404) return { status: "not-found" };
    if (status < 200 || status >= 300) return { status: "error" };
    const vitals = mapLatestVitals(body, deviceId);
    return vitals ? { status: "ok", vitals } : { status: "empty" };
  } catch {
    return { status: "error" };
  }
}

/** Live socket data wins, but only data for the selected device is ever shown. */
export function mergeLiveVitals(
  snapshot: LatestVitalsView | null,
  live: LiveVitals | null,
  deviceId: string | null,
): Partial<LatestVitalsView> {
  if (!deviceId) return {};
  const base = snapshot?.deviceId === deviceId ? snapshot : {};
  const fresh = live?.device_id === deviceId ? live : {};
  return { ...base, ...fresh };
}

export function deviceIdQueryError(url: string): string | null {
  const id = new URL(url).searchParams.get("deviceId");
  return id && id.trim() ? null : "deviceId is required";
}

/**
 * Socket events name a device; only follow it if it is one of the caller's
 * devices. `knownIds === null` means the device list could not be loaded.
 */
export function acceptLiveDeviceId(knownIds: string[] | null, liveId: string | null): boolean {
  if (!liveId) return false;
  return knownIds === null || knownIds.includes(liveId);
}
