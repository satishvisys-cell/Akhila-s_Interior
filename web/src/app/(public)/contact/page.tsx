import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/contact-form";
import { ToastProvider } from "@/components/ui/toast";
import { FadeUp } from "@/components/motion/fade-up";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Akhila — share your vision and timeline.",
};

export default function ContactPage() {
  return (
    <ToastProvider>
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-col gap-16 px-6 pb-24 pt-32 md:px-12 lg:flex-row lg:gap-24 lg:px-24">
        <FadeUp className="max-w-2xl flex-1">
          <h1 className="mb-4 font-display text-5xl font-normal leading-tight tracking-tight text-charcoal md:text-6xl lg:text-7xl">
            Start a
            <br />
            Conversation
          </h1>
          <p className="mb-12 max-w-md font-sans text-lg leading-relaxed text-text-secondary">
            Discuss your vision with our architectural team. We are currently
            accepting select commissions for 2025.
          </p>
          <ContactForm />
        </FadeUp>

        <FadeUp
          delay={100}
          className="flex w-full flex-shrink-0 flex-col gap-12 pt-4 lg:w-80"
        >
          <div className="space-y-2">
            <h3 className="mb-4 border-b border-border pb-2 font-display text-xl text-charcoal">
              Direct Lines
            </h3>
            <a
              className="group flex items-center gap-4 text-charcoal transition-colors hover:text-accent"
              href="tel:+15550198273"
            >
              <span className="text-text-secondary transition-colors group-hover:text-accent" aria-hidden>
                ☎
              </span>
              <span className="font-sans text-base">+1 (555) 019-8273</span>
            </a>
            <a
              className="group flex items-center gap-4 text-charcoal transition-colors hover:text-accent"
              href="mailto:studio@akhila.design"
            >
              <span className="text-text-secondary transition-colors group-hover:text-accent" aria-hidden>
                ✉
              </span>
              <span className="font-sans text-base">studio@akhila.design</span>
            </a>
            <a
              className="group flex items-center gap-4 text-charcoal transition-colors hover:text-accent"
              href="https://wa.me/15550198273"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="text-text-secondary transition-colors group-hover:text-accent" aria-hidden>
                ✎
              </span>
              <span className="font-sans text-base">WhatsApp Connect</span>
            </a>
          </div>
          <div className="space-y-2">
            <h3 className="mb-4 border-b border-border pb-2 font-display text-xl text-charcoal">
              Studio
            </h3>
            <div className="flex items-start gap-4">
              <span className="mt-1 text-text-secondary" aria-hidden>
                ⌖
              </span>
              <address className="font-sans text-base not-italic leading-relaxed text-charcoal">
                The Architectural Arts Bldg.
                <br />
                Floor 14, Suite 1400
                <br />
                New York, NY 10001
              </address>
            </div>
          </div>
          <div className="relative mt-auto hidden h-64 overflow-hidden rounded shadow-sm lg:block">
            <div
              className="absolute inset-0 h-full w-full bg-cover bg-center opacity-80 grayscale mix-blend-multiply transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 hover:opacity-100 hover:grayscale-0"
              style={{
                backgroundImage: `url('${STITCH_V2.contact.materials}')`,
              }}
              role="img"
              aria-label="Architectural material samples"
            />
          </div>
        </FadeUp>
      </div>
    </ToastProvider>
  );
}
