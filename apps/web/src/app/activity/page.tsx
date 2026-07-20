"use client";

import { ClockCounterClockwiseIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import useSWR from "swr";

import { ActivityTimeline } from "@/components/activity-timeline";
import { AppShell } from "@/components/app-shell";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-state";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getActivity } from "@/lib/api";

export default function ActivityPage() {
  const [page, setPage] = useState(0);
  const [eventType, setEventType] = useState("all");
  const activity = useSWR(`activity:${page}`, () => getActivity(page));
  const visibleEvents = useMemo(
    () => activity.data?.items.filter((event) => eventType === "all" || event.eventType === eventType) ?? [],
    [activity.data, eventType],
  );

  return (
    <AppShell title="Activity">
      <PageHeading
        eyebrow="Audit history"
        title="Every important catalog decision, in order."
        description="Follow imports, generated suggestions, approvals, and rejections with product references and timestamps."
      />

      <Card className="gap-0 py-0 shadow-none">
        <CardHeader className="flex flex-col gap-3 border-b border-border px-[22px] py-5 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-sm"><ClockCounterClockwiseIcon size={17} className="text-primary" aria-hidden="true" /> Workspace timeline</CardTitle>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-full sm:w-56" aria-label="Filter activity type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All activity</SelectItem>
              <SelectItem value="PRODUCT_IMPORTED">Imports</SelectItem>
              <SelectItem value="SUGGESTION_CREATED">Suggestions</SelectItem>
              <SelectItem value="SUGGESTION_APPROVED">Approvals</SelectItem>
              <SelectItem value="SUGGESTION_REJECTED">Rejections</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-[22px]">
          {activity.isLoading && <LoadingState />}
          {activity.error && <ErrorState description="Activity history could not be loaded." onRetry={() => void activity.mutate()} />}
          {activity.data && visibleEvents.length > 0 && <ActivityTimeline events={visibleEvents} />}
          {activity.data && visibleEvents.length === 0 && (
            <EmptyState kind="search" title="No matching activity" description="Choose another event type or complete a catalog action." />
          )}
        </CardContent>
      </Card>
      {activity.data && (
        <div className="mt-3.5 flex items-center justify-between text-xs text-muted-foreground">
          <p>Page {activity.data.page + 1} of {Math.max(activity.data.totalPages, 1)}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page + 1 >= activity.data.totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

