"use client";

import { ArrowLeftIcon, CheckIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { ActivityTimeline } from "@/components/activity-timeline";
import { AppShell } from "@/components/app-shell";
import { ErrorState, LoadingState } from "@/components/data-state";
import { QualityScore } from "@/components/quality-score";
import { StatusBadge } from "@/components/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductComparison } from "@/features/enrichment/product-comparison";
import {
  ApiRequestError,
  approveSuggestion,
  generateSuggestion,
  getProduct,
  getProductAudit,
  rejectSuggestion,
} from "@/lib/api";
import { formatRelativeTime } from "@/lib/format";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const product = useSWR(id ? `product:${id}` : null, () => getProduct(id));
  const audit = useSWR(id ? `product-audit:${id}` : null, () => getProductAudit(id));
  const [workingAction, setWorkingAction] = useState<"generate" | "approve" | "reject" | null>(null);

  async function runAction(action: "generate" | "approve" | "reject") {
    if (!product.data) return;
    setWorkingAction(action);
    try {
      if (action === "generate") {
        await generateSuggestion(product.data.id);
        toast.success("Rule-based suggestion created");
      } else if (action === "approve" && product.data.suggestion) {
        await approveSuggestion(product.data.suggestion.id);
        toast.success("Product updated and audit event recorded");
      } else if (action === "reject" && product.data.suggestion) {
        await rejectSuggestion(product.data.suggestion.id);
        toast.success("Suggestion rejected and recorded");
      }
      await Promise.all([product.mutate(), audit.mutate()]);
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "The review action could not be completed.");
    } finally {
      setWorkingAction(null);
    }
  }

  if (product.isLoading || audit.isLoading) {
    return <AppShell title="Product review"><LoadingState /></AppShell>;
  }
  if (product.error || !product.data) {
    return (
      <AppShell title="Product review">
        <ErrorState description="This product could not be loaded." onRetry={() => void product.mutate()} />
      </AppShell>
    );
  }

  const data = product.data;
  const pendingSuggestion = data.suggestion?.status === "PENDING" ? data.suggestion : null;

  return (
    <AppShell title="Product review">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products"><ArrowLeftIcon size={15} aria-hidden="true" /> All products</Link>
        </Button>
        <StatusBadge status={data.status} />
      </div>

      <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Product review</p>
          <h1 className="page-title mt-2">{data.title}</h1>
          <p className="mt-2 font-mono text-xs text-muted-foreground">{data.sku} · Updated {formatRelativeTime(data.updatedAt)}</p>
        </div>
        <QualityScore value={data.qualityScore} size="lg" showLabel />
      </div>

      <div className="grid gap-[18px] xl:grid-cols-[310px_1fr]">
        <div className="grid content-start gap-[18px]">
          <Card className="gap-0 py-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-4">
              <CardTitle className="text-sm">Quality problems</CardTitle>
              <span className="rounded-full bg-[#f6ead3] px-2.5 py-1 text-[0.6875rem] font-medium text-[#7a4c12]">{data.problems.length} open</span>
            </CardHeader>
            <CardContent className="space-y-2.5 p-5">
              {data.problems.length ? data.problems.map((problem) => (
                <div key={problem} className="rounded-lg bg-[#f6ead3] p-3 text-[0.6875rem] leading-5 text-[#6f4a18]">
                  <strong className="block font-semibold">{problem}</strong>
                  This field reduces the current catalog quality score.
                </div>
              )) : <p className="text-xs text-muted-foreground">No quality problems remain.</p>}
            </CardContent>
          </Card>

          <Card className="gap-0 py-0 shadow-none">
            <CardHeader className="border-b border-border px-5 py-4"><CardTitle className="text-sm">Audit history</CardTitle></CardHeader>
            <CardContent className="p-5">
              {audit.data?.length ? <ActivityTimeline events={audit.data.slice(0, 5)} compact /> : <p className="text-xs text-muted-foreground">No product activity yet.</p>}
            </CardContent>
          </Card>
        </div>

        <Card className="gap-0 py-0 shadow-none">
          <CardHeader className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Suggestion {pendingSuggestion?.id.slice(0, 8) ?? "not generated"}</p>
              <CardTitle className="mt-2 text-xl">Review proposed improvements</CardTitle>
            </div>
            {pendingSuggestion && <span className="rounded-full bg-[#e4eadf] px-2.5 py-1 text-[0.6875rem] font-semibold text-[#3e4f39]">{pendingSuggestion.confidenceScore}% confidence</span>}
          </CardHeader>
          <CardContent className="p-5">
            {pendingSuggestion ? (
              <>
                <ProductComparison product={data} suggestion={pendingSuggestion} />
                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={Boolean(workingAction)}><XIcon size={15} aria-hidden="true" /> Reject suggestion</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject this suggestion?</AlertDialogTitle>
                        <AlertDialogDescription>The product stays unchanged. The rejection will be recorded in the audit history.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => void runAction("reject")}>Reject suggestion</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={Boolean(workingAction)}><CheckIcon size={15} aria-hidden="true" /> Approve and update product</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve these product changes?</AlertDialogTitle>
                        <AlertDialogDescription>The suggested values will replace the current fields and an audit event will preserve the before-and-after values.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => void runAction("approve")}>Approve changes</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center px-4 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-[#e4eadf] text-primary"><SparkleIcon size={22} aria-hidden="true" /></span>
                <h2 className="mt-4 text-base font-semibold">Create a transparent improvement suggestion</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">CatalogFlow will apply readable Java rules for title casing, descriptions, categories, and keywords.</p>
                <Button className="mt-5" onClick={() => void runAction("generate")} disabled={Boolean(workingAction)}>
                  {workingAction === "generate" ? "Generating…" : "Generate suggestion"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

