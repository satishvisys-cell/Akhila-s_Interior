"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Project, RoleKey } from "@/domain/types";
import { can } from "@/domain/permissions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { ContentStatusBadge } from "@/components/admin/status-badge";

type ProjectEditorProps = {
  project: Project;
  role: RoleKey;
};

export function ProjectEditor({ project: initial, role }: ProjectEditorProps) {
  const { toast } = useToast();
  const [project, setProject] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canWrite = can(role, "project:write");
  const canPublish = can(role, "project:publish");

  const patchLocal = useCallback((patch: Partial<Project>) => {
    setProject((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }, []);

  const save = useCallback(
    async (patch?: Partial<Project>) => {
      if (!canWrite) return;
      setSaving(true);
      try {
        const body = patch ?? {
          name: project.name,
          slug: project.slug,
          location: project.location,
          category: project.category,
          year: project.year,
          areaSqm: project.areaSqm,
          description: project.description,
          status: project.status,
          seoTitle: project.seoTitle,
          seoDescription: project.seoDescription,
          seo: project.seo,
          galleryMediaIds: project.galleryMediaIds,
          videoMediaIds: project.videoMediaIds,
          tourId: project.tourId ?? null,
          progressId: project.progressId ?? null,
          liveSiteId: project.liveSiteId ?? null,
        };

        const res = await fetch(`/api/admin/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as {
          project?: Project;
          error?: string;
        };
        if (!res.ok || !data.project) {
          toast({
            title: "Autosave failed",
            description: data.error ?? "Unable to save",
            tone: "error",
          });
          return;
        }
        setProject(data.project);
        setDirty(false);
      } finally {
        setSaving(false);
      }
    },
    [canWrite, project, toast],
  );

  useEffect(() => {
    if (!dirty || !canWrite) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void save();
    }, 800);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dirty, project, canWrite, save]);

  async function setPublishStatus(publishStatus: Project["publishStatus"]) {
    if (!canPublish) {
      toast({
        title: "Permission denied",
        description: "You need project:publish",
        tone: "error",
      });
      return;
    }
    await save({ publishStatus });
    toast({
      title: publishStatus === "published" ? "Published" : "Status updated",
      tone: "success",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="label-caps text-text-muted">Project</p>
          <h1 className="mt-1 font-display text-h2 text-text">{project.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <ContentStatusBadge
              status={
                project.publishStatus === "scheduled"
                  ? "draft"
                  : project.publishStatus === "draft" ||
                      project.publishStatus === "published" ||
                      project.publishStatus === "archived"
                    ? project.publishStatus
                    : "draft"
              }
            />
            <span className="text-caption text-text-muted">
              {saving ? "Saving…" : dirty ? "Unsaved changes" : "Saved"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/projects/${project.slug}?preview=1`}
            className="inline-flex h-11 items-center border border-text/80 px-5 text-xs uppercase tracking-[0.1em] hover:bg-text hover:text-text-inverse rounded-[var(--radius-md)]"
            target="_blank"
          >
            Preview
          </Link>
          {canPublish ? (
            <>
              <Button
                variant="charcoal"
                onClick={() => void setPublishStatus("published")}
                disabled={project.publishStatus === "published"}
              >
                Publish
              </Button>
              <Button
                variant="secondary"
                onClick={() => void setPublishStatus("archived")}
                disabled={project.publishStatus === "archived"}
              >
                Archive
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid max-w-3xl gap-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={project.name}
              disabled={!canWrite}
              onChange={(e) => patchLocal({ name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={project.slug}
              disabled={!canWrite}
              onChange={(e) => patchLocal({ slug: e.target.value })}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={project.location}
                disabled={!canWrite}
                onChange={(e) => patchLocal({ location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={project.category}
                disabled={!canWrite}
                onChange={(e) =>
                  patchLocal({
                    category: e.target.value as Project["category"],
                  })
                }
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="interior">Interior</option>
                <option value="renovation">Renovation</option>
              </Select>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={project.year}
                disabled={!canWrite}
                onChange={(e) =>
                  patchLocal({ year: Number(e.target.value) || project.year })
                }
              />
            </div>
            <div>
              <Label htmlFor="area">Area (sqm)</Label>
              <Input
                id="area"
                type="number"
                value={project.areaSqm}
                disabled={!canWrite}
                onChange={(e) =>
                  patchLocal({
                    areaSqm: Number(e.target.value) || project.areaSqm,
                  })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Project status</Label>
            <Select
              id="status"
              value={project.status}
              disabled={!canWrite}
              onChange={(e) =>
                patchLocal({ status: e.target.value as Project["status"] })
              }
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={project.description}
              disabled={!canWrite}
              onChange={(e) => patchLocal({ description: e.target.value })}
            />
          </div>
        </TabsContent>

        <TabsContent value="media" className="max-w-3xl">
          <p className="text-small text-text-muted">
            Cover media ID and gallery references. Use the media library to
            upload assets, then paste IDs here.
          </p>
          <div className="mt-5">
            <Label htmlFor="cover">Cover media ID</Label>
            <Input
              id="cover"
              value={project.coverMediaId}
              disabled={!canWrite}
              onChange={(e) => patchLocal({ coverMediaId: e.target.value })}
            />
          </div>
          <div className="mt-5">
            <Label htmlFor="gallery">Gallery media IDs (comma-separated)</Label>
            <Input
              id="gallery"
              value={project.galleryMediaIds.join(", ")}
              disabled={!canWrite}
              onChange={(e) =>
                patchLocal({
                  galleryMediaIds: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <div className="mt-5">
            <Label htmlFor="videos">Video media IDs (comma-separated)</Label>
            <Input
              id="videos"
              value={project.videoMediaIds.join(", ")}
              disabled={!canWrite}
              onChange={(e) =>
                patchLocal({
                  videoMediaIds: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="experiences" className="max-w-3xl grid gap-5">
          <div>
            <Label htmlFor="tourId">Tour ID</Label>
            <Input
              id="tourId"
              value={project.tourId ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                patchLocal({ tourId: e.target.value || undefined })
              }
            />
          </div>
          <div>
            <Label htmlFor="liveSiteId">Live site ID</Label>
            <Input
              id="liveSiteId"
              value={project.liveSiteId ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                patchLocal({ liveSiteId: e.target.value || undefined })
              }
            />
          </div>
          <div>
            <Label htmlFor="roomIds">Room IDs (comma-separated)</Label>
            <Input
              id="roomIds"
              value={project.roomIds.join(", ")}
              disabled={!canWrite}
              onChange={(e) =>
                patchLocal({
                  roomIds: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="progress" className="max-w-3xl">
          <div>
            <Label htmlFor="progressId">Progress record ID</Label>
            <Input
              id="progressId"
              value={project.progressId ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                patchLocal({ progressId: e.target.value || undefined })
              }
            />
          </div>
          <p className="mt-4 text-small text-text-muted">
            Manage stage details under Construction Progress.
          </p>
        </TabsContent>

        <TabsContent value="seo" className="max-w-3xl grid gap-5">
          <div>
            <Label htmlFor="seoTitle">SEO title</Label>
            <Input
              id="seoTitle"
              value={project.seoTitle ?? project.seo?.title ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                patchLocal({
                  seoTitle: e.target.value,
                  seo: { ...project.seo, title: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="seoDescription">SEO description</Label>
            <Textarea
              id="seoDescription"
              value={project.seoDescription ?? project.seo?.description ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                patchLocal({
                  seoDescription: e.target.value,
                  seo: { ...project.seo, description: e.target.value },
                })
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
