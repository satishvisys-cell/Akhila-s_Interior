import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { EmptyState } from "@/components/ui/feedback";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false },
};

export default async function AdminTestimonialsPage() {
  await requireAdmin("page:write");

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { href: "/admin", label: "Dashboard" },
          { label: "Testimonials" },
        ]}
      />
      <div>
        <h1 className="font-display text-h2 text-text">Testimonials</h1>
        <p className="mt-2 text-text-muted">
          Client quotes for marketing pages and project stories.
        </p>
      </div>
      <EmptyState
        title="No testimonials yet"
        description="Seed testimonials when the collection is wired. You can still place a testimonials block in the page builder."
      />
    </div>
  );
}
