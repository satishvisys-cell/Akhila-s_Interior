import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth/session";
import { appendAuditLog } from "@/lib/cms/audit";

export async function POST() {
  const session = await getSession();
  await destroySession();

  if (session) {
    await appendAuditLog({
      actorId: session.userId,
      action: "logout",
      entityType: "user",
      entityId: session.userId,
    });
  }

  return NextResponse.json({ ok: true });
}
