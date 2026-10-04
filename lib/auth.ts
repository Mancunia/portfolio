import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

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

// Signs in against Neon Auth server-to-server, checks the user's role, then
// revokes the Neon session — the app only keeps its own short-lived cookie.
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

  const { token } = (await signIn.json()) as { token?: string };
  if (!token) return { ok: false, reason: "invalid" };
  const bearer = { Authorization: `Bearer ${token}`, Origin: origin };

  try {
    const res = await fetch(`${base}/get-session`, { headers: bearer, cache: "no-store" });
    const session = res.ok
      ? ((await res.json()) as { user?: { id: string; role?: string | null; banned?: boolean | null } } | null)
      : null;
    const user = session?.user;
    const roles = (user?.role ?? "").split(",").map((r) => r.trim());
    if (!user || user.banned || !roles.includes(ADMIN_ROLE)) {
      return { ok: false, reason: "forbidden" };
    }
    return { ok: true, userId: user.id };
  } finally {
    await fetch(`${base}/sign-out`, { method: "POST", headers: bearer }).catch(() => {});
  }
}

export { SESSION_COOKIE };
