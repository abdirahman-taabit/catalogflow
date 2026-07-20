"use client";

import { MagnifyingGlassIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import useSWR from "swr";

import { AppShell } from "@/components/app-shell";
import { ErrorState, LoadingState } from "@/components/data-state";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductTable } from "@/features/products/product-table";
import { getProducts } from "@/lib/api";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("qualityScore:asc");
  const [page, setPage] = useState(0);
  const deferredSearch = useDeferredValue(search);
  const [sortField, direction] = sort.split(":");
  const params = new URLSearchParams({
    page: String(page),
    size: "10",
    search: deferredSearch,
    status,
    category,
    sort: sortField,
    direction,
  });
  const products = useSWR(`products:${params.toString()}`, () => getProducts(`?${params.toString()}`));

  function resetPage() {
    setPage(0);
  }

  return (
    <AppShell title="Products">
      <PageHeading
        eyebrow="Catalog"
        title="Products"
        description="Find incomplete products, compare their quality, and open the next review."
        action={<Button asChild><Link href="/imports"><UploadSimpleIcon size={16} aria-hidden="true" /> Import CSV</Link></Button>}
      />

      <div className="mb-3.5 flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1 xl:max-w-sm">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
          <Input
            value={search}
            onChange={(event) => { setSearch(event.target.value); resetPage(); }}
            className="pl-9"
            placeholder="Search by SKU or title"
            aria-label="Search products"
          />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          <Select value={status} onValueChange={(value) => { setStatus(value); resetPage(); }}>
            <SelectTrigger aria-label="Filter by status"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="NEEDS_REVIEW">Needs review</SelectItem>
              <SelectItem value="SUGGESTION_PENDING">Suggestion pending</SelectItem>
              <SelectItem value="ENRICHED">Enriched</SelectItem>
              <SelectItem value="COMPLETE">Complete</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={(value) => { setCategory(value); resetPage(); }}>
            <SelectTrigger aria-label="Filter by category"><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="Computer accessories">Computer accessories</SelectItem>
              <SelectItem value="Audio">Audio</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Photography">Photography</SelectItem>
              <SelectItem value="Bags">Bags</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(value) => { setSort(value); resetPage(); }}>
            <SelectTrigger aria-label="Sort products"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="qualityScore:asc">Lowest quality</SelectItem>
              <SelectItem value="qualityScore:desc">Highest quality</SelectItem>
              <SelectItem value="title:asc">Title A–Z</SelectItem>
              <SelectItem value="updatedAt:desc">Recently updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {products.isLoading && <LoadingState />}
      {products.error && (
        <ErrorState description="Products could not be loaded from the backend." onRetry={() => void products.mutate()} />
      )}
      {products.data && (
        <>
          <ProductTable products={products.data.items} hasSearch={Boolean(search || status !== "all" || category !== "all")} />
          <div className="mt-3.5 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{products.data.totalItems} products · Page {products.data.page + 1} of {Math.max(products.data.totalPages, 1)}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page + 1 >= products.data.totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

