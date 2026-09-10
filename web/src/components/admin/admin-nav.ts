export type AdminNavItem = {
  label: string;
  href: string;
  group?: "content" | "media" | "live" | "site" | "system";
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", group: "system" },
  { label: "Projects", href: "/admin/projects", group: "content" },
  { label: "About", href: "/admin/about", group: "content" },
  { label: "Pages", href: "/admin/pages", group: "content" },
  { label: "Hero Sections", href: "/admin/hero-sections", group: "content" },

  { label: "Diagrams", href: "/admin/diagrams", group: "content" },
  { label: "Designs", href: "/admin/designs", group: "media" },
  { label: "Videos", href: "/admin/videos", group: "media" },
  { label: "Posts", href: "/admin/posts", group: "content" },
  { label: "Live Sites", href: "/admin/live-sites", group: "live" },
  { label: "CCTV", href: "/admin/cctv", group: "live" },
  {
    label: "Construction Progress",
    href: "/admin/construction-progress",
    group: "live",
  },
  { label: "Testimonials", href: "/admin/testimonials", group: "content" },
  { label: "Team", href: "/admin/team", group: "content" },
  { label: "Navigation", href: "/admin/navigation", group: "site" },
  { label: "Media Library", href: "/admin/media-library", group: "media" },
  { label: "Users", href: "/admin/users", group: "system" },
  { label: "Roles", href: "/admin/roles", group: "system" },
  { label: "SEO", href: "/admin/seo", group: "site" },
  { label: "Analytics", href: "/admin/analytics", group: "system" },
  { label: "Settings", href: "/admin/settings", group: "system" },
];

export const ADMIN_NAV_GROUPS: Record<
  NonNullable<AdminNavItem["group"]>,
  string
> = {
  content: "Content",
  media: "Media",
  live: "Live & Progress",
  site: "Site",
  system: "System",
};
