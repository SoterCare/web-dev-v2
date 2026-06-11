export function parseToUnixMs(raw: unknown): number {
  if (typeof raw === "number" && isFinite(raw) && raw > 0)
    return raw < 1e11 ? raw * 1000 : raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const d = Date.parse(raw);
    if (!isNaN(d)) return d;
    const n = Number(raw);
    if (!isNaN(n) && n > 0) return parseToUnixMs(n);
  }
  return Date.now();
}

export function toTimeStr(ms: number): string {
  if (!ms || !isFinite(ms)) return "--";
  return new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(new Date(ms));
}

export function toDateTimeStr(ms: number): string {
  if (!ms || !isFinite(ms)) return "--";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(ms));
}

export function relativeTime(ms: number): string {
  const diff = Math.max(0, Date.now() - ms);
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (s < 60) return `${s}s ago`;
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}
