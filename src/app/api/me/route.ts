import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 });
    }

    // Normalize base64url → base64 with correct padding
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));

    return NextResponse.json({
      name:  payload.name  || payload.username || "",
      email: payload.email || payload.sub       || "",
      role:  payload.role  || "Caregiver",
      id:    payload.id    || payload._id       || payload.sub || "",
    });
  } catch (err) {
    console.error("[/api/me] Failed to decode token:", err);
    return NextResponse.json({ error: "Failed to decode token" }, { status: 500 });
  }
}
