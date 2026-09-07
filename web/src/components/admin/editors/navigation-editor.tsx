"use client";

import { useState } from "react";
import type { NavItem, SiteSettings } from "@/domain/types";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";

export function NavigationEditor({
  settings,
  canWrite,
}: {
  settings: SiteSettings;
  canWrite: boolean;
}) {
  const { toast } = useToast();
  const [primaryNav, setPrimaryNav] = useState<NavItem[]>(settings.primaryNav);
  const [saving, setSaving] = useState(false);

  function updateItem(index: number, patch: Partial<NavItem>) {
    setPrimaryNav((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  async function save() {
    if (!canWrite) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryNav }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast({
          title: "Save failed",
          description: data.error ?? "Unable to save navigation",
          tone: "error",
        });
        return;
      }
      toast({ title: "Navigation saved", tone: "success" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 text-text">Navigation</h1>
          <p className="mt-2 text-text-muted">
            Edit primary site navigation from settings.nav.
          </p>
        </div>
        {canWrite ? (
          <Button onClick={save} loading={saving} variant="charcoal">
            Save
          </Button>
        ) : null}
      </div>

      <ul className="divide-y divide-border border border-border bg-elevated rounded-[var(--radius-md)]">
        {primaryNav.map((item, index) => (
          <li key={item.id} className="grid gap-4 px-4 py-4 md:grid-cols-3">
            <div>
              <Label htmlFor={`nav-label-${item.id}`}>Label</Label>
              <Input
                id={`nav-label-${item.id}`}
                value={item.label}
                disabled={!canWrite}
                onChange={(e) => updateItem(index, { label: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`nav-href-${item.id}`}>Href</Label>
              <Input
                id={`nav-href-${item.id}`}
                value={item.href}
                disabled={!canWrite}
                onChange={(e) => updateItem(index, { href: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-3 pb-2">
              <label className="flex items-center gap-2 text-small text-text">
                <input
                  type="checkbox"
                  checked={item.visible}
                  disabled={!canWrite}
                  onChange={(e) =>
                    updateItem(index, { visible: e.target.checked })
                  }
                  className="size-4 accent-[var(--accent)]"
                />
                Visible
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
