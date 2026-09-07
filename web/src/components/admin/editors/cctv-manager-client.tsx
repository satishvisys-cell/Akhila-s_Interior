"use client";

import { useMemo, useState } from "react";
import type { Camera, CameraStatus, RoleKey } from "@/domain/types";
import { can } from "@/domain/permissions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { LiveStatusBadge } from "@/components/admin/status-badge";

type ProjectOption = { id: string; name: string };

type Props = {
  initialCameras: Camera[];
  projects: ProjectOption[];
  role: RoleKey;
};

const emptyForm = {
  name: "",
  locationLabel: "",
  projectId: "",
  visibility: "private" as "public" | "private",
  status: "offline" as CameraStatus,
  sortOrder: 0,
  notes: "",
  rtspUrl: "",
};

export function CctvManagerClient({ initialCameras, projects, role }: Props) {
  const { toast } = useToast();
  const canManage = can(role, "camera:manage");
  const [cameras, setCameras] = useState(initialCameras);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Camera | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return cameras.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.locationLabel.toLowerCase().includes(q);
      const matchesS = statusFilter === "all" || c.status === statusFilter;
      return matchesQ && matchesS;
    });
  }, [cameras, query, statusFilter]);

  function openCreate() {
    setEditing(null);
    setForm({
      ...emptyForm,
      projectId: projects[0]?.id ?? "",
    });
    setOpen(true);
  }

  function openEdit(camera: Camera) {
    setEditing(camera);
    setForm({
      name: camera.name,
      locationLabel: camera.locationLabel,
      projectId: camera.projectId ?? "",
      visibility: camera.visibility,
      status: camera.status,
      sortOrder: camera.sortOrder ?? 0,
      notes: "",
      rtspUrl: "",
    });
    setOpen(true);
  }

  async function save() {
    if (!canManage) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        locationLabel: form.locationLabel.trim(),
        projectId: form.projectId || null,
        visibility: form.visibility,
        status: form.status,
        sortOrder: Number(form.sortOrder) || 0,
      };

      let cameraId = editing?.id;
      let nextCamera: Camera | null = null;

      if (editing) {
        const res = await fetch(`/api/admin/cameras/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Update failed");
        nextCamera = data.camera as Camera;
        setCameras((prev) =>
          prev.map((c) => (c.id === nextCamera!.id ? nextCamera! : c)),
        );
        cameraId = nextCamera.id;
      } else {
        const res = await fetch("/api/admin/cameras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Create failed");
        nextCamera = data.camera as Camera;
        setCameras((prev) => [nextCamera!, ...prev]);
        cameraId = nextCamera.id;
      }

      if (form.rtspUrl.trim() && cameraId) {
        const secretRes = await fetch(`/api/admin/cameras/${cameraId}/secret`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rtspUrl: form.rtspUrl.trim(),
            notes: form.notes.trim() || undefined,
          }),
        });
        if (!secretRes.ok) {
          throw new Error("Camera saved but secret configuration failed");
        }
      }

      toast({
        title: editing ? "Camera updated" : "Camera created",
        description: "Credentials are stored server-side only.",
        tone: "success",
      });
      setOpen(false);
    } catch (e) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "Unknown error",
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId || !canManage) return;
    const res = await fetch(`/api/admin/cameras/${deleteId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast({ title: "Delete failed", tone: "error" });
      return;
    }
    setCameras((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    toast({ title: "Camera removed", tone: "success" });
  }

  async function previewStream(cameraId: string) {
    try {
      const res = await fetch("/api/streams/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cameraId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Preview failed");
      toast({
        title: "Session minted",
        description: `Expires ${new Date(data.expiresAt).toLocaleTimeString()} — URL is short-lived.`,
        tone: "success",
      });
      window.open(data.playbackUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast({
        title: "Preview unavailable",
        description: e instanceof Error ? e.message : "Stream error",
        tone: "error",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl text-graphite">CCTV</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage cameras without exposing RTSP credentials in the browser.
          </p>
        </div>
        {canManage ? (
          <Button type="button" onClick={openCreate}>
            Add camera
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cameras"
          aria-label="Search cameras"
          className="md:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="md:max-w-[12rem]"
        >
          <option value="all">All statuses</option>
          <option value="live">Live</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Maintenance</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-elevated">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface label-caps text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Camera</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Visibility</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-text-muted"
                >
                  No cameras match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((camera) => (
                <tr
                  key={camera.id}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-graphite">{camera.name}</div>
                    <div className="text-xs text-text-muted">
                      {camera.locationLabel}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {projects.find((p) => p.id === camera.projectId)?.name ??
                      "—"}
                  </td>
                  <td className="px-4 py-3">
                    <LiveStatusBadge status={camera.status} />
                  </td>
                  <td className="px-4 py-3 capitalize text-text-muted">
                    {camera.visibility}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => previewStream(camera.id)}
                      >
                        Preview
                      </Button>
                      {canManage ? (
                        <>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => openEdit(camera)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(camera.id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} width="md">
        <DrawerHeader>
          <div>
            <DrawerTitle>{editing ? "Edit camera" : "Add camera"}</DrawerTitle>
            <p className="mt-1 text-sm text-text-muted">
              Stream source URIs are written to a server-only secret store.
            </p>
          </div>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody className="space-y-4">
          <div>
            <Label htmlFor="cam-name">Display name</Label>
            <Input
              id="cam-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="cam-loc">Location label</Label>
            <Input
              id="cam-loc"
              value={form.locationLabel}
              onChange={(e) =>
                setForm((f) => ({ ...f, locationLabel: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="cam-project">Project</Label>
            <Select
              id="cam-project"
              value={form.projectId}
              onChange={(e) =>
                setForm((f) => ({ ...f, projectId: e.target.value }))
              }
            >
              <option value="">Unassigned</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cam-status">Status</Label>
              <Select
                id="cam-status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as CameraStatus,
                  }))
                }
              >
                <option value="live">Live</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="cam-vis">Visibility</Label>
              <Select
                id="cam-vis"
                value={form.visibility}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    visibility: e.target.value as "public" | "private",
                  }))
                }
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="cam-secret">
              Secure stream source {editing ? "(leave blank to keep)" : ""}
            </Label>
            <Input
              id="cam-secret"
              type="password"
              autoComplete="off"
              placeholder="rtsp://… stored server-side only"
              value={form.rtspUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, rtspUrl: e.target.value }))
              }
            />
            <p className="mt-1 text-xs text-text-muted">
              Never returned by APIs. Required for live preview.
            </p>
          </div>
          <div>
            <Label htmlFor="cam-notes">Internal notes (secret store)</Label>
            <Textarea
              id="cam-notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" loading={saving} onClick={save}>
            Save camera
          </Button>
        </DrawerFooter>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete camera?"
        description="This removes the camera record and its server-side secret. Playback sessions will stop."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
