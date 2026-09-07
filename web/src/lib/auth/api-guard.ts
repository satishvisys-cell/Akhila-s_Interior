import { NextResponse } from "next/server";
import type { AdminUserSession, Permission } from "@/domain/types";
import { can } from "@/domain/permissions";
import { getSession } from "@/lib/auth/session";
import { initializeCmsStore } from "@/lib/cms/store";

export type ApiAuthResult =
  | { ok: true; session: AdminUserSession }
  | { ok: false; response: NextResponse };

/**
 * API route guard — returns JSON 401/403 instead of redirecting.
 */
export async function requireApiSession(
  permission?: Permission,
): Promise<ApiAuthResult> {
  await initializeCmsStore();

  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (permission && !can(session.role, permission)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, session };
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
