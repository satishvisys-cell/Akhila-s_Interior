import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  ALL_PERMISSIONS,
  ROLE_PERMISSIONS,
} from "@/domain/permissions";
import type { RoleKey } from "@/domain/types";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = { title: "Roles", robots: { index: false } };

const ROLES = Object.keys(ROLE_PERMISSIONS) as RoleKey[];

export default async function AdminRolesPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[{ href: "/admin", label: "Dashboard" }, { label: "Roles" }]}
      />
      <div>
        <h1 className="font-display text-h2 text-text">Roles</h1>
        <p className="mt-2 text-text-muted">
          Read-only permission matrix from ROLE_PERMISSIONS.
        </p>
      </div>

      <div className="overflow-x-auto border border-border bg-elevated rounded-[var(--radius-md)]">
        <table className="min-w-full text-left text-small">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 label-caps text-text-muted">Permission</th>
              {ROLES.map((role) => (
                <th
                  key={role}
                  className="px-3 py-3 label-caps text-text-muted whitespace-nowrap"
                >
                  {role.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_PERMISSIONS.map((permission) => (
              <tr key={permission} className="border-b border-border/70">
                <td className="px-4 py-2.5 font-medium text-text">{permission}</td>
                {ROLES.map((role) => {
                  const granted = ROLE_PERMISSIONS[role].includes(permission);
                  return (
                    <td key={role} className="px-3 py-2.5 text-center">
                      <span
                        className={
                          granted ? "text-accent" : "text-text-muted/40"
                        }
                        aria-label={granted ? "Granted" : "Denied"}
                      >
                        {granted ? "●" : "○"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
