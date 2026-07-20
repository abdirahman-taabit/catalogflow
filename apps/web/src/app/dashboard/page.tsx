"use client";

import { ArrowRightIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import useSWR from "swr";

import { ActivityTimeline } from "@/components/activity-timeline";
import { AppShell } from "@/components/app-shell";
import { ErrorState, LoadingState } from "@/components/data-state";
import { PageHeading } from "@/components/page-heading";
import { QualityScore } from "@/components/quality-score";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboard, getProducts } from "@/lib/api";
import { formatRelativeTime } from "@/lib/format";

export default function DashboardPage() {
  const dashboard = useSWR("dashboard", getDashboard);
  const spotlight = useSWR("dashboard-spotlight", () =>
    getProducts("?page=0&size=1&sort=qualityScore&direction=asc"),
  );

  if (dashboard.isLoading || spotlight.isLoading) {
    return (
      <AppShell title="Overview">
        <PageHeading eyebrow="Catalog health" title="Keep quality moving." description="Loading your catalog workspace." />
        <LoadingState />
      </AppShell>
    );
  }

  if (dashboard.error || spotlight.error || !dashboard.data) {
    return (
      <AppShell title="Overview">
        <PageHeading eyebrow="Catalog health" title="Keep quality moving." description="Your workspace could not be loaded." />
        <ErrorState
          description="The CatalogFlow API did not respond. Start the backend or try again."
          onRetry={() => {
            void dashboard.mutate();
            void spotlight.mutate();
          }}
        />
      </AppShell>
    );
  }

  const data = dashboard.data;
  const reviewProduct = spotlight.data?.items[0];
  const qualityTotal = Math.max(
    data.qualityOverview.healthy + data.qualityOverview.watch + data.qualityOverview.critical,
    1,
  );

  return (
    <AppShell
      title="Overview"
      action={
        <Button size="sm" variant="outline" asChild className="hidden sm:inline-flex">
          <Link href="/imports"><UploadSimpleIcon size={15} aria-hidden="true" /> Import CSV</Link>
        </Button>
      }
    >
      <PageHeading
        eyebrow="Catalog health"
        title="Keep your catalog accurate, consistent, and ready to sell."
        description="Prioritize the products that need attention. Every suggestion remains under your control."
        action={
          reviewProduct ? (
            <Button asChild>
              <Link href={`/products/${reviewProduct.id}`}>
                Review next product <ArrowRightIcon size={16} aria-hidden="true" />
              </Link>
            </Button>
          ) : undefined
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Catalog statistics">
        <StatCard label="Total products" value={data.totalProducts} note="In this workspace" />
        <StatCard label="Requires review" value={data.productsRequiringReview} note="Quality below 80" tone="warning" />
        <StatCard label="Pending suggestions" value={data.pendingSuggestions} note="Ready for review" tone="neutral" />
        <StatCard label="Approved improvements" value={data.approvedImprovements} note="All-time decisions" />
        <StatCard label="Average quality" value={data.averageQuality} note="Out of 100" />
      </section>

      <div className="mt-[18px] grid gap-[18px] xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
        <Card className="gap-0 py-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border px-[22px] py-5">
            <div>
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Review spotlight</p>
              <CardTitle className="mt-2 text-lg">{reviewProduct?.title ?? "No products to review"}</CardTitle>
            </div>
            {reviewProduct && <StatusBadge status={reviewProduct.status} />}
          </CardHeader>
          <CardContent className="p-[22px]">
            {reviewProduct ? (
              <>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{reviewProduct.sku}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {reviewProduct.problems.map((problem) => (
                        <span key={problem} className="rounded-md bg-[#f6ead3] px-2.5 py-1.5 text-[0.6875rem] font-medium text-[#6f4a18]">
                          {problem}
                        </span>
                      ))}
                    </div>
                  </div>
                  <QualityScore value={reviewProduct.qualityScore} size="lg" showLabel />
                </div>
                <div className="mt-6 flex justify-end border-t border-border pt-4">
                  <Button asChild>
                    <Link href={`/products/${reviewProduct.id}`}>Review product <ArrowRightIcon size={16} aria-hidden="true" /></Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Import a CSV to begin reviewing catalog quality.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-[18px]">
          <Card className="gap-0 py-0 shadow-none">
            <CardHeader className="border-b border-border px-[22px] py-5">
              <CardTitle className="text-sm">Quality overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-[22px]">
              {[
                ["Healthy", data.qualityOverview.healthy, "#52654a"],
                ["Watch", data.qualityOverview.watch, "#a76a17"],
                ["Critical", data.qualityOverview.critical, "#a84c43"],
              ].map(([label, rawValue, color]) => {
                const value = Number(rawValue);
                return (
                  <div key={String(label)}>
                    <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>{label}</span><span className="font-mono">{value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full" style={{ width: `${(value / qualityTotal) * 100}%`, backgroundColor: String(color) }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="gap-0 py-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border px-[22px] py-5">
              <CardTitle className="text-sm">Recent imports</CardTitle>
              <Button variant="ghost" size="sm" asChild><Link href="/imports">View all</Link></Button>
            </CardHeader>
            <CardContent className="divide-y divide-border p-[22px] pt-2">
              {data.recentImports.slice(0, 3).map((job) => (
                <div key={job.id} className="flex items-start justify-between gap-4 py-3 text-xs">
                  <div>
                    <p className="font-medium">{job.filename}</p>
                    <p className="mt-1 text-muted-foreground">{job.importedRows} imported · {job.rejectedRows} rejected</p>
                  </div>
                  <time className="whitespace-nowrap text-[0.6875rem] text-muted-foreground">{formatRelativeTime(job.createdAt)}</time>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-[18px] gap-0 py-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border px-[22px] py-5">
          <CardTitle className="text-sm">Recent activity</CardTitle>
          <Button variant="ghost" size="sm" asChild><Link href="/activity">View history</Link></Button>
        </CardHeader>
        <CardContent className="p-[22px]">
          <ActivityTimeline events={data.recentActivity.slice(0, 5)} compact />
        </CardContent>
      </Card>
    </AppShell>
  );
}

