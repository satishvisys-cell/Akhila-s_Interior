"use client";

import { useState } from "react";
import type { AboutPageContent } from "@/domain/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { AiImproveButton } from "@/components/admin/ai-improve-button";
import { nanoid } from "nanoid";

export function AboutEditor({
  about,
  canWrite,
}: {
  about: AboutPageContent;
  canWrite: boolean;
}) {
  const { toast } = useToast();
  const [draft, setDraft] = useState(about);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!canWrite) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: draft.hero,
          owner: draft.owner,
          commitments: draft.commitments,
          achievements: draft.achievements,
          trophies: draft.trophies,
          values: draft.values,
          cta: draft.cta,
          seo: draft.seo,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast({
          title: "Save failed",
          description: data.error ?? "Unable to save about page",
          tone: "error",
        });
        return;
      }
      const data = (await res.json()) as { about: AboutPageContent };
      setDraft(data.about);
      toast({ title: "About page saved", tone: "success" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 text-text">About</h1>
          <p className="mt-2 text-text-muted">
            Owner story, commitments, achievements, trophies, and values —
            published on /about.
          </p>
        </div>
        {canWrite ? (
          <Button onClick={save} loading={saving} variant="charcoal">
            Save
          </Button>
        ) : null}
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text">Hero</h2>
        <div>
          <Label htmlFor="hero-title">Title</Label>
          <Input
            id="hero-title"
            value={draft.hero.title}
            disabled={!canWrite}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                hero: { ...d.hero, title: e.target.value },
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="hero-intro">Intro</Label>
          <Textarea
            id="hero-intro"
            rows={3}
            value={draft.hero.intro}
            disabled={!canWrite}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                hero: { ...d.hero, intro: e.target.value },
              }))
            }
          />
          <AiImproveButton
            fieldKey="hero.intro"
            value={draft.hero.intro}
            disabled={!canWrite}
            onAccept={(suggestion) =>
              setDraft((d) => ({
                ...d,
                hero: { ...d.hero, intro: suggestion },
              }))
            }
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text">About the owner</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="owner-name">Name</Label>
            <Input
              id="owner-name"
              value={draft.owner.name}
              disabled={!canWrite}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  owner: { ...d.owner, name: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="owner-title">Title</Label>
            <Input
              id="owner-title"
              value={draft.owner.title}
              disabled={!canWrite}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  owner: { ...d.owner, title: e.target.value },
                }))
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="owner-bio">Bio</Label>
          <Textarea
            id="owner-bio"
            rows={6}
            value={draft.owner.bio}
            disabled={!canWrite}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                owner: { ...d.owner, bio: e.target.value },
              }))
            }
          />
          <AiImproveButton
            fieldKey="owner.bio"
            value={draft.owner.bio}
            disabled={!canWrite}
            onAccept={(suggestion) =>
              setDraft((d) => ({
                ...d,
                owner: { ...d.owner, bio: suggestion },
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="owner-quote">Quote</Label>
          <Input
            id="owner-quote"
            value={draft.owner.quote ?? ""}
            disabled={!canWrite}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                owner: { ...d.owner, quote: e.target.value },
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="owner-photo">Photo media ID</Label>
          <Input
            id="owner-photo"
            value={draft.owner.photoMediaId ?? ""}
            disabled={!canWrite}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                owner: { ...d.owner, photoMediaId: e.target.value || undefined },
              }))
            }
          />
        </div>
      </section>

      <ListSection
        title="Commitments"
        canWrite={canWrite}
        items={draft.commitments}
        onChange={(commitments) => setDraft((d) => ({ ...d, commitments }))}
        aiFieldPrefix="commitment"
      />

      <ListSection
        title="Achievements"
        canWrite={canWrite}
        items={draft.achievements}
        onChange={(achievements) => setDraft((d) => ({ ...d, achievements }))}
        showYear
        aiFieldPrefix="achievement"
      />

      <TrophySection
        canWrite={canWrite}
        items={draft.trophies}
        onChange={(trophies) => setDraft((d) => ({ ...d, trophies }))}
      />

      <ListSection
        title="Values"
        canWrite={canWrite}
        items={draft.values}
        onChange={(values) => setDraft((d) => ({ ...d, values }))}
        aiFieldPrefix="value"
      />

      {draft.cta ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-text">CTA</h2>
          <div>
            <Label htmlFor="cta-title">Title</Label>
            <Input
              id="cta-title"
              value={draft.cta.title}
              disabled={!canWrite}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  cta: d.cta
                    ? { ...d.cta, title: e.target.value }
                    : d.cta,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="cta-body">Body</Label>
            <Textarea
              id="cta-body"
              rows={2}
              value={draft.cta.body ?? ""}
              disabled={!canWrite}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  cta: d.cta ? { ...d.cta, body: e.target.value } : d.cta,
                }))
              }
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}

type ListItem = {
  id: string;
  title: string;
  body: string;
  sortOrder: number;
  visible: boolean;
  year?: number;
};

function ListSection({
  title,
  items,
  onChange,
  canWrite,
  showYear,
  aiFieldPrefix,
}: {
  title: string;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  canWrite: boolean;
  showYear?: boolean;
  aiFieldPrefix: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        {canWrite ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              onChange([
                ...items,
                {
                  id: nanoid(),
                  title: "New item",
                  body: "",
                  sortOrder: items.length,
                  visible: true,
                },
              ])
            }
          >
            Add
          </Button>
        ) : null}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-[var(--radius-md)] border border-border p-4"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input
                value={item.title}
                disabled={!canWrite}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = { ...item, title: e.target.value };
                  onChange(next);
                }}
              />
            </div>
            {showYear ? (
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  value={item.year ?? ""}
                  disabled={!canWrite}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = {
                      ...item,
                      year: e.target.value ? Number(e.target.value) : undefined,
                    };
                    onChange(next);
                  }}
                />
              </div>
            ) : null}
          </div>
          <div className="mt-3">
            <Label>Body</Label>
            <Textarea
              rows={3}
              value={item.body}
              disabled={!canWrite}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, body: e.target.value };
                onChange(next);
              }}
            />
            <AiImproveButton
              fieldKey={`${aiFieldPrefix}.${item.id}`}
              value={item.body}
              disabled={!canWrite}
              onAccept={(suggestion) => {
                const next = [...items];
                next[index] = { ...item, body: suggestion };
                onChange(next);
              }}
            />
          </div>
          {canWrite ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="mt-2"
              onClick={() => onChange(items.filter((x) => x.id !== item.id))}
            >
              Remove
            </Button>
          ) : null}
        </div>
      ))}
    </section>
  );
}

function TrophySection({
  items,
  onChange,
  canWrite,
}: {
  items: AboutPageContent["trophies"];
  onChange: (items: AboutPageContent["trophies"]) => void;
  canWrite: boolean;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">Trophies</h2>
        {canWrite ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              onChange([
                ...items,
                {
                  id: nanoid(),
                  name: "New trophy",
                  sortOrder: items.length,
                  visible: true,
                },
              ])
            }
          >
            Add
          </Button>
        ) : null}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-[var(--radius-md)] border border-border p-4"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input
                value={item.name}
                disabled={!canWrite}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = { ...item, name: e.target.value };
                  onChange(next);
                }}
              />
            </div>
            <div>
              <Label>Organization</Label>
              <Input
                value={item.organization ?? ""}
                disabled={!canWrite}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = { ...item, organization: e.target.value };
                  onChange(next);
                }}
              />
            </div>
          </div>
          <div className="mt-3">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={item.body ?? ""}
              disabled={!canWrite}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, body: e.target.value };
                onChange(next);
              }}
            />
            <AiImproveButton
              fieldKey={`trophy.${item.id}`}
              value={item.body ?? ""}
              disabled={!canWrite}
              onAccept={(suggestion) => {
                const next = [...items];
                next[index] = { ...item, body: suggestion };
                onChange(next);
              }}
            />
          </div>
          {canWrite ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="mt-2"
              onClick={() => onChange(items.filter((x) => x.id !== item.id))}
            >
              Remove
            </Button>
          ) : null}
        </div>
      ))}
    </section>
  );
}
