import { WebsiteStatus } from "@/lib/types";

const LABELS: Record<WebsiteStatus, string> = {
  listed: "Website Listed",
  none: "No Website Listed",
  unknown: "Unknown",
};

const STYLES: Record<WebsiteStatus, string> = {
  listed: "bg-fg/10 text-fg border border-fg/20",
  none: "bg-accent/15 text-accent border border-accent/40",
  unknown: "bg-muted/15 text-muted border border-muted/30",
};

export default function StatusBadge({ status }: { status: WebsiteStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
