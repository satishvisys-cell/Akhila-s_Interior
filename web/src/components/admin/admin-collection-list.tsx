"use client";

import Link from "next/link";
import { CrudPage } from "@/components/admin/crud-page";
import {
  StatusBadge,
  type ContentStatus,
  type LiveStatus,
} from "@/components/admin/status-badge";
import type { DataTableColumn } from "@/components/admin/data-table";

export type SimpleRow = {
  id: string;
  title: string;
  subtitle?: string;
  status?: ContentStatus | LiveStatus | string;
  href?: string;
  meta?: string;
};

function toContentStatus(status?: string): ContentStatus | LiveStatus | null {
  if (!status) return null;
  if (
    status === "draft" ||
    status === "published" ||
    status === "archived" ||
    status === "live" ||
    status === "offline" ||
    status === "maintenance"
  ) {
    return status;
  }
  if (status === "scheduled") return "draft";
  return null;
}

export function AdminCollectionList({
  title,
  description,
  createHref,
  createLabel = "Create",
  primaryAction,
  rows,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
  primaryAction?: React.ReactNode;
  rows: SimpleRow[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const columns: DataTableColumn<SimpleRow>[] = [
    {
      id: "title",
      header: "Name",
      cell: (row) =>
        row.href ? (
          <Link href={row.href} className="text-text hover:text-accent">
            {row.title}
          </Link>
        ) : (
          <span>{row.title}</span>
        ),
    },
    {
      id: "subtitle",
      header: "Details",
      cell: (row) => (
        <span className="text-text-muted">{row.subtitle ?? "—"}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const status = toContentStatus(row.status);
        return status ? <StatusBadge status={status} /> : <span>—</span>;
      },
    },
    {
      id: "meta",
      header: "Updated",
      cell: (row) => (
        <span className="text-caption text-text-muted">{row.meta ?? "—"}</span>
      ),
    },
  ];

  const resolvedPrimary =
    primaryAction ??
    (createHref ? (
      <Link
        href={createHref}
        className="inline-flex h-11 items-center bg-accent px-6 text-xs uppercase tracking-[0.1em] text-text-inverse hover:bg-accent-hover rounded-[var(--radius-md)]"
      >
        {createLabel}
      </Link>
    ) : (
      <span className="sr-only">No create action</span>
    ));

  return (
    <CrudPage
      title={title}
      description={description}
      createLabel={createLabel}
      primaryAction={resolvedPrimary}
      breadcrumbs={[
        { href: "/admin", label: "Dashboard" },
        { label: title },
      ]}
      tableProps={{
        columns,
        data: rows,
        emptyTitle: emptyTitle ?? `No ${title.toLowerCase()} yet`,
        emptyDescription,
        searchPlaceholder: `Search ${title.toLowerCase()}…`,
      }}
    />
  );
}
