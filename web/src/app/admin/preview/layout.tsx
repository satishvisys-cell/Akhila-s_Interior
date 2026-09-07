import type { ReactNode } from "react";

/**
 * Preview routes sit outside (dashboard) so they render full-bleed
 * without AdminShell chrome, but still require session via requireAdmin
 * in each page.
 */
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
