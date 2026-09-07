import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { projectPatchSchema } from "@/lib/api/schemas";
import { can } from "@/domain/permissions";
import { appendAuditLog } from "@/lib/cms/audit";
import {
  getById,
  initializeCmsStore,
  remove,
  update,
} from "@/lib/cms/store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireApiSession("project:read");
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  await initializeCmsStore();
  const project = await getById("projects", id);
  if (!project) return jsonError("Project not found", 404);

  return NextResponse.json({ project });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireApiSession("project:write");
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = projectPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const existing = await getById("projects", id);
  if (!existing) return jsonError("Project not found", 404);

  const patch = { ...parsed.data } as Record<string, unknown>;

  if (
    patch.publishStatus &&
    patch.publishStatus !== existing.publishStatus
  ) {
    if (!can(auth.session.role, "project:publish")) {
      return jsonError("Missing project:publish permission", 403);
    }
    if (patch.publishStatus === "published") {
      patch.publishedAt = new Date().toISOString();
    }
  }

  // Normalize nullable experience refs
  if (patch.tourId === null) patch.tourId = undefined;
  if (patch.progressId === null) patch.progressId = undefined;
  if (patch.liveSiteId === null) patch.liveSiteId = undefined;

  const project = await update("projects", id, patch);
  if (!project) return jsonError("Project not found", 404);

  const action =
    patch.publishStatus === "published"
      ? "publish"
      : patch.publishStatus === "archived"
        ? "unpublish"
        : "update";

  await appendAuditLog({
    actorId: auth.session.userId,
    action,
    entityType: "project",
    entityId: id,
  });

  return NextResponse.json({ project });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireApiSession("project:write");
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  await initializeCmsStore();
  const ok = await remove("projects", id);
  if (!ok) return jsonError("Project not found", 404);

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "delete",
    entityType: "project",
    entityId: id,
  });

  return NextResponse.json({ ok: true });
}
