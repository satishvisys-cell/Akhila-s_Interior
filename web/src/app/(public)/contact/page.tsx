import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/contact-form";
import { ToastProvider } from "@/components/ui/toast";
import { FadeUp } from "@/components/motion/fade-up";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { EditorialCard } from "@/components/sections/editorial-card";
import { InnerPageShell, PageIntro } from "@/components/layout/inner-page-shell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Akhila — share your vision and timeline.",
};

export default function ContactPage() {
  return (
    <ToastProvider>
      <InnerPageShell>
        <PageIntro
          eyebrow="Contact"
          title="Start a Conversation"
          description="Discuss your vision with our interior design team. We are currently accepting select commissions."
        />
        <div className="grid gap-4 lg:grid-cols-12">
          <EditorialCard className="lg:col-span-8">
            <FadeUp>
              <ContactForm />
            </FadeUp>
          </EditorialCard>
          <EditorialCard className="lg:col-span-4">
            <FadeUp delay={80} className="flex h-full flex-col gap-10">
              <div>
                <h2 className="mb-4 text-xl font-extrabold text-ink-button">
                  Direct Lines
                </h2>
                <div className="space-y-3 text-sm text-text-secondary">
                  <a className="block hover:text-ink-button" href="tel:+15550198273">
                    +1 (555) 019-8273
                  </a>
                  <a
                    className="block hover:text-ink-button"
                    href="mailto:studio@akhila.design"
                  >
                    studio@akhila.design
                  </a>
                  <a
                    className="block hover:text-ink-button"
                    href="https://wa.me/15550198273"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    WhatsApp Connect
                  </a>
                </div>
              </div>
              <div>
                <h2 className="mb-4 text-xl font-extrabold text-ink-button">
                  Studio
                </h2>
                <address className="text-sm not-italic leading-relaxed text-text-secondary">
                  The Interior Arts Bldg.
                  <br />
                  Floor 14, Suite 1400
                  <br />
                  New York, NY 10001
                </address>
              </div>
              <div className="mt-auto overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={STITCH_V2.contact.materials}
                  alt="Interior material samples"
                  className="h-48 w-full object-cover"
                />
              </div>
            </FadeUp>
          </EditorialCard>
        </div>
      </InnerPageShell>
    </ToastProvider>
  );
}
