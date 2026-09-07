import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

export type ContentStatus = "draft" | "published" | "archived";
export type LiveStatus = "live" | "offline" | "maintenance";

const contentTones: Record<
  ContentStatus,
  React.ComponentProps<typeof Badge>["tone"]
> = {
  draft: "default",
  published: "accent",
  archived: "offline",
};

const liveTones: Record<
  LiveStatus,
  React.ComponentProps<typeof Badge>["tone"]
> = {
  live: "live",
  offline: "offline",
  maintenance: "maintenance",
};

const contentLabels: Record<ContentStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

const liveLabels: Record<LiveStatus, string> = {
  live: "Live",
  offline: "Offline",
  maintenance: "Maintenance",
};

export function ContentStatusBadge({
  status,
  className,
}: {
  status: ContentStatus;
  className?: string;
}) {
  return (
    <Badge tone={contentTones[status]} className={className}>
      {contentLabels[status]}
    </Badge>
  );
}

export function LiveStatusBadge({
  status,
  className,
}: {
  status: LiveStatus;
  className?: string;
}) {
  return (
    <Badge tone={liveTones[status]} className={className}>
      {liveLabels[status]}
    </Badge>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: ContentStatus | LiveStatus;
  className?: string;
}) {
  if (status === "live" || status === "offline" || status === "maintenance") {
    return <LiveStatusBadge status={status} className={className} />;
  }
  return <ContentStatusBadge status={status} className={className} />;
}

export function StatusDot({
  status,
  className,
}: {
  status: LiveStatus;
  className?: string;
}) {
  const colors: Record<LiveStatus, string> = {
    live: "bg-live",
    offline: "bg-text-muted",
    maintenance: "bg-warn",
  };

  return (
    <span
      className={cn("inline-flex items-center gap-2 label-caps", className)}
    >
      <span
        className={cn("size-1.5 rounded-full", colors[status])}
        aria-hidden
      />
      {liveLabels[status]}
    </span>
  );
}
