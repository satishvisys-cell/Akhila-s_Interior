import { cn } from "@/lib/cn";
import { Link } from "@/components/ui/link";

export function Breadcrumb({
  items,
  className,
}: {
  items: { href?: string; label: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("label-caps", className)}>
      <ol className="flex flex-wrap items-center gap-2 text-text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {item.href && !last ? (
                <Link href={item.href} muted>
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-text" : undefined} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
