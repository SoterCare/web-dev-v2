import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT payload (base64)
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf-8")
    );

    return NextResponse.json({
      name:  payload.name  || payload.username || "",
      email: payload.email || payload.sub       || "",
      role:  payload.role  || "Caregiver",
      id:    payload.id    || payload._id       || payload.sub || "",
    });
  } catch {
    return NextResponse.json({ error: "Failed to decode token" }, { status: 500 });
  }
}
