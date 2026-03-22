import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    
    return NextResponse.json({ token, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read token" }, { status: 500 });
  }
}
