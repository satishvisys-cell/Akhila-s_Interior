"use client";

import { useRouter } from "next/navigation";
import type { AdminUserSession } from "@/domain/types";
import { Button } from "@/components/ui/button";

export function AdminUserMenu({ user }: { user: AdminUserSession }) {
  const router = useRouter();
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-small text-text">{user.name}</p>
        <p className="label-caps text-text-muted">{user.role.replace("_", " ")}</p>
      </div>
      <span
        className="flex size-8 items-center justify-center border border-border bg-surface text-caption rounded-[var(--radius-sm)]"
        aria-hidden
      >
        {initials}
      </span>
      <Button variant="ghost" size="sm" onClick={logout} type="button">
        Sign out
      </Button>
    </div>
  );
}
