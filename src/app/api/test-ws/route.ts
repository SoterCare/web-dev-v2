import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://backend.sotercare.com/realtime", {
      headers: {
        "Upgrade": "websocket",
        "Connection": "Upgrade"
      }
    });

    return NextResponse.json({
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries())
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
