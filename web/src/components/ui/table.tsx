import { cn } from "@/lib/cn";

export function Table({
  className,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto border border-border bg-elevated rounded-[var(--radius-md)]">
      <table
        className={cn("w-full min-w-[640px] border-collapse text-left", className)}
        {...props}
      />
    </div>
  );
}

export function THead({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("border-b border-border bg-surface", className)}
      {...props}
    />
  );
}

export function TBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function TR({
  className,
  selected,
  ...props
}: React.ComponentProps<"tr"> & { selected?: boolean }) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-surface/60",
        selected && "bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function TH({
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "label-caps px-4 py-3 text-left font-semibold text-text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TD({
  className,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("px-4 py-3 text-small text-text align-middle", className)}
      {...props}
    />
  );
}
