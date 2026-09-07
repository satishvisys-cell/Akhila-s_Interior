"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export type ToastTone = "default" | "success" | "error" | "warning";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
};

type ToastInput = Omit<ToastItem, "id"> & { id?: string };

type ToastContextValue = {
  toasts: ToastItem[];
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneClasses: Record<ToastTone, string> = {
  default: "border-border bg-elevated text-text",
  success: "border-live/40 bg-elevated text-text",
  error: "border-error/40 bg-elevated text-text",
  warning: "border-warn/50 bg-elevated text-text",
};

function ToastViewport({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: string) => void }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[calc(var(--z-modal)+10)] flex w-full max-w-sm flex-col gap-2"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          role="status"
          className={cn(
            "pointer-events-auto border px-4 py-3 shadow-[0_8px_24px_rgba(26,25,23,0.08)] rounded-[var(--radius-md)]",
            toneClasses[item.tone ?? "default"],
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-small font-medium">{item.title}</p>
              {item.description ? (
                <p className="mt-1 text-caption text-text-muted">
                  {item.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="label-caps shrink-0 text-text-muted transition-colors hover:text-text"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>,
    document.body,
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = input.id ?? crypto.randomUUID();
      const item: ToastItem = {
        id,
        title: input.title,
        description: input.description,
        tone: input.tone ?? "default",
        duration: input.duration ?? 5000,
      };

      setToasts((prev) => [...prev, item]);

      if (item.duration && item.duration > 0) {
        window.setTimeout(() => dismiss(id), item.duration);
      }

      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({ toasts, toast, dismiss }),
    [toasts, toast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
