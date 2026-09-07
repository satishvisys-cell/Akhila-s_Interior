import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { ToastProvider } from "@/components/ui/toast";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <ToastProvider>
      <AdminShell userMenu={<AdminUserMenu user={user} />}>
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
