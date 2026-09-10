import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { designCreateSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import { create, initializeCmsStore, list } from "@/lib/cms/store";
import type { Design } from "@/domain/types";

export async function GET() {
  const auth = await requireApiSession("project:read");
  if (!auth.ok) return auth.response;

  await initializeCmsStore();
  const designs = await list("designs");
  return NextResponse.json({ designs });
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

  const parsed = designCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const data = parsed.data;
  const now = new Date().toISOString();

  const design = await create("designs", {
    id: nanoid(),
    title: data.title,
    slug: data.slug,
    description: data.description,
    coverMediaId: data.coverMediaId,
    galleryMediaIds: [],
    categories: data.categories,
    publishStatus: data.publishStatus,
    publishedAt: data.publishStatus === "published" ? now : undefined,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  } as Omit<Design, "id"> & { id?: string });

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "create",
    entityType: "design",
    entityId: design.id,
  });

  return NextResponse.json({ design }, { status: 201 });
}
