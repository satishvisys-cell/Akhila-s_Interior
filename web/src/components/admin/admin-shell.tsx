"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Drawer, DrawerBody, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/form";
import {
  ADMIN_NAV,
  ADMIN_NAV_GROUPS,
  type AdminNavItem,
} from "@/components/admin/admin-nav";

function isActiveRoute(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const groups = Object.keys(ADMIN_NAV_GROUPS) as Array<
    NonNullable<AdminNavItem["group"]>
  >;

  return (
    <nav className="flex flex-col gap-6" aria-label="Admin">
      {groups.map((group) => {
        const items = ADMIN_NAV.filter((item) => item.group === group);
        if (items.length === 0) return null;

        return (
          <div key={group}>
            <p className="mb-2 px-3 label-caps text-text-inverse/40">
              {ADMIN_NAV_GROUPS[group]}
            </p>
            <ul className="flex flex-col gap-0.5">
              {items.map((item) => {
                const active = isActiveRoute(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "block px-3 py-2 text-nav transition-colors duration-[var(--dur-fast)] rounded-[var(--radius-sm)]",
                        active
                          ? "bg-text-inverse/10 text-accent border-l-2 border-accent"
                          : "text-text-inverse/70 hover:bg-text-inverse/5 hover:text-text-inverse",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <div className="border-b border-text-inverse/10 px-5 py-5">
      <Link href="/admin" className="group block">
        <p className="font-display text-xl text-text-inverse tracking-tight">
          Akhila
        </p>
        <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-text-inverse/45 group-hover:text-accent transition-colors">
          Interior CMS
        </p>
      </Link>
    </div>
  );
}

export type AdminShellProps = {
  children: ReactNode;
  breadcrumbs?: ReactNode;
  userMenu?: ReactNode;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
};

export function AdminShell({
  children,
  breadcrumbs,
  userMenu,
  searchPlaceholder = "Search content…",
  onSearch,
}: AdminShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-admin-sidebar lg:flex">
        <SidebarBrand />
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <NavLinks pathname={pathname} />
        </div>
      </aside>

      {/* Mobile drawer nav */}
      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        width="sm"
        className="bg-admin-sidebar border-text-inverse/10 lg:hidden"
      >
        <DrawerHeader className="border-text-inverse/10">
          <DrawerTitle className="text-text-inverse">Akhila CMS</DrawerTitle>
          <button
            type="button"
            className="label-caps text-text-inverse/60 hover:text-text-inverse"
            onClick={() => setMobileNavOpen(false)}
          >
            Close
          </button>
        </DrawerHeader>
        <DrawerBody className="px-2">
          <NavLinks
            pathname={pathname}
            onNavigate={() => setMobileNavOpen(false)}
          />
        </DrawerBody>
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-[var(--z-header)] border-b border-border bg-elevated/95 backdrop-blur-sm">
          <div className="flex items-center gap-4 px-4 py-3 md:px-6">
            <button
              type="button"
              className="label-caps text-text-muted hover:text-text lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              Menu
            </button>

            <div className="relative min-w-0 flex-1 max-w-md">
              <label htmlFor="admin-search" className="sr-only">
                Search
              </label>
              <Input
                id="admin-search"
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="border-border bg-surface px-3 py-2 text-small rounded-[var(--radius-sm)]"
              />
            </div>

            <div className="hidden min-w-0 flex-1 md:block">
              {breadcrumbs}
            </div>

            <div className="ml-auto shrink-0">
              {userMenu ?? (
                <button
                  type="button"
                  className="flex items-center gap-2 label-caps text-text-muted hover:text-text"
                  aria-label="User menu"
                >
                  <span
                    className="flex size-8 items-center justify-center border border-border bg-surface text-caption rounded-[var(--radius-sm)]"
                    aria-hidden
                  >
                    AK
                  </span>
                  <span className="hidden sm:inline">Account</span>
                </button>
              )}
            </div>
          </div>

          {breadcrumbs ? (
            <div className="border-t border-border px-4 py-2 md:hidden">
              {breadcrumbs}
            </div>
          ) : null}
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
