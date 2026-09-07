import { cn } from "@/lib/cn";

export function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse bg-stone-200/80 rounded-[var(--radius-sm)]",
        className,
      )}
      aria-hidden
      {...props}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 border border-border bg-elevated p-8",
        className,
      )}
    >
      <h3 className="text-h3">{title}</h3>
      {description ? (
        <p className="text-text-muted max-w-prose">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 border border-error/30 bg-elevated p-8",
        className,
      )}
      role="alert"
    >
      <h3 className="text-h3">{title}</h3>
      {description ? (
        <p className="text-text-muted max-w-prose">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex justify-between label-caps text-text-muted">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div
        className="h-px w-full bg-border"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-px bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-premium)]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
