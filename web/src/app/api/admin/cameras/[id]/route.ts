import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { cameraPatchSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import {
  getById,
  initializeCmsStore,
  remove,
  removeCameraSecret,
  update,
} from "@/lib/cms/store";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireApiSession("camera:manage");
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const sanitized =
    body && typeof body === "object"
      ? Object.fromEntries(
          Object.entries(body as Record<string, unknown>).filter(
            ([key]) =>
              ![
                "rtspUrl",
                "username",
                "password",
                "hlsProxyUrl",
                "secret",
                "streamSourceId",
              ].includes(key),
          ),
        )
      : body;

  const parsed = cameraPatchSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const existing = await getById("cameras", id);
  if (!existing) return jsonError("Camera not found", 404);

  const camera = await update("cameras", id, parsed.data);
  if (!camera) return jsonError("Camera not found", 404);

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "update",
    entityType: "camera",
    entityId: id,
  });

  return NextResponse.json({
    camera: {
      id: camera.id,
      name: camera.name,
      locationLabel: camera.locationLabel,
      status: camera.status,
      visibility: camera.visibility,
      sortOrder: camera.sortOrder,
      projectId: camera.projectId ?? null,
      streamSourceId: camera.streamSourceId,
      lastSeenAt: camera.lastSeenAt,
    },
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireApiSession("camera:manage");
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  await initializeCmsStore();
  const existing = await getById("cameras", id);
  if (!existing) return jsonError("Camera not found", 404);

  await removeCameraSecret(existing.streamSourceId);
  await remove("cameras", id);

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "delete",
    entityType: "camera",
    entityId: id,
    meta: { streamSourceId: existing.streamSourceId },
  });

  return NextResponse.json({ ok: true, id });
}
