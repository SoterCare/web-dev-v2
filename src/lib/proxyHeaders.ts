/**
 * Headers the BFF sends to the back-end. `X-Client: web` lets the back-end
 * record the acting channel in the alert audit trail (AR-4).
 */
export function buildProxyHeaders(token: string, hasBody = false): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "X-Client": "web",
  };
  if (hasBody) headers["Content-Type"] = "application/json";
  return headers;
}
