import { cn } from "@/lib/cn";
import { EditorialCard } from "@/components/sections/editorial-card";

export function InnerPageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "canvas-sky min-h-screen px-3 pb-8 pt-[calc(var(--header-h)+0.75rem)] font-editorial md:px-5 md:pb-10",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 md:gap-5">
        {children}
      </div>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <EditorialCard motion>
      {eyebrow ? (
        <p className="mb-3 text-sm text-text-muted">{eyebrow}</p>
      ) : null}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-ink-button sm:text-4xl md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </EditorialCard>
  );
}
