"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import type { BlockType, Page, PageBlock, RoleKey } from "@/domain/types";
import { can } from "@/domain/permissions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { ContentStatusBadge } from "@/components/admin/status-badge";
import { cn } from "@/lib/cn";

const BLOCK_LIBRARY: { type: BlockType; label: string }[] = [
  { type: "hero", label: "Hero" },
  { type: "text", label: "Text" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
  { type: "gallery", label: "Gallery" },
  { type: "project_grid", label: "Project grid" },
  { type: "statistics", label: "Statistics" },
  { type: "testimonials", label: "Testimonials" },
  { type: "timeline", label: "Timeline" },
  { type: "master_tour", label: "Master tour" },
  { type: "room_explorer", label: "Room explorer" },
  { type: "live_cctv", label: "Live CCTV" },
  { type: "construction_progress", label: "Construction progress" },
  { type: "cta", label: "CTA" },
  { type: "faq", label: "FAQ" },
  { type: "team", label: "Team" },
  { type: "html", label: "HTML" },
];

function defaultProps(type: BlockType): PageBlock["props"] {
  switch (type) {
    case "hero":
      return { heroId: "" };
    case "text":
      return { body: "New text block", heading: "Heading" };
    case "image":
      return { mediaId: "" };
    case "video":
      return { mediaId: "" };
    case "gallery":
      return { mediaIds: [], layout: "grid" };
    case "project_grid":
      return { heading: "Projects", limit: 4 };
    case "statistics":
      return { items: [{ value: "0", label: "Metric" }] };
    case "testimonials":
      return { testimonialIds: [] };
    case "timeline":
      return { events: [] };
    case "master_tour":
      return { tourId: "" };
    case "room_explorer":
      return { projectId: "" };
    case "live_cctv":
      return { liveSiteId: "" };
    case "construction_progress":
      return { progressId: "" };
    case "cta":
      return {
        heading: "Get in touch",
        primaryCta: { label: "Contact", href: "/contact" },
      };
    case "faq":
      return { items: [] };
    case "team":
      return { memberIds: [] };
    case "html":
      return { html: "<p></p>" };
    default:
      return { body: "" };
  }
}

function createBlock(type: BlockType, order: number): PageBlock {
  return {
    id: nanoid(),
    type,
    order,
    visible: true,
    props: defaultProps(type),
  } as PageBlock;
}

export function PageBuilder({
  page: initial,
  role,
}: {
  page: Page;
  role: RoleKey;
}) {
  const { toast } = useToast();
  const [page, setPage] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(
    initial.blocks[0]?.id ?? null,
  );
  const [saving, setSaving] = useState(false);

  const canWrite = can(role, "page:write");
  const canPublish = can(role, "page:publish");

  const blocks = useMemo(
    () => [...page.blocks].sort((a, b) => a.order - b.order),
    [page.blocks],
  );
  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function setBlocks(next: PageBlock[]) {
    setPage((prev) => ({
      ...prev,
      blocks: next.map((b, i) => ({ ...b, order: i })),
    }));
  }

  function addBlock(type: BlockType) {
    if (!canWrite) return;
    const block = createBlock(type, blocks.length);
    setBlocks([...blocks, block]);
    setSelectedId(block.id);
  }

  function moveBlock(id: string, direction: -1 | 1) {
    const index = blocks.findIndex((b) => b.id === id);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setBlocks(next);
  }

  function duplicateBlock(id: string) {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const copy = {
      ...structuredClone(block),
      id: nanoid(),
      order: blocks.length,
    } as PageBlock;
    setBlocks([...blocks, copy]);
    setSelectedId(copy.id);
  }

  function toggleVisible(id: string) {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)),
    );
  }

  function deleteBlock(id: string) {
    const next = blocks.filter((b) => b.id !== id);
    setBlocks(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  }

  function updateSelectedProps(props: Record<string, unknown>) {
    if (!selected) return;
    setBlocks(
      blocks.map((b) =>
        b.id === selected.id
          ? ({ ...b, props: { ...b.props, ...props } } as PageBlock)
          : b,
      ),
    );
  }

  async function persist(extra?: Partial<Page>) {
    if (!canWrite) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          blocks: page.blocks,
          ...extra,
        }),
      });
      const data = (await res.json()) as { page?: Page; error?: string };
      if (!res.ok || !data.page) {
        toast({
          title: "Save failed",
          description: data.error ?? "Unable to save page",
          tone: "error",
        });
        return;
      }
      setPage(data.page);
      toast({ title: "Page saved", tone: "success" });
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    if (!canPublish) {
      toast({
        title: "Permission denied",
        description: "You need page:publish",
        tone: "error",
      });
      return;
    }
    await persist({ publishStatus: "published" });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-h2 text-text">{page.title}</h1>
          <div className="mt-2 flex items-center gap-3">
            <ContentStatusBadge
              status={
                page.publishStatus === "scheduled"
                  ? "draft"
                  : page.publishStatus === "draft" ||
                      page.publishStatus === "published" ||
                      page.publishStatus === "archived"
                    ? page.publishStatus
                    : "draft"
              }
            />
            <span className="text-caption text-text-muted">/{page.slug}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/preview/page/${page.id}`}
            className="inline-flex h-11 items-center border border-text/80 px-5 text-xs uppercase tracking-[0.1em] hover:bg-text hover:text-text-inverse rounded-[var(--radius-md)]"
            target="_blank"
          >
            Preview
          </Link>
          <Button
            variant="secondary"
            loading={saving}
            disabled={!canWrite}
            onClick={() => void persist()}
          >
            Save
          </Button>
          <Button
            variant="charcoal"
            disabled={!canPublish}
            onClick={() => void publish()}
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="grid min-h-[70vh] gap-4 lg:grid-cols-[220px_1fr_280px]">
        {/* Library */}
        <aside className="border border-border bg-elevated p-3 rounded-[var(--radius-md)]">
          <p className="mb-3 label-caps text-text-muted">Blocks</p>
          <ul className="flex flex-col gap-1">
            {BLOCK_LIBRARY.map((item) => (
              <li key={item.type}>
                <button
                  type="button"
                  disabled={!canWrite}
                  onClick={() => addBlock(item.type)}
                  className="w-full px-3 py-2 text-left text-small text-text hover:bg-surface rounded-[var(--radius-sm)] disabled:opacity-40"
                >
                  + {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Canvas */}
        <section className="border border-border bg-surface p-4 rounded-[var(--radius-md)]">
          <p className="mb-4 label-caps text-text-muted">Canvas</p>
          {blocks.length === 0 ? (
            <p className="text-small text-text-muted">
              Add a block from the library to begin.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {blocks.map((block) => (
                <li key={block.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(block.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 border px-4 py-3 text-left rounded-[var(--radius-sm)]",
                      selectedId === block.id
                        ? "border-accent bg-elevated"
                        : "border-border bg-elevated/60 hover:border-text/30",
                      !block.visible && "opacity-50",
                    )}
                  >
                    <span>
                      <span className="label-caps text-accent">{block.type}</span>
                      <span className="mt-1 block text-small text-text">
                        {block.visible ? "Visible" : "Hidden"}
                      </span>
                    </span>
                    <span className="text-caption text-text-muted">
                      #{block.order + 1}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Inspector */}
        <aside className="border border-border bg-elevated p-4 rounded-[var(--radius-md)]">
          <p className="mb-3 label-caps text-text-muted">Inspector</p>
          {!selected ? (
            <p className="text-small text-text-muted">Select a block</p>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-small font-medium text-text">{selected.type}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveBlock(selected.id, -1)}
                >
                  Up
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveBlock(selected.id, 1)}
                >
                  Down
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => duplicateBlock(selected.id)}
                >
                  Duplicate
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleVisible(selected.id)}
                >
                  {selected.visible ? "Hide" : "Show"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => deleteBlock(selected.id)}
                >
                  Delete
                </Button>
              </div>

              {selected.type === "text" ? (
                <>
                  <div>
                    <Label>Heading</Label>
                    <Input
                      value={
                        (selected.props as { heading?: string }).heading ?? ""
                      }
                      onChange={(e) =>
                        updateSelectedProps({ heading: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Body</Label>
                    <Textarea
                      value={(selected.props as { body: string }).body}
                      onChange={(e) =>
                        updateSelectedProps({ body: e.target.value })
                      }
                    />
                  </div>
                </>
              ) : null}

              {selected.type === "hero" ? (
                <div>
                  <Label>Hero ID</Label>
                  <Input
                    value={(selected.props as { heroId: string }).heroId}
                    onChange={(e) =>
                      updateSelectedProps({ heroId: e.target.value })
                    }
                  />
                </div>
              ) : null}

              {selected.type === "cta" ? (
                <>
                  <div>
                    <Label>Heading</Label>
                    <Input
                      value={(selected.props as { heading: string }).heading}
                      onChange={(e) =>
                        updateSelectedProps({ heading: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>CTA label</Label>
                    <Input
                      value={
                        (selected.props as { primaryCta: { label: string } })
                          .primaryCta.label
                      }
                      onChange={(e) =>
                        updateSelectedProps({
                          primaryCta: {
                            ...(selected.props as { primaryCta: object })
                              .primaryCta,
                            label: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </>
              ) : null}

              {selected.type === "project_grid" ? (
                <>
                  <div>
                    <Label>Heading</Label>
                    <Input
                      value={
                        (selected.props as { heading?: string }).heading ?? ""
                      }
                      onChange={(e) =>
                        updateSelectedProps({ heading: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Limit</Label>
                    <Input
                      type="number"
                      value={
                        (selected.props as { limit?: number }).limit ?? 4
                      }
                      onChange={(e) =>
                        updateSelectedProps({
                          limit: Number(e.target.value) || 4,
                        })
                      }
                    />
                  </div>
                </>
              ) : null}

              {!["text", "hero", "cta", "project_grid"].includes(
                selected.type,
              ) ? (
                <div>
                  <Label>Props (JSON)</Label>
                  <Textarea
                    value={JSON.stringify(selected.props, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value) as Record<
                          string,
                          unknown
                        >;
                        updateSelectedProps(parsed);
                      } catch {
                        // ignore invalid JSON while typing
                      }
                    }}
                  />
                </div>
              ) : null}

              <div>
                <Label>Page title</Label>
                <Input
                  value={page.title}
                  disabled={!canWrite}
                  onChange={(e) =>
                    setPage((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={page.slug}
                  disabled={!canWrite}
                  onChange={(e) =>
                    setPage((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Publish status</Label>
                <Select
                  value={page.publishStatus}
                  disabled={!canPublish}
                  onChange={(e) =>
                    setPage((prev) => ({
                      ...prev,
                      publishStatus: e.target
                        .value as Page["publishStatus"],
                    }))
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
