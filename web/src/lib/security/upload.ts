export type AllowedMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/avif"
  | "video/mp4"
  | "video/webm";

export const ALLOWED_MIME_TYPES: readonly AllowedMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
] as const;

export const MAX_FILE_SIZES: Record<AllowedMimeType, number> = {
  "image/jpeg": 15 * 1024 * 1024,
  "image/png": 15 * 1024 * 1024,
  "image/webp": 15 * 1024 * 1024,
  "image/avif": 15 * 1024 * 1024,
  "video/mp4": 250 * 1024 * 1024,
  "video/webm": 250 * 1024 * 1024,
};

const MAGIC_BYTES: Partial<Record<AllowedMimeType, number[]>> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
  "image/avif": [0x00, 0x00, 0x00],
  "video/mp4": [0x00, 0x00, 0x00],
  "video/webm": [0x1a, 0x45, 0xdf, 0xa3],
};

export interface UploadValidationResult {
  ok: boolean;
  mimeType?: AllowedMimeType;
  errors: string[];
}

export interface UploadValidationOptions {
  maxSizeOverride?: number;
  skipMagicCheck?: boolean;
}

function matchesMagicBytes(buffer: Uint8Array, mime: AllowedMimeType): boolean {
  const signature = MAGIC_BYTES[mime];
  if (!signature) return true;

  if (mime === "image/avif" || mime === "video/mp4") {
    if (buffer.length < 12) return false;
    const brand = String.fromCharCode(...buffer.slice(8, 12));
    return brand.includes("ftyp") || brand.includes("avif");
  }

  if (mime === "image/webp") {
    if (buffer.length < 12) return false;
    const webp = String.fromCharCode(...buffer.slice(8, 12));
    return webp === "WEBP";
  }

  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) return false;
  }
  return true;
}

export function isAllowedMimeType(mime: string): mime is AllowedMimeType {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export function sanitizeFilename(filename: string): string {
  const base = filename
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/\.\./g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);

  return base && base.length > 0 ? base : "upload.bin";
}

export function assertSafePathSegment(segment: string): void {
  if (
    !segment ||
    segment.includes("..") ||
    segment.includes("/") ||
    segment.includes("\\") ||
    segment.startsWith(".")
  ) {
    throw new Error("Invalid path segment");
  }
}

export function buildSafeUploadPath(folder: string, filename: string): string {
  const safeFolder = folder
    .split("/")
    .filter(Boolean)
    .map((part) => {
      assertSafePathSegment(part);
      return part;
    })
    .join("/");

  const safeName = sanitizeFilename(filename);
  return safeFolder ? `${safeFolder}/${safeName}` : safeName;
}

export function validateUpload(
  buffer: Uint8Array,
  declaredMime: string,
  options: UploadValidationOptions = {},
): UploadValidationResult {
  const errors: string[] = [];

  if (!isAllowedMimeType(declaredMime)) {
    return { ok: false, errors: [`MIME type not allowed: ${declaredMime}`] };
  }

  const maxSize = options.maxSizeOverride ?? MAX_FILE_SIZES[declaredMime];
  if (buffer.byteLength > maxSize) {
    errors.push(
      `File exceeds maximum size of ${Math.round(maxSize / (1024 * 1024))}MB`,
    );
  }

  if (buffer.byteLength === 0) {
    errors.push("File is empty");
  }

  if (!options.skipMagicCheck && !matchesMagicBytes(buffer, declaredMime)) {
    errors.push("File content does not match declared MIME type");
  }

  return {
    ok: errors.length === 0,
    mimeType: declaredMime,
    errors,
  };
}
