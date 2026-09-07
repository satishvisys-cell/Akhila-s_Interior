import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-accent text-text-inverse hover:bg-accent-hover border border-transparent",
  secondary:
    "bg-transparent text-text border border-text/80 hover:bg-text hover:text-text-inverse",
  ghost: "bg-transparent text-text hover:text-accent border border-transparent",
  inverse:
    "bg-transparent text-text-inverse border border-text-inverse/70 hover:bg-text-inverse hover:text-graphite",
  charcoal:
    "bg-graphite text-text-inverse border border-transparent hover:bg-text",
} as const;

const sizes = {
  sm: "h-9 px-4 text-xs tracking-[0.08em]",
  md: "h-11 px-6 text-xs tracking-[0.1em]",
  lg: "h-12 px-8 text-xs tracking-[0.12em]",
} as const;

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 uppercase font-medium transition-[background-color,color,border-color,opacity] duration-[var(--dur-med)] ease-[var(--ease-premium)] rounded-[var(--radius-md)] disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="opacity-80">Loading…</span> : children}
    </button>
  );
}
