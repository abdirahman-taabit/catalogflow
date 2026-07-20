"use client";

import { CaretRightIcon, WarningCircleIcon } from "@phosphor-icons/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";

import { EmptyState } from "@/components/data-state";
import { QualityScore } from "@/components/quality-score";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductSummary } from "@/lib/types";

interface ProductTableProps {
  products: ProductSummary[];
  hasSearch: boolean;
}

export function ProductTable({ products, hasSearch }: ProductTableProps) {
  const columns = useMemo<ColumnDef<ProductSummary>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Product",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link href={`/products/${row.original.id}`} className="focus-ring rounded text-[0.8125rem] font-semibold hover:underline">
              {row.original.title}
            </Link>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">{row.original.sku}</p>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) =>
          row.original.category ? (
            <span>{row.original.category}</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[#a84c43]">
              <WarningCircleIcon size={14} aria-hidden="true" /> Missing
            </span>
          ),
      },
      {
        accessorKey: "qualityScore",
        header: "Quality",
        cell: ({ row }) => <QualityScore value={row.original.qualityScore} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "problems",
        header: "Quality problems",
        cell: ({ row }) => (
          <span className={row.original.problems.length ? "text-[#a76a17]" : "text-primary"}>
            {row.original.problems.length ? `${row.original.problems.length} open` : "No issues"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button variant="ghost" size="icon-sm" asChild aria-label={`Open ${row.original.title}`}>
            <Link href={`/products/${row.original.id}`}><CaretRightIcon size={16} aria-hidden="true" /></Link>
          </Button>
        ),
      },
    ],
    [],
  );
  // TanStack Table intentionally exposes mutable table helpers that React Compiler skips.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({ data: products, columns, getCoreRowModel: getCoreRowModel() });

  if (products.length === 0) {
    return (
      <EmptyState
        kind={hasSearch ? "search" : "catalog"}
        title={hasSearch ? "No matching products" : "Your catalog is empty"}
        description={hasSearch ? "Try a different search or clear one of the filters." : "Import a CSV catalog to create your first products."}
        action={<Button asChild><Link href="/imports">Import catalog</Link></Button>}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-[10px] border border-border bg-card md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-[#f2f0ea] hover:bg-[#f2f0ea]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-11 text-[0.625rem] uppercase tracking-[0.08em] text-[#646a62]">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={row.original.qualityScore < 60 ? "bg-[#fffcf6]" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="h-[68px] text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {products.map((product) => (
          <Card key={product.id} className="py-0 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/products/${product.id}`} className="focus-ring rounded text-sm font-semibold hover:underline">
                    {product.title}
                  </Link>
                  <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">{product.sku}</p>
                </div>
                <StatusBadge status={product.status} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div>
                  <p className="text-xs text-muted-foreground">{product.category || "Category missing"}</p>
                  <p className="mt-1 text-[0.6875rem] text-[#a76a17]">{product.problems.length} quality problems</p>
                </div>
                <QualityScore value={product.qualityScore} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
