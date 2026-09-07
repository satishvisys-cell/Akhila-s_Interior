import { NextResponse } from "next/server";
import { getCameraSecret, initializeCmsStore } from "@/lib/cms/store";
import { getStreamSession } from "@/lib/streams/session-store";

type RouteContext = { params: Promise<{ token: string }> };

/**
 * Stub playback endpoint.
 * Validates the short-lived token and returns HLS proxy metadata when configured.
 * Never returns RTSP URLs, usernames, or passwords.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  const session = getStreamSession(token);
  if (!session) {
    return NextResponse.json({ error: "Session expired or invalid" }, { status: 401 });
  }

  await initializeCmsStore();
  const secret = await getCameraSecret(session.streamSourceId);

  // Only expose opaque playback stub — never credentials
  return NextResponse.json({
    status: "ready",
    cameraId: session.cameraId,
    expiresAt: new Date(session.expiresAt).toISOString(),
    // Public HLS proxy URL if configured; never RTSP
    stream: secret?.hlsProxyUrl
      ? { type: "hls", url: secret.hlsProxyUrl }
      : { type: "stub", message: "Stream proxy not configured for this camera" },
  });
}
