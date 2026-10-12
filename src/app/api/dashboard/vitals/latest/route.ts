import { proxyGet } from "@/lib/server-proxy";
import { deviceIdQueryError } from "@/lib/latestVitals";

export async function GET(request: Request) {
  // Fail fast without a deviceId; the backend also enforces it and ownership.
  const error = deviceIdQueryError(request.url);
  if (error) return Response.json({ error }, { status: 400 });
  return proxyGet(request, "/dashboard/vitals/latest");
}
