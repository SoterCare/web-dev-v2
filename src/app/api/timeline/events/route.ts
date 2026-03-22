import { proxyGet } from "@/lib/server-proxy";

export async function GET(request: Request) {
  return proxyGet(request, "/timeline/events");
}
