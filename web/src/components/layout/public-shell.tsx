"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DribbbleScrollBoot } from "@/components/motion/scroll-reveal";
import {
  BackToTop,
  PageEnter,
  ScrollProgress,
} from "@/components/motion/friendly-chrome";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DribbbleScrollBoot />
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1">
        <PageEnter>{children}</PageEnter>
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
