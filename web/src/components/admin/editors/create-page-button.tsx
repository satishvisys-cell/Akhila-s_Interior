"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function CreatePageButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true);
    try {
      const slug = `page-${Date.now().toString(36)}`;
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled page",
          slug,
          publishStatus: "draft",
        }),
      });
      const data = (await res.json()) as {
        page?: { id: string };
        error?: string;
      };
      if (!res.ok || !data.page) {
        toast({
          title: "Create failed",
          description: data.error ?? "Unable to create page",
          tone: "error",
        });
        return;
      }
      router.push(`/admin/pages/${data.page.id}/builder`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="charcoal" loading={loading} onClick={() => void create()}>
      New page
    </Button>
  );
}
