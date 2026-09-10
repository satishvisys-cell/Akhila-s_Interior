"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingContact } from "@/components/layout/floating-contact";
import { DribbbleScrollBoot } from "@/components/motion/scroll-reveal";
import {
  BackToTop,
  PageEnter,
  ScrollProgress,
} from "@/components/motion/friendly-chrome";

export type FloatingSocialProps = {
  enabled?: boolean;
  whatsappE164?: string;
  whatsappMessage?: string;
  instagramUrl?: string;
};

export function PublicShell({
  children,
  floatingSocial,
}: {
  children: React.ReactNode;
  floatingSocial?: FloatingSocialProps;
}) {
  return (
    <>
      <DribbbleScrollBoot />
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1">
        <PageEnter>{children}</PageEnter>
      </main>
      <SiteFooter />
      <FloatingContact
        enabled={floatingSocial?.enabled ?? true}
        whatsappE164={floatingSocial?.whatsappE164}
        whatsappMessage={floatingSocial?.whatsappMessage}
        instagramUrl={floatingSocial?.instagramUrl}
      />
      <BackToTop />
    </>
  );
}
