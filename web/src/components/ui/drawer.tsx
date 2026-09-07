"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type DrawerContextValue = {
  titleId: string;
  onClose: () => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("Drawer components must be used within Drawer");
  return ctx;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  width?: "sm" | "md" | "lg" | "full";
};

const widthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
  full: "max-w-full",
} as const;

export function Drawer({
  open,
  onClose,
  children,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  width = "md",
}: DrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    if (panel) {
      const focusable = panel.querySelector<HTMLElement>(FOCUSABLE);
      (focusable ?? panel).focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <DrawerContext.Provider value={{ titleId, onClose }}>
      <div
        className={cn(
          "fixed inset-0 z-[var(--z-modal)] flex justify-end",
          overlayClassName,
        )}
        role="presentation"
      >
        <button
          type="button"
          className="absolute inset-0 bg-[var(--overlay-hero)]"
          aria-label="Close drawer"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(
            "relative z-10 flex h-full w-full flex-col border-l border-border bg-elevated shadow-[-16px_0_48px_rgba(26,25,23,0.1)] transition-transform duration-[var(--dur-med)] ease-[var(--ease-premium)]",
            widthClasses[width],
            className,
          )}
        >
          {children}
        </div>
      </div>
    </DrawerContext.Provider>,
    document.body,
  );
}

export function DrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-start justify-between border-b border-border px-6 py-5",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  const { titleId } = useDrawerContext();
  return (
    <h2
      id={titleId}
      className={cn("text-h3 font-display text-text", className)}
      {...props}
    />
  );
}

export function DrawerBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-6 py-5", className)} {...props} />
  );
}

export function DrawerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerClose({
  className,
  children = "Close",
  ...props
}: React.ComponentProps<"button">) {
  const { onClose } = useDrawerContext();
  return (
    <button
      type="button"
      className={cn(
        "label-caps text-text-muted transition-colors hover:text-text",
        className,
      )}
      onClick={onClose}
      aria-label="Close"
      {...props}
    >
      {children}
    </button>
  );
}
