"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { PUBLIC_NAV } from "@/lib/navigation";
import { cn } from "@/lib/cn";

type SiteHeaderProps = {
  transparentOverHero?: boolean;
};

export function SiteHeader({ transparentOverHero = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  const overHero = transparentOverHero && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-header)] border-b transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        overHero
          ? "border-white/10 bg-ivory/30 text-text-inverse shadow-sm backdrop-blur-sm"
          : "border-[var(--color-sand-300)]/40 bg-ivory/90 text-text shadow-sm backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-6 py-4 md:px-8">
        <NextLink
          href="/"
          className={cn(
            "font-display text-2xl font-bold tracking-tighter uppercase transition-opacity hover:opacity-80",
            overHero ? "text-text-inverse" : "text-graphite",
          )}
        >
          AKHILA
        </NextLink>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {PUBLIC_NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <NextLink
                key={item.href}
                href={item.href}
                className={cn(
                  "font-sans text-xs uppercase tracking-widest transition-colors duration-300",
                  overHero
                    ? active
                      ? "text-accent"
                      : "text-text-inverse/75 hover:text-accent"
                    : active
                      ? "text-accent"
                      : "text-text/70 hover:text-accent",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </NextLink>
            );
          })}
        </nav>

        <NextLink
          href="/contact"
          className={cn(
            "hidden font-sans text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80 lg:inline-flex",
            overHero ? "text-text-inverse" : "text-accent",
          )}
        >
          Start a Project
        </NextLink>

        <button
          type="button"
          className="lg:hidden inline-flex size-11 items-center justify-center"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block size-5" aria-hidden>
            <span
              className={cn(
                "absolute left-0 top-[4px] h-px w-5 bg-current transition-transform",
                open && "translate-y-[6px] rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[10px] h-px w-5 bg-current transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[16px] h-px w-5 bg-current transition-transform",
                open && "-translate-y-[6px] -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      <div
        id={panelId}
        className={cn(
          "lg:hidden overflow-hidden border-t border-border/60 bg-bg text-text transition-[max-height,opacity] duration-[var(--dur-slow)]",
          open
            ? "max-h-[100dvh] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-6" aria-label="Mobile">
          {PUBLIC_NAV.map((item) => (
            <NextLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm uppercase tracking-wide border-b border-border"
            >
              {item.label}
            </NextLink>
          ))}
          <NextLink
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex h-11 items-center justify-center bg-accent text-text-inverse text-xs tracking-[0.2em] uppercase rounded-[var(--radius-md)]"
          >
            Start a Project
          </NextLink>
        </nav>
      </div>
    </header>
  );
}
