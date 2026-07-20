import { Badge } from "@/components/ui/badge";
import { humanize } from "@/lib/format";
import type { EnrichmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: EnrichmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full border-0 px-2.5 py-1 text-[0.6875rem] font-semibold",
        (status === "COMPLETE" || status === "ENRICHED") && "bg-[#e4eadf] text-[#3e4f39]",
        status === "NEEDS_REVIEW" && "bg-[#f6ead3] text-[#7a4c12]",
        status === "SUGGESTION_PENDING" && "bg-[#dfe8ef] text-[#304c62]",
        status === "REJECTED" && "bg-[#f5dfdc] text-[#7f332d]",
      )}
    >
      {humanize(status)}
    </Badge>
  );
}

