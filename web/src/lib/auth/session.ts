import { cookies } from "next/headers";
import type { AdminUserSession, RoleKey } from "@/domain/types";

export const SESSION_COOKIE_NAME = "akhila_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: RoleKey;
  issuedAt: number;
  expiresAt: number;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET must be set to a value of at least 32 characters in production",
    );
  }

  console.warn(
    "[auth/session] SESSION_SECRET not set — using insecure development fallback. Set SESSION_SECRET in .env.local",
  );
  return "dev-insecure-session-secret-change-me!!";
}

function toBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");

  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function sign(data: string, secret: string): Promise<string> {
  const subtle = globalThis.crypto.subtle;
  const encoder = new TextEncoder();
  const key = await subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

async function verify(data: string, signature: string, secret: string): Promise<boolean> {
  const expected = await sign(data, secret);
  if (expected.length !== signature.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

async function encodeSession(payload: SessionPayload): Promise<string> {
  const secret = getSessionSecret();
  const data = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(data, secret);
  return `${data}.${signature}`;
}

async function decodeSession(token: string): Promise<SessionPayload | null> {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex <= 0) return null;

  const data = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  const secret = getSessionSecret();

  const valid = await verify(data, signature, secret);
  if (!valid) return null;

  try {
    const json = new TextDecoder().decode(fromBase64Url(data));
    const payload = JSON.parse(json) as SessionPayload;

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.expiresAt !== "number"
    ) {
      return null;
    }

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function toAdminSession(payload: SessionPayload): AdminUserSession {
  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    issuedAt: new Date(payload.issuedAt).toISOString(),
    expiresAt: new Date(payload.expiresAt).toISOString(),
  };
}

export interface CreateSessionInput {
  userId: string;
  email: string;
  name: string;
  role: RoleKey;
}

export async function createSession(input: CreateSessionInput): Promise<string> {
  const now = Date.now();
  const payload: SessionPayload = {
    userId: input.userId,
    email: input.email,
    name: input.name,
    role: input.role,
    issuedAt: now,
    expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000,
  };

  const token = await encodeSession(payload);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return token;
}

export async function getSession(): Promise<AdminUserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await decodeSession(token);
  if (!payload) return null;

  return toAdminSession(payload);
}

export async function getSessionFromToken(
  token: string,
): Promise<AdminUserSession | null> {
  const payload = await decodeSession(token);
  if (!payload) return null;
  return toAdminSession(payload);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export { SESSION_MAX_AGE_SECONDS };
