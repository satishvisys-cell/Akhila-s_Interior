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

type ModalContextValue = {
  titleId: string;
  descriptionId: string;
  onClose: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal components must be used within Modal");
  return ctx;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  if (event.key !== "Tab") return;

  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE),
  ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export function Modal({
  open,
  onClose,
  children,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  size = "md",
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
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
        return;
      }
      if (panelRef.current) trapFocus(panelRef.current, event);
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
    <ModalContext.Provider value={{ titleId, descriptionId, onClose }}>
      <div
        className={cn(
          "fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4",
          overlayClassName,
        )}
        role="presentation"
      >
        <button
          type="button"
          className="absolute inset-0 bg-[var(--overlay-hero)]"
          aria-label="Close dialog"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          className={cn(
            "relative z-10 w-full border border-border bg-elevated shadow-[0_24px_48px_rgba(26,25,23,0.12)] rounded-[var(--radius-md)]",
            sizeClasses[size],
            className,
          )}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}

export function ModalHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("border-b border-border px-6 py-5", className)}
      {...props}
    />
  );
}

export function ModalTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  const { titleId } = useModalContext();
  return (
    <h2
      id={titleId}
      className={cn("text-h3 font-display text-text", className)}
      {...props}
    />
  );
}

export function ModalDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { descriptionId } = useModalContext();
  return (
    <p
      id={descriptionId}
      className={cn("mt-2 text-small text-text-muted", className)}
      {...props}
    />
  );
}

export function ModalBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}

export function ModalFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function ModalClose({
  className,
  children = "Close",
  ...props
}: React.ComponentProps<"button">) {
  const { onClose } = useModalContext();
  return (
    <button
      type="button"
      className={cn(
        "absolute right-4 top-4 label-caps text-text-muted transition-colors hover:text-text",
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
