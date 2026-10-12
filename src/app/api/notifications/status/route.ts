import { proxyGet } from "@/lib/server-proxy";

// GET /notifications/status -> { success, data: { activeTokens } } for the signed-in user.
export async function GET(request: Request) {
  return proxyGet(request, "/notifications/status");
}
