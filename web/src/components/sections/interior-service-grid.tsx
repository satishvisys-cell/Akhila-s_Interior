import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { INTERIOR_SERVICES } from "@/lib/services";

type InteriorServiceGridProps = {
  cta?: "anchor" | "contact";
  withAnchors?: boolean;
};

export function InteriorServiceGrid({
  cta = "anchor",
  withAnchors = false,
}: InteriorServiceGridProps) {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {INTERIOR_SERVICES.map((service, i) => {
        const href =
          cta === "contact" ? "/contact" : `/services#${service.id}`;
        const label =
          cta === "contact" ? "Discuss this service" : "View service";

        return (
          <FadeUp key={service.id} delay={(i % 3) * 70}>
            <article
              id={withAnchors ? service.id : undefined}
              className="group flex h-full flex-col"
            >
              <NextLink href={href} className="block" aria-label={service.title}>
                <div className="overflow-hidden rounded-2xl bg-[#f6f6f4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="aspect-[16/11] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transform-none"
                  />
                </div>
              </NextLink>
              <p className="mt-4 text-sm text-terracotta">{service.count}</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-button">
                {service.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                {service.body}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-muted">
                {service.doList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <NextLink
                href={href}
                className="mt-5 inline-flex w-fit text-sm font-semibold text-ink-button transition-opacity hover:opacity-70"
              >
                {label} →
              </NextLink>
            </article>
          </FadeUp>
        );
      })}
    </div>
  );
}
