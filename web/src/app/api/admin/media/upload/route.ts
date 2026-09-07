import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import {
  checkRateLimit,
  recordRateLimitHit,
} from "@/lib/auth/rate-limit";
import { appendAuditLog } from "@/lib/cms/audit";
import { create, initializeCmsStore } from "@/lib/cms/store";
import {
  buildSafeUploadPath,
  validateUpload,
  type AllowedMimeType,
} from "@/lib/security/upload";

const UPLOAD_LIMIT = { windowMs: 15 * 60 * 1000, maxAttempts: 60 };

function mimeToKind(mime: AllowedMimeType): "image" | "video" {
  return mime.startsWith("video/") ? "video" : "image";
}

export async function POST(request: Request) {
  const auth = await requireApiSession("media:write");
  if (!auth.ok) return auth.response;

  const rateKey = `upload:${auth.session.userId}`;
  const limit = checkRateLimit(rateKey, UPLOAD_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Upload rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }
  recordRateLimitHit(rateKey, UPLOAD_LIMIT);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Expected multipart form data", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError("Missing file field", 400);
  }

  const alt = String(formData.get("alt") ?? file.name).slice(0, 500);
  const folder = String(formData.get("folder") ?? "uploads").slice(0, 120);
  const declaredMime = file.type || "application/octet-stream";

  const buffer = new Uint8Array(await file.arrayBuffer());
  const validation = validateUpload(buffer, declaredMime);

  if (!validation.ok || !validation.mimeType) {
    return NextResponse.json(
      { error: "Upload validation failed", details: validation.errors },
      { status: 400 },
    );
  }

  await initializeCmsStore();

  const id = nanoid();
  const ext =
    validation.mimeType === "image/jpeg"
      ? "jpg"
      : validation.mimeType === "image/png"
        ? "png"
        : validation.mimeType === "image/webp"
          ? "webp"
          : validation.mimeType === "image/avif"
            ? "avif"
            : validation.mimeType === "video/mp4"
              ? "mp4"
              : "webm";

  const relativeKey = buildSafeUploadPath(folder, `${id}.${ext}`);
  const publicDir = path.join(process.cwd(), "public", "media");
  const absolutePath = path.join(publicDir, relativeKey);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, buffer);

  const publicUrl = `/media/${relativeKey}`;
  const kind = mimeToKind(validation.mimeType);

  const now = new Date().toISOString();
  const asset = await create("media", {
    id,
    kind,
    storageKey: relativeKey,
    publicUrl,
    width: kind === "image" ? 1920 : 1280,
    height: kind === "image" ? 1280 : 720,
    alt,
    tags: [],
    folder,
    metadata: {
      originalName: file.name,
      mimeType: validation.mimeType,
      sizeBytes: buffer.byteLength,
    },
    derivatives: {
      original: {
        key: "original",
        url: publicUrl,
        width: kind === "image" ? 1920 : 1280,
        height: kind === "image" ? 1280 : 720,
        mimeType: validation.mimeType,
        sizeBytes: buffer.byteLength,
      },
    },
    createdAt: now,
    updatedAt: now,
  });

  await appendAuditLog({
    actorId: auth.session.userId,
    action: "create",
    entityType: "media",
    entityId: asset.id,
    meta: { mimeType: validation.mimeType, sizeBytes: buffer.byteLength },
  });

  return NextResponse.json({ media: asset }, { status: 201 });
}
