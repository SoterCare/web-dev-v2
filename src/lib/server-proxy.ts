import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function proxyRequest(request: Request, backendPath: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://unlikely-caryn-sotercare-873e6112.koyeb.app';
    const backendUrl = new URL(request.url).search 
      ? `${API_BASE}${backendPath}${new URL(request.url).search}`
      : `${API_BASE}${backendPath}`;

    const reqHeaders: Record<string, string> = {
      "Authorization": `Bearer ${token}`,
    };

    const options: RequestInit = { method: request.method, headers: reqHeaders };

    // Only forward body and Content-Type for requests that carry a payload.
    // Sending Content-Type: application/json on a bodyless PATCH causes some
    // backends to fail when they try to parse an empty JSON body.
    if (request.method !== "GET" && request.method !== "HEAD") {
      const bodyText = await request.text();
      if (bodyText) {
        options.body = bodyText;
        reqHeaders["Content-Type"] = "application/json";
      }
    }

    const res = await fetch(backendUrl, options);

    if (!res.ok) {
      const text = await res.text();
      try {
         return NextResponse.json(JSON.parse(text), { status: res.status });
      } catch {
         return NextResponse.json({ error: text || "Backend error" }, { status: res.status });
      }
    }

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : { payload: [] };
    } catch {
      data = { payload: [], raw: text };
    }
    
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(`[Proxy] Error fetching ${backendPath}:`, err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Backward compatibility
export async function proxyGet(request: Request, backendPath: string) {
  return proxyRequest(request, backendPath);
}
