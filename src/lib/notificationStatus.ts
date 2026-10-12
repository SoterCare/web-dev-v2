// Pure helpers for the "no phone registered" banner (AR-12, wording per §2.3).
//   GET /notifications/status (JWT) -> { success: true, data: { activeTokens: n } }
// The banner is shown only when the backend positively confirms zero active
// push tokens (I-1); any error or unexpected shape hides it.

export const NO_PHONE_BANNER_TEXT =
  "No phone registered for alerts — install the SoterCare app and allow notifications to be alerted when the browser is closed.";

export type NotificationStatus = { status: "ok"; activeTokens: number } | { status: "error" };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null;

export function parseNotificationStatus(httpStatus: number, body: unknown): NotificationStatus {
  if (httpStatus < 200 || httpStatus >= 300) return { status: "error" };
  if (!isObj(body) || body.success !== true || !isObj(body.data)) return { status: "error" };
  const n = body.data.activeTokens;
  if (typeof n !== "number" || !Number.isInteger(n) || n < 0) return { status: "error" };
  return { status: "ok", activeTokens: n };
}

export function shouldShowNoPhoneBanner(result: NotificationStatus | null): boolean {
  return result?.status === "ok" && result.activeTokens === 0;
}
