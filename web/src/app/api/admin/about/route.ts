import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { aboutPatchSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import { initializeCmsStore, list, update } from "@/lib/cms/store";

export async function GET() {
  const auth = await requireApiSession("page:write");
  if (!auth.ok) return auth.response;

  await initializeCmsStore();
  const about = (await list("about"))[0] ?? null;
  return NextResponse.json({ about });
}

export async function PATCH(request: Request) {
  const auth = await requireApiSession("page:write");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = aboutPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const current = (await list("about"))[0];
  if (!current) return jsonError("About content not found", 404);

  const about = await update("about", current.id, parsed.data);
  if (!about) return jsonError("About content not found", 404);

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "update",
    entityType: "about",
    entityId: current.id,
  });

  return NextResponse.json({ about });
}
