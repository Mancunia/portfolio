import { NextResponse } from "next/server";
import { createSession, signInAdmin, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const result = await signInAdmin(email, password, new URL(req.url).origin);
    if (!result.ok) {
      return result.reason === "forbidden"
        ? NextResponse.json({ error: "Not an admin" }, { status: 403 })
        : NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSession(result.userId);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("POST /api/admin/login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
