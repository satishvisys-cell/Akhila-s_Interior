import NextLink from "next/link";

const QUICK = [
  ["Home", "/"],
  ["Projects", "/projects"],
  ["Services", "/services"],
  ["Gallery", "/gallery"],
  ["Journal", "/journal"],
  ["Contact", "/contact"],
] as const;

const SUPPORT = [
  ["Process", "/process"],
  ["Live Sites", "/live-sites"],
  ["About", "/about"],
  ["Start a Project", "/contact"],
] as const;

const COMPANY = [
  ["Studio", "/about"],
  ["Selected Works", "/projects"],
  ["Design System", "/design-system"],
] as const;

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: readonly (readonly [string, string])[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-widest text-white/45">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map(([label, href]) => (
          <li key={label}>
            <NextLink
              href={href}
              className="focus-ring-light group inline-flex min-h-10 items-center text-sm text-white/75 transition-colors hover:text-white"
            >
              <span className="relative">
                {label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </span>
            </NextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink-button font-editorial text-white">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-14 sm:px-6 md:grid-cols-2 md:px-10 md:py-16 lg:px-12">
        <div>
          <NextLink
            href="/"
            className="focus-ring-light text-2xl font-extrabold tracking-tight transition-opacity hover:opacity-80"
          >
            AKHILA
          </NextLink>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Supporting modern living through thoughtfully designed interiors,
            décor, and timeless fit-out for every home.
          </p>
          <NextLink
            href="/projects"
            className="btn-press focus-ring-light group mt-6 inline-flex min-h-11 items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-ink-button"
          >
            Explore Collection
            <span aria-hidden className="arrow-nudge ml-2">
              →
            </span>
          </NextLink>
          <div className="mt-10 grid grid-cols-1 gap-8 text-sm text-white/75 sm:grid-cols-3 sm:gap-6">
            <FooterCol title="Quick Links" items={QUICK} />
            <FooterCol title="Support" items={SUPPORT} />
            <FooterCol title="Company" items={COMPANY} />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Designing Homes For Inspired Living.
            </h2>
            <p className="mt-6 text-sm text-white/70">
              <a
                href="tel:+13105550148"
                className="focus-ring-light transition-colors hover:text-white"
              >
                +1 (310) 555-0148
              </a>
            </p>
            <p className="text-sm text-white/70">
              <a
                href="mailto:studio@akhila.design"
                className="focus-ring-light transition-colors hover:text-white"
              >
                studio@akhila.design
              </a>
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 text-sm text-white/65 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/45">
                  California
                </p>
                <p className="mt-1">Malibu · Los Angeles</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/45">
                  New York
                </p>
                <p className="mt-1">By appointment</p>
              </div>
            </div>
          </div>
          <p className="mt-12 text-xs text-white/40">
            © {new Date().getFullYear()} Akhila. Precision in Interiors.
          </p>
        </div>
      </div>
    </footer>
  );
}
