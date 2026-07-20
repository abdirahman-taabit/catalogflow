import { formatRelativeTime, humanize } from "@/lib/format";
import type { AuditEvent } from "@/lib/types";

interface ActivityTimelineProps {
  events: AuditEvent[];
  compact?: boolean;
}

export function ActivityTimeline({ events, compact = false }: ActivityTimelineProps) {
  return (
    <ol className="divide-y divide-[#ebe9e3]">
      {events.map((event) => (
        <li key={event.id} className="grid grid-cols-[18px_1fr_auto] gap-3 py-4 first:pt-0 last:pb-0">
          <span className="mt-1.5 size-2 rounded-full bg-primary shadow-[0_0_0_4px_#e4eadf]" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-medium">{humanize(event.eventType)}</p>
            <p className="mt-1 truncate font-mono text-[0.6875rem] text-muted-foreground">
              {event.productId ? `Product ${event.productId.slice(0, 8)}` : "Catalog workspace"}
            </p>
            {!compact && event.newValues && (
              <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{event.newValues}</p>
            )}
          </div>
          <time className="whitespace-nowrap text-[0.6875rem] text-muted-foreground" dateTime={event.createdAt}>
            {formatRelativeTime(event.createdAt)}
          </time>
        </li>
      ))}
    </ol>
  );
}
