import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/api/schemas";
import {
  checkRateLimit,
  clearRateLimit,
  recordRateLimitHit,
} from "@/lib/auth/rate-limit";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { appendAuditLog } from "@/lib/cms/audit";
import {
  getUserRecordByEmail,
  initializeCmsStore,
  toPublicUser,
} from "@/lib/cms/store";

export async function POST(request: Request) {
  await initializeCmsStore();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rateKey = `login:${ip}`;
  const limit = checkRateLimit(rateKey);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    recordRateLimitHit(rateKey);
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;
  const user = await getUserRecordByEmail(email);

  if (!user || !user.active) {
    recordRateLimitHit(rateKey);
    await appendAuditLog({
      actorId: "anonymous",
      action: "login_failed",
      entityType: "user",
      entityId: email,
      meta: { reason: "unknown_or_inactive", ip },
    });
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    recordRateLimitHit(rateKey);
    await appendAuditLog({
      actorId: user.id,
      action: "login_failed",
      entityType: "user",
      entityId: user.id,
      meta: { reason: "bad_password", ip },
    });
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  clearRateLimit(rateKey);
  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await appendAuditLog({
    actorId: user.id,
    action: "login",
    entityType: "user",
    entityId: user.id,
    meta: { ip },
  });

  return NextResponse.json({
    user: toPublicUser(user),
  });
}
