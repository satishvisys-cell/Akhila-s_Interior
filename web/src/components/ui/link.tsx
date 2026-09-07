import NextLink from "next/link";
import { cn } from "@/lib/cn";

type LinkProps = React.ComponentProps<typeof NextLink> & {
  underline?: boolean;
  muted?: boolean;
};

export function Link({
  className,
  underline,
  muted,
  ...props
}: LinkProps) {
  return (
    <NextLink
      className={cn(
        "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-premium)]",
        muted ? "text-text-muted hover:text-text" : "text-text hover:text-accent",
        underline && "underline underline-offset-4 decoration-border hover:decoration-accent",
        className,
      )}
      {...props}
    />
  );
}

export function NavLink({
  className,
  active,
  ...props
}: LinkProps & { active?: boolean }) {
  return (
    <NextLink
      className={cn(
        "label-caps text-nav transition-colors duration-[var(--dur-fast)]",
        active ? "text-accent" : "text-current hover:text-accent",
        className,
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    />
  );
}
