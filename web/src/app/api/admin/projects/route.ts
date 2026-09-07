import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { projectCreateSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import { create, initializeCmsStore, list } from "@/lib/cms/store";
import type { Project } from "@/domain/types";

export async function GET() {
  const auth = await requireApiSession("project:read");
  if (!auth.ok) return auth.response;

  await initializeCmsStore();
  const projects = await list("projects");
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const auth = await requireApiSession("project:write");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const data = parsed.data;
  const now = new Date().toISOString();

  const project = await create("projects", {
    id: nanoid(),
    name: data.name,
    slug: data.slug,
    location: data.location,
    category: data.category,
    year: data.year,
    areaSqm: data.areaSqm,
    status: data.status,
    description: data.description,
    coverMediaId: data.coverMediaId ?? "",
    publishStatus: data.publishStatus,
    publishedAt: data.publishStatus === "published" ? now : undefined,
    sortOrder: 0,
    galleryMediaIds: [],
    videoMediaIds: [],
    materials: [],
    diagramIds: [],
    roomIds: [],
    updates: [],
    createdAt: now,
    updatedAt: now,
  } as Omit<Project, "id"> & { id?: string });

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "create",
    entityType: "project",
    entityId: project.id,
  });

  return NextResponse.json({ project }, { status: 201 });
}
