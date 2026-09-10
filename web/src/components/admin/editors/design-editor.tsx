"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Design } from "@/domain/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function DesignEditor({
  design,
  canWrite,
}: {
  design?: Design;
  canWrite: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const isNew = !design;
  const [title, setTitle] = useState(design?.title ?? "");
  const [slug, setSlug] = useState(design?.slug ?? "");
  const [description, setDescription] = useState(design?.description ?? "");
  const [coverMediaId, setCoverMediaId] = useState(design?.coverMediaId ?? "");
  const [categories, setCategories] = useState(
    design?.categories.join(", ") ?? "Interior",
  );
  const [publishStatus, setPublishStatus] = useState(
    design?.publishStatus ?? "draft",
  );
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!canWrite) return;
    setSaving(true);
    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        description,
        coverMediaId,
        categories: categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        publishStatus,
      };

      const res = await fetch(
        isNew ? "/api/admin/designs" : `/api/admin/designs/${design.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast({
          title: "Save failed",
          description: data.error ?? "Unable to save design",
          tone: "error",
        });
        return;
      }
      const data = (await res.json()) as { design: Design };
      toast({ title: "Design saved", tone: "success" });
      if (isNew) router.push(`/admin/designs/${data.design.id}`);
      else router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 text-text">
            {isNew ? "New design" : "Edit design"}
          </h1>
          <p className="mt-2 text-text-muted">
            Designs appear on the public Designs page when published. Upload
            media in the media library, then paste the media ID here.
          </p>
        </div>
        {canWrite ? (
          <Button onClick={save} loading={saving} variant="charcoal">
            Save
          </Button>
        ) : null}
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          disabled={!canWrite}
          onChange={(e) => {
            setTitle(e.target.value);
            if (isNew) setSlug(slugify(e.target.value));
          }}
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          disabled={!canWrite}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="cover">Cover media ID</Label>
        <Input
          id="cover"
          value={coverMediaId}
          disabled={!canWrite}
          onChange={(e) => setCoverMediaId(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="categories">Categories (comma-separated)</Label>
        <Input
          id="categories"
          value={categories}
          disabled={!canWrite}
          onChange={(e) => setCategories(e.target.value)}
          placeholder="Residential, Interior"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={description}
          disabled={!canWrite}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="status">Publish status</Label>
        <select
          id="status"
          className="mt-1 w-full rounded-[var(--radius-md)] border border-border bg-elevated px-3 py-2 text-sm"
          value={publishStatus}
          disabled={!canWrite}
          onChange={(e) =>
            setPublishStatus(e.target.value as Design["publishStatus"])
          }
        >
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </select>
      </div>
    </div>
  );
}
