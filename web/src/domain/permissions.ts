import type { Permission, RoleKey } from "@/domain/types";

export const ALL_PERMISSIONS: readonly Permission[] = [
  "project:read",
  "project:write",
  "project:publish",
  "page:write",
  "page:publish",
  "media:write",
  "camera:view",
  "camera:manage",
  "user:manage",
  "role:manage",
  "settings:write",
  "seo:write",
  "analytics:read",
  "audit:read",
] as const;

export const ROLE_PERMISSIONS: Record<RoleKey, readonly Permission[]> = {
  super_admin: ALL_PERMISSIONS,

  admin: [
    "project:read",
    "project:write",
    "project:publish",
    "page:write",
    "page:publish",
    "media:write",
    "camera:view",
    "camera:manage",
    "user:manage",
    "settings:write",
    "seo:write",
    "analytics:read",
    "audit:read",
  ],

  editor: [
    "project:read",
    "project:write",
    "page:write",
    "media:write",
    "camera:view",
    "seo:write",
  ],

  project_manager: [
    "project:read",
    "project:write",
    "project:publish",
    "page:write",
    "media:write",
    "camera:view",
    "camera:manage",
    "analytics:read",
  ],

  viewer: ["project:read", "camera:view", "analytics:read"],
};

export function permissionsForRole(role: RoleKey): readonly Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function can(role: RoleKey, permission: Permission): boolean {
  return permissionsForRole(role).includes(permission);
}

export function canAny(role: RoleKey, permissions: Permission[]): boolean {
  const granted = permissionsForRole(role);
  return permissions.some((p) => granted.includes(p));
}

export function canAll(role: RoleKey, permissions: Permission[]): boolean {
  const granted = permissionsForRole(role);
  return permissions.every((p) => granted.includes(p));
}
