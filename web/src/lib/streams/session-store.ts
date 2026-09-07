import { nanoid } from "nanoid";

export type StreamPlaybackSession = {
  token: string;
  cameraId: string;
  streamSourceId: string;
  actorId: string;
  expiresAt: number;
};

/** In-memory playback tokens — never include RTSP credentials */
const sessions = new Map<string, StreamPlaybackSession>();

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function mintStreamSession(input: {
  cameraId: string;
  streamSourceId: string;
  actorId: string;
  ttlMs?: number;
}): StreamPlaybackSession {
  pruneExpired();

  const token = nanoid(32);
  const expiresAt = Date.now() + (input.ttlMs ?? DEFAULT_TTL_MS);
  const session: StreamPlaybackSession = {
    token,
    cameraId: input.cameraId,
    streamSourceId: input.streamSourceId,
    actorId: input.actorId,
    expiresAt,
  };
  sessions.set(token, session);
  return session;
}

export function getStreamSession(token: string): StreamPlaybackSession | null {
  pruneExpired();
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function pruneExpired(): void {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}
