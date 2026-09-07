import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { cameraSecretSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import {
  getById,
  initializeCmsStore,
  setCameraSecret,
} from "@/lib/cms/store";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Writes camera stream credentials to server-only camera-secrets.json.
 * Response never echoes secret values.
 */
export async function POST(request: Request, context: RouteContext) {
  const auth = await requireApiSession("camera:manage");
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = cameraSecretSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const camera = await getById("cameras", id);
  if (!camera) return jsonError("Camera not found", 404);

  await setCameraSecret(camera.streamSourceId, parsed.data);

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "settings_change",
    entityType: "camera_secret",
    entityId: id,
    meta: {
      streamSourceId: camera.streamSourceId,
      fields: Object.keys(parsed.data),
    },
  });

  return NextResponse.json({
    ok: true,
    cameraId: id,
    streamSourceId: camera.streamSourceId,
    secretConfigured: true,
  });
}
