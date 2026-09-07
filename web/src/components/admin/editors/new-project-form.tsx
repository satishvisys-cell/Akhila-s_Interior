"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";

export function NewProjectForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      slug: String(form.get("slug") ?? ""),
      location: String(form.get("location") ?? ""),
      category: String(form.get("category") ?? "residential"),
      year: Number(form.get("year") ?? new Date().getFullYear()),
      areaSqm: Number(form.get("areaSqm") ?? 1),
      description: String(form.get("description") ?? ""),
      status: "planned" as const,
      publishStatus: "draft" as const,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        project?: { id: string };
        error?: string;
      };
      if (!res.ok || !data.project) {
        setError(data.error ?? "Unable to create project");
        return;
      }
      router.push(`/admin/projects/${data.project.id}`);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          required
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          placeholder="meridian-residence"
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select id="category" name="category" defaultValue="residential">
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="interior">Interior</option>
          <option value="renovation">Renovation</option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            defaultValue={new Date().getFullYear()}
            required
          />
        </div>
        <div>
          <Label htmlFor="areaSqm">Area (sqm)</Label>
          <Input id="areaSqm" name="areaSqm" type="number" defaultValue={100} required />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" />
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
      <Button type="submit" variant="charcoal" loading={loading}>
        Create project
      </Button>
    </form>
  );
}
