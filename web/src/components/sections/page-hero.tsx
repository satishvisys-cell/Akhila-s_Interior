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
    <section
      className={cn(
        "border-b border-border bg-bg pt-[calc(var(--header-h)+3rem)] pb-12 md:pb-16",
        className,
      )}
    >
      <Container
        className={cn(
          align === "center" && "text-center mx-auto flex flex-col items-center",
        )}
      >
        {eyebrow ? (
          <p className="label-caps text-text-muted mb-4">{eyebrow}</p>
        ) : null}
        <h1 className="text-h1 max-w-4xl">{title}</h1>
        {description ? (
          <p
            className={cn(
              "mt-5 max-w-2xl text-text-muted text-base md:text-lg leading-relaxed",
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
