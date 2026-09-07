"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { PUBLIC_NAV } from "@/lib/navigation";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-header)] border-b bg-white/95 text-ink-button backdrop-blur-md transition-[box-shadow,border-color,padding] duration-300",
        scrolled
          ? "border-black/10 shadow-[0_8px_28px_rgba(17,17,17,0.06)]"
          : "border-transparent shadow-none",
      )}
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 transition-[padding] duration-300 md:px-8",
          scrolled ? "py-2.5" : "py-3.5",
        )}
      >
        <NextLink
          href="/"
          className="font-editorial text-xl font-extrabold tracking-tight text-ink-button transition-opacity hover:opacity-70 md:text-[1.65rem]"
        >
          AKHILA
        </NextLink>

        <nav
          className="hidden items-center justify-end gap-5 xl:gap-7 lg:flex"
          aria-label="Primary"
        >
          {PUBLIC_NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <NextLink
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative font-editorial text-[0.95rem] font-medium transition-colors duration-200",
                  active
                    ? "text-ink-button"
                    : "text-neutral-500 hover:text-ink-button",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 -bottom-1 h-px origin-left bg-ink-button transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100",
                  )}
                />
              </NextLink>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <MagneticButton
            href="/contact"
            className="btn-press hidden min-h-11 items-center justify-center rounded-md bg-ink-button px-4 py-2.5 font-editorial text-sm font-semibold text-white hover:bg-black lg:inline-flex"
          >
            Start a Project
          </MagneticButton>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-black/5 lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="relative block size-5" aria-hidden>
              <span
                className={cn(
                  "absolute left-0 top-[4px] h-px w-5 bg-current transition-transform duration-300",
                  open && "translate-y-[6px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[10px] h-px w-5 bg-current transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[16px] h-px w-5 bg-current transition-transform duration-300",
                  open && "-translate-y-[6px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id={panelId}
        className={cn(
          "overflow-hidden border-t border-black/10 bg-white transition-[max-height,opacity] duration-300 lg:hidden",
          open
            ? "max-h-[100dvh] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col px-6 py-4" aria-label="Mobile">
          {PUBLIC_NAV.map((item, i) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <NextLink
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex min-h-12 items-center border-b border-black/5 py-3 font-editorial text-sm transition-all duration-300",
                  active
                    ? "translate-x-1 text-ink-button"
                    : "text-ink-button/80 hover:translate-x-1 hover:text-terracotta",
                )}
                style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </NextLink>
            );
          })}
          <NextLink
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn-press mt-5 inline-flex h-11 items-center justify-center rounded-md bg-ink-button text-sm font-semibold text-white"
          >
            Start a Project
          </NextLink>
        </nav>
      </div>
    </header>
  );
}
