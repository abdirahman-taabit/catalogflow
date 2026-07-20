import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { CatalogImportForm } from "@/features/imports/catalog-import-form";

export default function ImportsPage() {
  return (
    <AppShell title="Imports">
      <PageHeading
        eyebrow="Catalog import"
        title="Bring in a product catalog."
        description="CatalogFlow validates every row before saving valid products. Invalid rows and duplicate SKUs stay visible and downloadable."
      />
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-muted-foreground" aria-label="Import steps">
        <span className="inline-flex shrink-0 items-center gap-2 font-medium text-foreground"><b className="grid size-7 place-items-center rounded-full bg-primary text-[0.6875rem] text-white">1</b> Upload</span>
        <span className="h-px w-14 shrink-0 bg-border" aria-hidden="true" />
        <span className="inline-flex shrink-0 items-center gap-2"><b className="grid size-7 place-items-center rounded-full bg-secondary text-[0.6875rem]">2</b> Validate</span>
        <span className="h-px w-14 shrink-0 bg-border" aria-hidden="true" />
        <span className="inline-flex shrink-0 items-center gap-2"><b className="grid size-7 place-items-center rounded-full bg-secondary text-[0.6875rem]">3</b> Review</span>
      </div>
      <CatalogImportForm />
    </AppShell>
  );
}

