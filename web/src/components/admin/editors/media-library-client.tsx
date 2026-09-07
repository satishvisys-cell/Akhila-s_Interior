"use client";

import { useRef, useState } from "react";
import type { MediaAsset } from "@/domain/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function MediaLibraryClient({
  initialMedia,
  canWrite,
}: {
  initialMedia: MediaAsset[];
  canWrite: boolean;
}) {
  const { toast } = useToast();
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onUpload(file: File) {
    if (!canWrite) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", file.name.replace(/\.[^.]+$/, ""));
      form.append("folder", "uploads");

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as {
        media?: MediaAsset;
        error?: string;
        details?: string[];
      };
      if (!res.ok || !data.media) {
        toast({
          title: "Upload failed",
          description: data.error ?? data.details?.join(", ") ?? "Unknown error",
          tone: "error",
        });
        return;
      }
      setMedia((prev) => [data.media!, ...prev]);
      toast({ title: "Upload complete", tone: "success" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-h2 text-text">Media Library</h1>
          <p className="mt-2 text-text-muted">
            Upload and manage images and videos. MIME types are validated
            server-side.
          </p>
        </div>
        {canWrite ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onUpload(file);
                e.target.value = "";
              }}
            />
            <Button
              variant="charcoal"
              loading={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Upload
            </Button>
          </>
        ) : null}
      </div>

      {media.length === 0 ? (
        <p className="text-small text-text-muted">No media assets yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <article
              key={item.id}
              className="border border-border bg-elevated overflow-hidden rounded-[var(--radius-md)]"
            >
              <div className="aspect-[4/3] bg-surface">
                {item.kind === "video" ? (
                  <div className="flex h-full items-center justify-center label-caps text-text-muted">
                    Video
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.publicUrl ?? `/media/${item.storageKey}`}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="px-3 py-3">
                <p className="truncate text-small text-text">{item.alt}</p>
                <p className="mt-1 label-caps text-text-muted">
                  {item.kind} · {item.width}×{item.height}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
