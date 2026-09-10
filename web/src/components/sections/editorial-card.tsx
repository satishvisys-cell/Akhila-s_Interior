import { cn } from "@/lib/cn";

export function EditorialCard({
  children,
  className,
  padded = true,
  motion = false,
  lift = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  /** Soft Dribbble card entrance when true */
  motion?: boolean;
  /** Subtle hover lift — use on compact cards, not full-bleed sections */
  lift?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      data-motion-card={motion ? "" : undefined}
      className={cn(
        "editorial-card",
        lift && "hover-lift",
        padded && "p-6 md:p-10 lg:p-12",
        motion && "opacity-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </section>
  );
}
