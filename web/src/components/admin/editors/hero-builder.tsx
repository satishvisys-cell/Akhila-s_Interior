"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { HeroConfig, MediaAsset, RoleKey } from "@/domain/types";
import { can } from "@/domain/permissions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

type Device = "desktop" | "tablet" | "mobile";

const deviceWidths: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export function HeroBuilder({
  hero: initial,
  media,
  role,
}: {
  hero: HeroConfig;
  media: MediaAsset[];
  role: RoleKey;
}) {
  const { toast } = useToast();
  const [hero, setHero] = useState(initial);
  const [device, setDevice] = useState<Device>("desktop");
  const [saving, setSaving] = useState(false);

  const canWrite = can(role, "page:write");
  const canPublish = can(role, "page:publish");

  const mediaById = useMemo(
    () => new Map(media.map((m) => [m.id, m])),
    [media],
  );

  const previewMedia =
    device === "mobile" && hero.mobileMediaId
      ? mediaById.get(hero.mobileMediaId)
      : mediaById.get(hero.mediaId);

  const previewUrl =
    previewMedia?.publicUrl ??
    (previewMedia ? `/media/${previewMedia.storageKey}` : null);

  function validateForPublish(): string[] {
    const errors: string[] = [];
    if (!hero.mediaId || !mediaById.has(hero.mediaId)) {
      errors.push("Primary media is required");
    }
    if (!hero.heading.trim()) errors.push("Heading is required");
    if (hero.primaryCta) {
      if (!hero.primaryCta.label.trim() || !hero.primaryCta.href.trim()) {
        errors.push("Primary CTA needs label and href");
      }
    }
    if (hero.secondaryCta) {
      if (!hero.secondaryCta.label.trim() || !hero.secondaryCta.href.trim()) {
        errors.push("Secondary CTA needs label and href");
      }
    }
    return errors;
  }

  async function save(extra?: Partial<HeroConfig>) {
    if (!canWrite) return false;
    setSaving(true);
    try {
      const body = {
        mediaId: hero.mediaId,
        mobileMediaId: hero.mobileMediaId ?? null,
        eyebrow: hero.eyebrow ?? null,
        heading: hero.heading,
        subtitle: hero.subtitle ?? null,
        description: hero.description ?? null,
        primaryCta: hero.primaryCta ?? null,
        secondaryCta: hero.secondaryCta ?? null,
        overlayStrength: hero.overlayStrength,
        alignment: hero.alignment,
        animation: hero.animation,
        visibility: hero.visibility,
        sortOrder: hero.sortOrder,
        ...extra,
      };

      const res = await fetch(`/api/admin/heroes/${hero.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { hero?: HeroConfig; error?: string };
      if (!res.ok || !data.hero) {
        toast({
          title: "Save failed",
          description: data.error ?? "Unable to save hero",
          tone: "error",
        });
        return false;
      }
      setHero(data.hero);
      toast({ title: "Hero saved", tone: "success" });
      return true;
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
    const errors = validateForPublish();
    if (errors.length) {
      toast({
        title: "Cannot publish",
        description: errors.join(". "),
        tone: "error",
      });
      return;
    }
    await save({ visibility: "public" });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="label-caps text-text-muted">Hero builder</p>
          <h1 className="mt-1 font-display text-h2 text-text">{hero.heading}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/preview/hero/${hero.id}`}
            className="inline-flex h-11 items-center border border-text/80 px-5 text-xs uppercase tracking-[0.1em] hover:bg-text hover:text-text-inverse rounded-[var(--radius-md)]"
            target="_blank"
          >
            Preview
          </Link>
          <Button
            variant="secondary"
            loading={saving}
            disabled={!canWrite}
            onClick={() => void save()}
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

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Live preview */}
        <section className="border border-border bg-surface p-4 rounded-[var(--radius-md)]">
          <div className="mb-4 flex flex-wrap gap-2">
            {(["desktop", "tablet", "mobile"] as Device[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={cn(
                  "px-3 py-2 label-caps rounded-[var(--radius-sm)]",
                  device === d
                    ? "bg-graphite text-text-inverse"
                    : "text-text-muted hover:text-text",
                )}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex justify-center overflow-hidden bg-graphite/5 py-6">
            <div
              className="relative aspect-[16/10] overflow-hidden bg-graphite transition-[max-width] duration-300"
              style={{ width: "100%", maxWidth: deviceWidths[device] }}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={previewMedia?.alt ?? "Hero preview"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-small text-text-inverse/60">
                  Select media to preview
                </div>
              )}
              <div
                className="absolute inset-0 bg-graphite"
                style={{ opacity: hero.overlayStrength }}
                aria-hidden
              />
              <div
                className={cn(
                  "absolute inset-0 flex flex-col justify-end p-6 text-text-inverse md:p-10",
                  hero.alignment === "center" && "items-center text-center",
                  hero.alignment === "right" && "items-end text-right",
                  hero.alignment === "left" && "items-start text-left",
                )}
              >
                {hero.eyebrow ? (
                  <p className="label-caps text-text-inverse/70">{hero.eyebrow}</p>
                ) : null}
                <h2 className="mt-2 font-display text-2xl md:text-4xl">
                  {hero.heading}
                </h2>
                {hero.subtitle ? (
                  <p className="mt-2 text-small text-text-inverse/80">
                    {hero.subtitle}
                  </p>
                ) : null}
                {hero.description ? (
                  <p className="mt-3 max-w-md text-small text-text-inverse/70">
                    {hero.description}
                  </p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-3">
                  {hero.primaryCta ? (
                    <span className="inline-flex h-10 items-center bg-accent px-4 text-xs uppercase tracking-[0.1em] text-text-inverse">
                      {hero.primaryCta.label}
                    </span>
                  ) : null}
                  {hero.secondaryCta ? (
                    <span className="inline-flex h-10 items-center border border-text-inverse/60 px-4 text-xs uppercase tracking-[0.1em]">
                      {hero.secondaryCta.label}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fields */}
        <aside className="flex flex-col gap-4 border border-border bg-elevated p-4 rounded-[var(--radius-md)]">
          <div>
            <Label htmlFor="heading">Heading</Label>
            <Input
              id="heading"
              value={hero.heading}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({ ...prev, heading: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="eyebrow">Eyebrow</Label>
            <Input
              id="eyebrow"
              value={hero.eyebrow ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({ ...prev, eyebrow: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={hero.subtitle ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({ ...prev, subtitle: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={hero.description ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="mediaId">Media ID</Label>
            <Select
              id="mediaId"
              value={hero.mediaId}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({ ...prev, mediaId: e.target.value }))
              }
            >
              {media.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.alt}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="mobileMediaId">Mobile media ID</Label>
            <Select
              id="mobileMediaId"
              value={hero.mobileMediaId ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({
                  ...prev,
                  mobileMediaId: e.target.value || undefined,
                }))
              }
            >
              <option value="">Same as desktop</option>
              {media.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.alt}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="alignment">Alignment</Label>
            <Select
              id="alignment"
              value={hero.alignment}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({
                  ...prev,
                  alignment: e.target.value as HeroConfig["alignment"],
                }))
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="animation">Animation</Label>
            <Select
              id="animation"
              value={hero.animation}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({
                  ...prev,
                  animation: e.target.value as HeroConfig["animation"],
                }))
              }
            >
              <option value="none">None</option>
              <option value="fade_up">Fade up</option>
              <option value="fade_in">Fade in</option>
              <option value="scale_in">Scale in</option>
              <option value="parallax">Parallax</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="overlay">
              Overlay strength ({hero.overlayStrength.toFixed(2)})
            </Label>
            <input
              id="overlay"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={hero.overlayStrength}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({
                  ...prev,
                  overlayStrength: Number(e.target.value),
                }))
              }
              className="w-full accent-[var(--accent)]"
            />
          </div>
          <div>
            <Label htmlFor="primaryLabel">Primary CTA label</Label>
            <Input
              id="primaryLabel"
              value={hero.primaryCta?.label ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({
                  ...prev,
                  primaryCta: {
                    label: e.target.value,
                    href: prev.primaryCta?.href ?? "/",
                    variant: prev.primaryCta?.variant ?? "primary",
                  },
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="primaryHref">Primary CTA href</Label>
            <Input
              id="primaryHref"
              value={hero.primaryCta?.href ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                setHero((prev) => ({
                  ...prev,
                  primaryCta: {
                    label: prev.primaryCta?.label ?? "Learn more",
                    href: e.target.value,
                    variant: prev.primaryCta?.variant ?? "primary",
                  },
                }))
              }
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
