"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const transparentOverHero = pathname === "/";

  return (
    <>
      <SiteHeader transparentOverHero={transparentOverHero} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
