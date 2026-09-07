import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { readAuditLogs } from "@/lib/cms/audit";
import {
  initializeCmsStore,
  list,
  listConstructionProgress,
} from "@/lib/cms/store";
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

function KpiCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href?: string;
}) {
  const inner = (
    <div className="border border-border bg-elevated px-5 py-6 rounded-[var(--radius-md)]">
      <p className="label-caps text-text-muted">{label}</p>
      <p className="mt-3 font-display text-3xl text-text">{value}</p>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  await initializeCmsStore();

  const [projects, cameras, media, pages, heroes, audit] = await Promise.all([
    list("projects"),
    list("cameras"),
    list("media"),
    list("pages"),
    list("heroes"),
    readAuditLogs({ limit: 8 }),
  ]);

  const drafts = [
    ...projects.filter((p) => p.publishStatus === "draft"),
    ...pages.filter((p) => p.publishStatus === "draft"),
  ].length;

  const liveCameras = cameras.filter((c) => c.status === "live").length;
  const progress = await listConstructionProgress();

  const primaryHero = heroes[0];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-h2 text-text">Dashboard</h1>
        <p className="mt-2 text-text-muted">
          Overview of content, live monitoring, and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Projects" value={projects.length} href="/admin/projects" />
        <KpiCard label="Live cameras" value={liveCameras} href="/admin/cctv" />
        <KpiCard label="Drafts" value={drafts} href="/admin/projects" />
        <KpiCard label="Media assets" value={media.length} href="/admin/media-library" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <h2 className="font-display text-h3 text-text">Recent activity</h2>
          {audit.length === 0 ? (
            <p className="mt-4 text-small text-text-muted">
              No audit events yet. Sign-ins and content changes will appear here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border border border-border bg-elevated rounded-[var(--radius-md)]">
              {audit.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-small text-text">
                      <span className="label-caps text-accent">{entry.action}</span>
                      {" · "}
                      {entry.entityType}/{entry.entityId.slice(0, 12)}
                    </p>
                  </div>
                  <time
                    className="text-caption text-text-muted"
                    dateTime={entry.createdAt}
                  >
                    {new Date(entry.createdAt).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-display text-h3 text-text">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href={
                primaryHero
                  ? `/admin/hero-sections/${primaryHero.id}`
                  : "/admin/hero-sections"
              }
              className="inline-flex h-11 items-center justify-center bg-graphite px-6 text-xs uppercase tracking-[0.1em] text-text-inverse hover:bg-text rounded-[var(--radius-md)]"
            >
              Edit Hero
            </Link>
            <Link
              href="/admin/projects"
              className="inline-flex h-11 items-center border border-text/80 px-6 text-xs uppercase tracking-[0.1em] transition-colors hover:bg-text hover:text-text-inverse rounded-[var(--radius-md)]"
            >
              Add Project
            </Link>
            <Link
              href="/admin/cctv"
              className="inline-flex h-11 items-center border border-transparent px-6 text-xs uppercase tracking-[0.1em] text-text hover:text-accent rounded-[var(--radius-md)]"
            >
              Manage CCTV
            </Link>
          </div>

          <div className="mt-8 border border-border bg-surface px-4 py-5 rounded-[var(--radius-md)]">
            <p className="label-caps text-text-muted">Construction tracking</p>
            <p className="mt-2 font-display text-2xl text-text">
              {progress.length} active progress records
            </p>
            <Link
              href="/admin/construction-progress"
              className="mt-3 inline-block text-small text-accent hover:underline"
            >
              View progress →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
