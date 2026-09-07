import { Container } from "@/components/ui/layout";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}: PageHeroProps) {
  return (
    <section className={cn("editorial-card p-6 md:p-10 lg:p-12", className)}>
      <Container
        className={cn(
          "px-0",
          align === "center" && "mx-auto flex flex-col items-center text-center",
        )}
      >
        {eyebrow ? (
          <p className="mb-3 font-editorial text-sm text-text-muted">{eyebrow}</p>
        ) : null}
        <h1 className="max-w-4xl font-editorial text-4xl font-extrabold tracking-tight text-ink-button md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-2xl font-editorial text-base leading-relaxed text-text-secondary md:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8 w-full">{children}</div> : null}
      </Container>
    </section>
  );
}
