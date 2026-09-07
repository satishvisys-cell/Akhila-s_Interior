import { cn } from "@/lib/cn";

const field =
  "w-full bg-transparent border-0 border-b border-border px-0 py-3 text-text placeholder:text-text-muted/70 focus:outline-none focus:border-accent transition-colors duration-[var(--dur-fast)] rounded-none";

export function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("label-caps text-text-muted block mb-2", className)}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return <input className={cn(field, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(field, "min-h-28 resize-y", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select className={cn(field, "pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function FieldError({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("mt-2 text-small text-error", className)}
      role="alert"
      {...props}
    />
  );
}
