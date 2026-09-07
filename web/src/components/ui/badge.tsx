import { cn } from "@/lib/cn";

const tones = {
  default: "border-border text-text bg-elevated",
  live: "border-live/40 text-live bg-elevated",
  offline: "border-border text-text-muted bg-surface",
  maintenance: "border-warn/50 text-warn bg-elevated",
  accent: "border-accent/40 text-accent bg-elevated",
} as const;

export function Badge({
  className,
  tone = "default",
  children,
  ...props
}: React.ComponentProps<"span"> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 label-caps px-2 py-1 border rounded-[var(--radius-sm)]",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function LiveIndicator({
  className,
  label = "LIVE",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 label-caps text-live",
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full bg-live motion-safe:animate-pulse"
        aria-hidden
      />
      <span>{label}</span>
    </span>
  );
}
