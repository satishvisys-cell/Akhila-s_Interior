import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false },
};

export default async function AdminAnalyticsPage() {
  await requireAdmin("analytics:read");
  await initializeCmsStore();

  const [projects, pages, media, cameras] = await Promise.all([
    list("projects"),
    list("pages"),
    list("media"),
    list("cameras"),
  ]);

  const publishedProjects = projects.filter(
    (p) => p.publishStatus === "published",
  ).length;

  const metrics = [
    { label: "Published projects", value: publishedProjects },
    { label: "Total pages", value: pages.length },
    { label: "Media assets", value: media.length },
    { label: "Cameras online", value: cameras.filter((c) => c.status === "live").length },
    { label: "Est. monthly visits", value: "—" },
    { label: "Avg. session (placeholder)", value: "—" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb
        items={[
          { href: "/admin", label: "Dashboard" },
          { label: "Analytics" },
        ]}
      />
      <div>
        <h1 className="font-display text-h2 text-text">Analytics</h1>
        <p className="mt-2 text-text-muted">
          Placeholder metrics until a product analytics provider is connected.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="border border-border bg-elevated px-5 py-6 rounded-[var(--radius-md)]"
          >
            <p className="label-caps text-text-muted">{m.label}</p>
            <p className="mt-3 font-display text-3xl text-text">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
