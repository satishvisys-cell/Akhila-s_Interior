"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
} from "@/components/admin/data-table";

export type CrudEditorMode = "drawer" | "modal";

export type CrudPageProps<T extends { id: string }> = {
  title: string;
  description?: string;
  createLabel?: string;
  breadcrumbs?: { href?: string; label: string }[];
  onCreate?: () => void;
  editorOpen?: boolean;
  onEditorClose?: () => void;
  editorMode?: CrudEditorMode;
  editorTitle?: string;
  editorContent?: ReactNode;
  editorFooter?: ReactNode;
  primaryAction?: ReactNode;
  headerActions?: ReactNode;
  tableProps: Omit<
    DataTableProps<T>,
    "columns" | "data"
  > & {
    columns: DataTableColumn<T>[];
    data: T[];
  };
  className?: string;
};

export function CrudPage<T extends { id: string }>({
  title,
  description,
  createLabel = "Create",
  breadcrumbs,
  onCreate,
  editorOpen = false,
  onEditorClose,
  editorMode = "drawer",
  editorTitle,
  editorContent,
  editorFooter,
  primaryAction,
  headerActions,
  tableProps,
  className,
}: CrudPageProps<T>) {
  const [internalEditorOpen, setInternalEditorOpen] = useState(false);
  const open = editorOpen || internalEditorOpen;
  const closeEditor = () => {
    onEditorClose?.();
    setInternalEditorOpen(false);
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      setInternalEditorOpen(true);
    }
  };

  const editor = editorContent ? (
    editorMode === "modal" ? (
      <Modal open={open} onClose={closeEditor} size="lg">
        <ModalHeader>
          <ModalTitle>{editorTitle ?? createLabel}</ModalTitle>
        </ModalHeader>
        <ModalBody>{editorContent}</ModalBody>
        {editorFooter ? <ModalFooter>{editorFooter}</ModalFooter> : null}
      </Modal>
    ) : (
      <Drawer open={open} onClose={closeEditor} width="lg">
        <DrawerHeader>
          <DrawerTitle>{editorTitle ?? createLabel}</DrawerTitle>
          <button
            type="button"
            className="label-caps text-text-muted hover:text-text"
            onClick={closeEditor}
          >
            Close
          </button>
        </DrawerHeader>
        <DrawerBody>{editorContent}</DrawerBody>
        {editorFooter ? <DrawerFooter>{editorFooter}</DrawerFooter> : null}
      </Drawer>
    )
  ) : null;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {breadcrumbs ? <Breadcrumb items={breadcrumbs} /> : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-h2 font-display text-text">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-text-muted">{description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {headerActions}
          {primaryAction ?? (
            <Button onClick={handleCreate}>{createLabel}</Button>
          )}
        </div>
      </div>

      <DataTable {...tableProps} />

      {editor}
    </div>
  );
}
