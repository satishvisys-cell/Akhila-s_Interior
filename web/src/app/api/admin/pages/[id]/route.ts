import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { pagePatchSchema } from "@/lib/api/schemas";
import { can } from "@/domain/permissions";
import { appendAuditLog } from "@/lib/cms/audit";
import { getById, initializeCmsStore, update } from "@/lib/cms/store";
import type { Page, PageBlock } from "@/domain/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireApiSession("page:write");
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  await initializeCmsStore();
  const page = await getById("pages", id);
  if (!page) return jsonError("Page not found", 404);

  return NextResponse.json({ page });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireApiSession("page:write");
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = pagePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const existing = await getById("pages", id);
  if (!existing) return jsonError("Page not found", 404);

  const patch: Partial<Page> = {};
  const data = parsed.data;

  if (data.title !== undefined) patch.title = data.title;
  if (data.slug !== undefined) patch.slug = data.slug;
  if (data.seo !== undefined) patch.seo = { ...existing.seo, ...data.seo };
  if (data.blocks !== undefined) {
    patch.blocks = data.blocks as unknown as PageBlock[];
  }

  if (data.publishStatus !== undefined) {
    if (
      data.publishStatus !== existing.publishStatus &&
      !can(auth.session.role, "page:publish")
    ) {
      return jsonError("Missing page:publish permission", 403);
    }
    patch.publishStatus = data.publishStatus;
    if (data.publishStatus === "published") {
      patch.publishedAt = new Date().toISOString();
    }
  }

  const page = await update("pages", id, patch);
  if (!page) return jsonError("Page not found", 404);

  await appendAuditLog({
    actorId: auth.session.userId,
    action:
      data.publishStatus === "published"
        ? "publish"
        : data.publishStatus === "archived"
          ? "unpublish"
          : "update",
    entityType: "page",
    entityId: id,
  });

  return NextResponse.json({ page });
}
