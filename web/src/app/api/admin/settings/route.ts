import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { settingsNavSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";
import { initializeCmsStore, list, update } from "@/lib/cms/store";

export async function GET() {
  const auth = await requireApiSession("settings:write");
  if (!auth.ok) return auth.response;

  await initializeCmsStore();
  const settings = await list("settings");
  return NextResponse.json({ settings: settings[0] ?? null });
}

export async function PATCH(request: Request) {
  const auth = await requireApiSession("settings:write");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = settingsNavSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await initializeCmsStore();
  const settingsList = await list("settings");
  const current = settingsList[0];
  if (!current) return jsonError("Settings not found", 404);

  const settings = await update("settings", current.id, parsed.data);
  if (!settings) return jsonError("Settings not found", 404);

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "settings_change",
    entityType: "settings",
    entityId: current.id,
  });

  return NextResponse.json({ settings });
}
