import { cn } from "@/lib/cn";

type ContainerProps = React.ComponentProps<"div"> & {
  wide?: boolean;
};

export function Container({ className, wide, ...props }: ContainerProps) {
  return (
    <div
      className={cn(wide ? "container-wide" : "container-akhila", className)}
      {...props}
    />
  );
}

type SectionProps = React.ComponentProps<"section"> & {
  flush?: boolean;
};

export function Section({ className, flush, ...props }: SectionProps) {
  return (
    <section className={cn(!flush && "section-y", className)} {...props} />
  );
}

type GridProps = React.ComponentProps<"div"> & {
  cols?: 1 | 2 | 3 | 4 | 12;
};

export function Grid({ className, cols = 12, ...props }: GridProps) {
  return (
    <div
      className={cn(
        "grid gap-6 md:gap-8",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 md:grid-cols-2",
        cols === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        cols === 12 && "grid-cols-1 md:grid-cols-12",
        className,
      )}
      {...props}
    />
  );
}

export function Stack({
  className,
  gap = "md",
  ...props
}: React.ComponentProps<"div"> & { gap?: "sm" | "md" | "lg" }) {
  return (
    <div
      className={cn(
        "flex flex-col",
        gap === "sm" && "gap-3",
        gap === "md" && "gap-5",
        gap === "lg" && "gap-8",
        className,
      )}
      {...props}
    />
  );
}

export function Divider({ className, ...props }: React.ComponentProps<"hr">) {
  return (
    <hr
      className={cn("border-0 border-t border-border", className)}
      {...props}
    />
  );
}
