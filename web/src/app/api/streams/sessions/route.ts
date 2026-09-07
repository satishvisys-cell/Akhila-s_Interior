import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { streamSessionSchema } from "@/lib/api/schemas";
import { can } from "@/domain/permissions";
import { getSession } from "@/lib/auth/session";
import { appendAuditLog } from "@/lib/cms/audit";
import { getById, initializeCmsStore } from "@/lib/cms/store";
import { mintStreamSession } from "@/lib/streams/session-store";

/**
 * Mint a short-lived playback session.
 * Returns only { playbackUrl, expiresAt } — never RTSP or credentials.
 */
export async function POST(request: Request) {
  await initializeCmsStore();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = streamSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const camera = await getById("cameras", parsed.data.cameraId);
  if (!camera) return jsonError("Camera not found", 404);

  const session = await getSession();
  const isPublic = camera.visibility === "public";
  const canView =
    isPublic || (session !== null && can(session.role, "camera:view"));

  if (!canView) {
    return jsonError("Forbidden", 403);
  }

  // Optional stronger gate for private cameras via requireApiSession
  if (!isPublic) {
    const auth = await requireApiSession("camera:view");
    if (!auth.ok) return auth.response;
  }

  const actorId = session?.userId ?? "public";
  const playback = mintStreamSession({
    cameraId: camera.id,
    streamSourceId: camera.streamSourceId,
    actorId,
  });

  await appendAuditLog({
    actorId,
    action: "stream_session",
    entityType: "camera",
    entityId: camera.id,
    meta: {
      expiresAt: new Date(playback.expiresAt).toISOString(),
      visibility: camera.visibility,
    },
  });

  return NextResponse.json({
    playbackUrl: `/api/streams/playback/${playback.token}`,
    expiresAt: new Date(playback.expiresAt).toISOString(),
  });
}
