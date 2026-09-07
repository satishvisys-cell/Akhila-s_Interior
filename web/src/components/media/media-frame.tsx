import { cn } from "@/lib/cn";

type MediaFrameProps = {
  alt: string;
  src?: string | null;
  className?: string;
  label?: string;
};

/** Editorial media frame — falls back to architectural placeholder when asset missing. */
export function MediaFrame({ alt, src, className, label }: MediaFrameProps) {
  const url = src && src.length > 0 ? src : "/media/hero-placeholder.svg";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-graphite text-text-inverse",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div
        className="absolute inset-0 bg-[var(--overlay-hero)] opacity-40"
        aria-hidden
      />
      {label ? (
        <span className="absolute bottom-4 left-4 label-caps text-text-inverse/80">
          {label}
        </span>
      ) : null}
    </div>
  );
}
