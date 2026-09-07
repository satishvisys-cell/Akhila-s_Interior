import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { heroPatchSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import { getById, initializeCmsStore, update } from "@/lib/cms/store";
import type { HeroConfig } from "@/domain/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireApiSession("page:write");
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  await initializeCmsStore();
  const hero = await getById("heroes", id);
  if (!hero) return jsonError("Hero not found", 404);

  return NextResponse.json({ hero });
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

  const parsed = heroPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const existing = await getById("heroes", id);
  if (!existing) return jsonError("Hero not found", 404);

  const data = parsed.data;
  const patch: Partial<HeroConfig> = {};

  for (const key of Object.keys(data) as (keyof typeof data)[]) {
    const value = data[key];
    if (value === null) {
      (patch as Record<string, unknown>)[key] = undefined;
    } else if (value !== undefined) {
      (patch as Record<string, unknown>)[key] = value;
    }
  }

  const hero = await update("heroes", id, patch);
  if (!hero) return jsonError("Hero not found", 404);

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "update",
    entityType: "hero",
    entityId: id,
  });

  return NextResponse.json({ hero });
}
