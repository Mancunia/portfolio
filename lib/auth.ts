import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";

const SESSION_COOKIE = "portfolio_session";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-in-production-32b"
);

// Identity lives in Neon Auth (Managed Better Auth). Only users whose role
// includes "admin" get a portfolio session; everyone else is refused.
const ADMIN_ROLE = "admin";

export async function createSession(userId: string): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionToken();
  if (!token) return false;
  return verifySession(token);
}

type AdminSignIn =
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid" | "forbidden" };

// Signs in against Neon Auth server-to-server, checks the user's role in the
// neon_auth.user table, then signs the Neon session out — the app only keeps
// its own short-lived cookie.
export async function signInAdmin(
  email: string,
  password: string,
  origin: string
): Promise<AdminSignIn> {
  const base = process.env.NEON_AUTH_BASE_URL;
  if (!base) throw new Error("NEON_AUTH_BASE_URL is not set");

  const signIn = await fetch(`${base}/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ email, password, rememberMe: false }),
    cache: "no-store",
  });
  if (!signIn.ok) return { ok: false, reason: "invalid" };

  const body = (await signIn.json()) as { token?: string; user?: { id?: string } };
  const userId = body.user?.id;
  if (!userId) return { ok: false, reason: "invalid" };

  // get-session doesn't accept the token as a Bearer, so read the role
  // straight from Neon Auth's table on the same branch.
  try {
    const sql = getDb();
    const rows = await sql`select role, banned from neon_auth."user" where id = ${userId}`;
    const user = rows[0] as { role: string | null; banned: boolean | null } | undefined;
    const roles = (user?.role ?? "").split(",").map((r) => r.trim());
    if (!user || user.banned || !roles.includes(ADMIN_ROLE)) {
      return { ok: false, reason: "forbidden" };
    }
    return { ok: true, userId };
  } finally {
    const cookie = signIn.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
    await fetch(`${base}/sign-out`, {
      method: "POST",
      headers: { Origin: origin, Cookie: cookie, ...(body.token ? { Authorization: `Bearer ${body.token}` } : {}) },
    }).catch(() => {});
  }
}

export { SESSION_COOKIE };
