"use client";

import { useState } from "react";
import type { SiteSettings } from "@/domain/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";

export function SettingsEditor({
  settings,
  canWrite,
}: {
  settings: SiteSettings;
  canWrite: boolean;
}) {
  const { toast } = useToast();
  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline ?? "");
  const [contactEmail, setContactEmail] = useState(settings.contactEmail ?? "");
  const [seoTitle, setSeoTitle] = useState(settings.defaultSeo.title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    settings.defaultSeo.description ?? "",
  );
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!canWrite) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          tagline,
          contactEmail,
          defaultSeo: { title: seoTitle, description: seoDescription },
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast({
          title: "Save failed",
          description: data.error ?? "Unable to save settings",
          tone: "error",
        });
        return;
      }
      toast({ title: "Settings saved", tone: "success" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 text-text">Settings</h1>
          <p className="mt-2 text-text-muted">
            Site identity and default SEO configuration.
          </p>
        </div>
        {canWrite ? (
          <Button onClick={save} loading={saving} variant="charcoal">
            Save
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <Label htmlFor="siteName">Site name</Label>
          <Input
            id="siteName"
            value={siteName}
            disabled={!canWrite}
            onChange={(e) => setSiteName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={tagline}
            disabled={!canWrite}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            disabled={!canWrite}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="seoTitle">Default SEO title</Label>
          <Input
            id="seoTitle"
            value={seoTitle}
            disabled={!canWrite}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="seoDescription">Default SEO description</Label>
          <Textarea
            id="seoDescription"
            value={seoDescription}
            disabled={!canWrite}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
