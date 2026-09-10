import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { designPatchSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import { getById, initializeCmsStore, remove, update } from "@/lib/cms/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const auth = await requireApiSession("project:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  await initializeCmsStore();
  const design = await getById("designs", id);
  if (!design) return jsonError("Design not found", 404);
  return NextResponse.json({ design });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const auth = await requireApiSession("media:write");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = designPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const patch = { ...parsed.data } as Record<string, unknown>;
  if (parsed.data.publishStatus === "published") {
    patch.publishedAt = new Date().toISOString();
  }

  const design = await update("designs", id, patch);
  if (!design) return jsonError("Design not found", 404);

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "update",
    entityType: "design",
    entityId: id,
  });

  return NextResponse.json({ design });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireApiSession("media:write");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  await initializeCmsStore();
  const ok = await remove("designs", id);
  if (!ok) return jsonError("Design not found", 404);

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "delete",
    entityType: "design",
    entityId: id,
  });

  return NextResponse.json({ ok: true });
}
