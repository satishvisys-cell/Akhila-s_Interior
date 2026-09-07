import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { pageCreateSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import { create, initializeCmsStore, list } from "@/lib/cms/store";

export async function GET() {
  const auth = await requireApiSession("page:write");
  if (!auth.ok) return auth.response;

  await initializeCmsStore();
  const pages = await list("pages");
  return NextResponse.json({ pages });
}

export async function POST(request: Request) {
  const auth = await requireApiSession("page:write");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = pageCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const data = parsed.data;

  const now = new Date().toISOString();
  const page = await create("pages", {
    id: nanoid(),
    title: data.title,
    slug: data.slug,
    publishStatus: data.publishStatus,
    seo: { title: data.title },
    blocks: [],
    createdAt: now,
    updatedAt: now,
  });

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "create",
    entityType: "page",
    entityId: page.id,
  });

  return NextResponse.json({ page }, { status: 201 });
}
