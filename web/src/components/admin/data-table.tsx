"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/ui/feedback";
import {
  Table,
  TBody,
  TD,
  THead,
  TH,
  TR,
} from "@/components/ui/table";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<T extends { id: string }> = {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: ReactNode;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  bulkActions?: ReactNode;
  rowActions?: (row: T) => ReactNode;
  getRowId?: (row: T) => string;
  className?: string;
};

function DataTableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <TR key={rowIndex}>
          {Array.from({ length: columns }).map((__, colIndex) => (
            <TD key={colIndex}>
              <Skeleton className="h-4 w-full max-w-[12rem]" />
            </TD>
          ))}
        </TR>
      ))}
    </>
  );
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  error,
  emptyTitle = "No records found",
  emptyDescription,
  emptyAction,
  searchPlaceholder = "Search…",
  searchValue,
  onSearchChange,
  filters,
  pagination,
  selectable,
  selectedIds = [],
  onSelectionChange,
  bulkActions,
  rowActions,
  getRowId = (row) => row.id,
  className,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const search = searchValue ?? internalSearch;

  const handleSearchChange = (value: string) => {
    if (searchValue === undefined) setInternalSearch(value);
    onSearchChange?.(value);
  };

  const allSelected =
    data.length > 0 && data.every((row) => selectedIds.includes(getRowId(row)));
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(getRowId));
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;

  const displayColumns = useMemo(() => {
    const cols = [...columns];
    if (rowActions) {
      cols.push({
        id: "__actions",
        header: "",
        cell: (row) => rowActions(row),
        className: "w-12 text-right",
        headerClassName: "w-12",
      });
    }
    return cols;
  }, [columns, rowActions]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full max-w-xs">
            <Input
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="border-border bg-elevated px-3 py-2 text-small rounded-[var(--radius-sm)]"
              aria-label="Search table"
            />
          </div>
          {filters}
        </div>

        {pagination ? (
          <p className="label-caps text-text-muted shrink-0">
            {pagination.total} total
          </p>
        ) : null}
      </div>

      {/* Bulk actions bar */}
      {selectable && selectedIds.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3 border border-accent/30 bg-surface px-4 py-3 rounded-[var(--radius-md)]">
          <span className="label-caps text-text">
            {selectedIds.length} selected
          </span>
          {bulkActions}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange?.([])}
          >
            Clear
          </Button>
        </div>
      ) : null}

      {/* Table or states */}
      {error ? (
        <ErrorState title="Unable to load data" description={error} />
      ) : !loading && data.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      ) : (
        <Table>
          <THead>
            <TR>
              {selectable ? (
                <TH className="w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                    className="size-4 accent-[var(--accent)]"
                  />
                </TH>
              ) : null}
              {displayColumns.map((column) => (
                <TH key={column.id} className={column.headerClassName}>
                  {column.header}
                </TH>
              ))}
            </TR>
          </THead>
          <TBody>
            {loading ? (
              <DataTableSkeleton
                columns={
                  displayColumns.length + (selectable ? 1 : 0)
                }
              />
            ) : (
              data.map((row) => {
                const rowId = getRowId(row);
                const selected = selectedIds.includes(rowId);
                return (
                  <TR key={rowId} selected={selected}>
                    {selectable ? (
                      <TD>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleRow(rowId)}
                          aria-label={`Select row ${rowId}`}
                          className="size-4 accent-[var(--accent)]"
                        />
                      </TD>
                    ) : null}
                    {displayColumns.map((column) => (
                      <TD key={column.id} className={column.className}>
                        {column.cell(row)}
                      </TD>
                    ))}
                  </TR>
                );
              })
            )}
          </TBody>
        </Table>
      )}

      {/* Pagination */}
      {pagination && !error ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-small text-text-muted">
            Page {pagination.page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1 || loading}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page >= totalPages || loading}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
