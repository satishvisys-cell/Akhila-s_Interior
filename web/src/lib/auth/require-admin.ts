import { redirect } from "next/navigation";
import type { AdminUserSession, Permission } from "@/domain/types";
import { can } from "@/domain/permissions";
import { getSession } from "@/lib/auth/session";
import { initializeCmsStore } from "@/lib/cms/store";

/**
 * Server-side guard for admin pages.
 * Redirects to /admin/login when unauthenticated.
 * Redirects to /admin when authenticated but missing the optional permission.
 */
export async function requireAdmin(
  permission?: Permission,
): Promise<AdminUserSession> {
  await initializeCmsStore();

  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  if (permission && !can(session.role, permission)) {
    redirect("/admin?error=forbidden");
  }

  return session;
}
