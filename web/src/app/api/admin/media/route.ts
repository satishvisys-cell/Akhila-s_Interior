import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { mediaCreateSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import { create, initializeCmsStore, list } from "@/lib/cms/store";

export async function GET() {
  const auth = await requireApiSession("project:read");
  if (!auth.ok) return auth.response;

  await initializeCmsStore();
  const media = await list("media");
  return NextResponse.json({ media });
}

export async function POST(request: Request) {
  const auth = await requireApiSession("media:write");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = mediaCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const data = parsed.data;
  const id = nanoid();
  const storageKey = `${data.folder ?? "uploads"}/${id}`;

  const now = new Date().toISOString();
  const asset = await create("media", {
    id,
    kind: data.kind,
    storageKey,
    publicUrl: `/media/${storageKey}`,
    width: 1920,
    height: 1080,
    alt: data.alt,
    tags: data.tags,
    folder: data.folder ?? "uploads",
    metadata: {},
    derivatives: {},
    createdAt: now,
    updatedAt: now,
  });

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "create",
    entityType: "media",
    entityId: asset.id,
  });

  return NextResponse.json({ media: asset }, { status: 201 });
}
