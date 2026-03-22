import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function proxyGet(request: Request, backendPath: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://unlikely-caryn-sotercare-873e6112.koyeb.app';
    const backendUrl = new URL(request.url).search 
      ? `${API_BASE}${backendPath}${new URL(request.url).search}`
      : `${API_BASE}${backendPath}`;

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

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
