import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = { title: "SEO", robots: { index: false } };

export default async function AdminSeoPage() {
  await requireAdmin("seo:write");
  await initializeCmsStore();
  const [settingsList, pages, projects] = await Promise.all([
    list("settings"),
    list("pages"),
    list("projects"),
  ]);
  const settings = settingsList[0];

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb
        items={[{ href: "/admin", label: "Dashboard" }, { label: "SEO" }]}
      />
      <div>
        <h1 className="font-display text-h2 text-text">SEO</h1>
        <p className="mt-2 text-text-muted">
          Default site SEO and per-entity titles.
        </p>
      </div>

      <section className="border border-border bg-elevated px-5 py-5 rounded-[var(--radius-md)]">
        <h2 className="font-display text-h3 text-text">Defaults</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="label-caps text-text-muted">Title</dt>
            <dd className="mt-1 text-small text-text">
              {settings?.defaultSeo.title ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="label-caps text-text-muted">Description</dt>
            <dd className="mt-1 text-small text-text">
              {settings?.defaultSeo.description ?? "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className="font-display text-h3 text-text">Pages</h2>
        <ul className="mt-3 divide-y divide-border border border-border rounded-[var(--radius-md)]">
          {pages.map((p) => (
            <li key={p.id} className="px-4 py-3">
              <p className="text-small text-text">{p.title}</p>
              <p className="text-caption text-text-muted">
                {p.seo.title ?? "No SEO title"} · /{p.slug}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-h3 text-text">Projects</h2>
        <ul className="mt-3 divide-y divide-border border border-border rounded-[var(--radius-md)]">
          {projects.map((p) => (
            <li key={p.id} className="px-4 py-3">
              <p className="text-small text-text">{p.name}</p>
              <p className="text-caption text-text-muted">
                {p.seoTitle ?? p.seo?.title ?? "No SEO title"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
