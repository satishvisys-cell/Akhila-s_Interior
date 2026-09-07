import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import type { AuditAction, AuditLog } from "@/domain/types";

function getAuditDir(): string {
  const dataDir = process.env.CMS_DATA_DIR ?? path.join(process.cwd(), "data");
  return path.join(dataDir, "audit");
}

function getAuditFilePath(): string {
  return path.join(getAuditDir(), "audit.jsonl");
}

async function ensureAuditDir(): Promise<void> {
  await mkdir(getAuditDir(), { recursive: true });
}

export interface AppendAuditInput {
  actorId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  meta?: Record<string, unknown>;
}

export async function appendAuditLog(input: AppendAuditInput): Promise<AuditLog> {
  await ensureAuditDir();

  const entry: AuditLog = {
    id: nanoid(),
    actorId: input.actorId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    meta: input.meta,
    createdAt: new Date().toISOString(),
  };

  const line = `${JSON.stringify(entry)}\n`;
  await appendFile(getAuditFilePath(), line, "utf8");

  return entry;
}

export interface AuditQueryOptions {
  limit?: number;
  actorId?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
}

export async function readAuditLogs(
  options: AuditQueryOptions = {},
): Promise<AuditLog[]> {
  const filePath = getAuditFilePath();

  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }

  const lines = raw.split("\n").filter(Boolean);
  let entries: AuditLog[] = [];

  for (const line of lines) {
    try {
      entries.push(JSON.parse(line) as AuditLog);
    } catch {
      // Skip malformed lines — append-only log should remain readable
    }
  }

  if (options.actorId) {
    entries = entries.filter((e) => e.actorId === options.actorId);
  }
  if (options.entityType) {
    entries = entries.filter((e) => e.entityType === options.entityType);
  }
  if (options.entityId) {
    entries = entries.filter((e) => e.entityId === options.entityId);
  }
  if (options.action) {
    entries = entries.filter((e) => e.action === options.action);
  }

  entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const limit = options.limit ?? 100;
  return entries.slice(0, limit);
}

export async function getRecentAuditForEntity(
  entityType: string,
  entityId: string,
  limit = 20,
): Promise<AuditLog[]> {
  return readAuditLogs({ entityType, entityId, limit });
}
