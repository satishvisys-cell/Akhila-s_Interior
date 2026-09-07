import NextLink from "next/link";

const MENU = [
  ["Projects", "/projects"],
  ["Services", "/services"],
  ["Process", "/process"],
] as const;

const EXPLORE = [
  ["Live Sites", "/live-sites"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
] as const;

const LEGAL = [
  ["Contact", "/contact"],
  ["Privacy Policy", "/privacy"],
  ["Terms", "/terms"],
] as const;

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-charcoal py-20 text-text-inverse">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 md:grid-cols-4 md:px-12">
        <div className="flex flex-col justify-between md:col-span-1">
          <div>
            <NextLink
              href="/"
              className="mb-6 block font-display text-4xl uppercase tracking-tighter text-text-inverse"
            >
              AKHILA
            </NextLink>
            <p className="max-w-xs font-sans text-sm font-light leading-relaxed text-text-inverse/70">
              Premium architecture, design, and construction. Building cinematic
              experiences through uncompromising precision.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
          <div>
            <h4 className="mb-6 font-sans text-xs uppercase tracking-widest text-text-inverse/50">
              Menu
            </h4>
            <ul className="space-y-4">
              {MENU.map(([label, href]) => (
                <li key={label}>
                  <NextLink
                    href={href}
                    className="inline-block font-sans text-sm font-light text-text-inverse/70 transition-all duration-300 hover:translate-x-1 hover:text-accent"
                  >
                    {label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-6 font-sans text-xs uppercase tracking-widest text-text-inverse/50">
              Explore
            </h4>
            <ul className="space-y-4">
              {EXPLORE.map(([label, href]) => (
                <li key={label}>
                  <NextLink
                    href={href}
                    className="inline-block font-sans text-sm font-light text-text-inverse/70 transition-all duration-300 hover:translate-x-1 hover:text-accent"
                  >
                    {label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-6 font-sans text-xs uppercase tracking-widest text-text-inverse/50">
              Legal
            </h4>
            <ul className="space-y-4">
              {LEGAL.map(([label, href]) => (
                <li key={label}>
                  <NextLink
                    href={href}
                    className="inline-block font-sans text-sm font-light text-text-inverse/70 transition-all duration-300 hover:translate-x-1 hover:text-accent"
                  >
                    {label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 md:col-span-4 md:mt-12 md:flex-row">
          <p className="font-sans text-xs font-light text-text-inverse/50">
            © {new Date().getFullYear()} Akhila. Precision in Architecture.
          </p>
        </div>
      </div>
    </footer>
  );
}
