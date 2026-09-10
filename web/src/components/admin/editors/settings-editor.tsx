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
  const social = settings.socialContact;
  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline ?? "");
  const [contactEmail, setContactEmail] = useState(settings.contactEmail ?? "");
  const [seoTitle, setSeoTitle] = useState(settings.defaultSeo.title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    settings.defaultSeo.description ?? "",
  );
  const [whatsappE164, setWhatsappE164] = useState(
    social?.whatsappE164 ?? "13105550148",
  );
  const [whatsappMessage, setWhatsappMessage] = useState(
    social?.whatsappMessage ??
      "Hello Akhila — I’d like to discuss a project.",
  );
  const [instagramUrl, setInstagramUrl] = useState(
    social?.instagramUrl ??
      settings.socialLinks?.instagram ??
      "https://instagram.com/akhilainteriors",
  );
  const [floatingEnabled, setFloatingEnabled] = useState(
    social?.floatingEnabled ?? true,
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
          socialContact: {
            whatsappE164,
            whatsappMessage,
            instagramUrl,
            floatingEnabled,
          },
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
            Site identity, floating contact, and default SEO.
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

        <div className="border-t border-border pt-6">
          <h2 className="mb-4 text-lg font-semibold text-text">
            Floating contact
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="whatsapp">WhatsApp number (E.164 digits)</Label>
              <Input
                id="whatsapp"
                value={whatsappE164}
                disabled={!canWrite}
                onChange={(e) => setWhatsappE164(e.target.value)}
                placeholder="13105550148"
              />
            </div>
            <div>
              <Label htmlFor="wa-msg">WhatsApp prefills</Label>
              <Input
                id="wa-msg"
                value={whatsappMessage}
                disabled={!canWrite}
                onChange={(e) => setWhatsappMessage(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ig">Instagram URL</Label>
              <Input
                id="ig"
                value={instagramUrl}
                disabled={!canWrite}
                onChange={(e) => setInstagramUrl(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={floatingEnabled}
                disabled={!canWrite}
                onChange={(e) => setFloatingEnabled(e.target.checked)}
              />
              Show floating WhatsApp & Instagram icons
            </label>
          </div>
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
