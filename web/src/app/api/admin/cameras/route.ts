import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { cameraCreateSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import { create, initializeCmsStore, list } from "@/lib/cms/store";

export async function GET() {
  const auth = await requireApiSession("camera:view");
  if (!auth.ok) return auth.response;

  await initializeCmsStore();
  const cameras = await list("cameras");
  // Never include secrets
  return NextResponse.json({ cameras });
}

export async function POST(request: Request) {
  const auth = await requireApiSession("camera:manage");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  // Strip any secret fields client may have sent — never echo them
  const sanitized =
    body && typeof body === "object"
      ? Object.fromEntries(
          Object.entries(body as Record<string, unknown>).filter(
            ([key]) =>
              !["rtspUrl", "username", "password", "hlsProxyUrl", "secret"].includes(
                key,
              ),
          ),
        )
      : body;

  const parsed = cameraCreateSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const data = parsed.data;
  const streamSourceId = data.streamSourceId ?? `cam-src-${nanoid(10)}`;

  const camera = await create("cameras", {
    id: nanoid(),
    name: data.name,
    locationLabel: data.locationLabel,
    status: data.status,
    visibility: data.visibility,
    sortOrder: data.sortOrder,
    projectId: data.projectId ?? null,
    streamSourceId,
  });

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "create",
    entityType: "camera",
    entityId: camera.id,
  });

  // Response must never include secrets
  return NextResponse.json(
    {
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
    },
    { status: 201 },
  );
}
