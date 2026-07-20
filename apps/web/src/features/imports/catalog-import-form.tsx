"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircleIcon,
  DownloadSimpleIcon,
  FileCsvIcon,
  UploadSimpleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { API_URL, ApiRequestError, uploadCatalog } from "@/lib/api";
import type { ImportJob } from "@/lib/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Choose a CSV file." })
    .refine((file) => file.name.toLowerCase().endsWith(".csv"), "The selected file must be a CSV.")
    .refine((file) => file.size <= 5 * 1024 * 1024, "CSV files must be 5 MB or smaller."),
});

type FormValues = z.infer<typeof schema>;

export function CatalogImportForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Ready to upload");
  const [result, setResult] = useState<ImportJob | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const selectedFile = useWatch({ control: form.control, name: "file" });

  function chooseFile(file: File | undefined) {
    if (!file) return;
    form.setValue("file", file, { shouldValidate: true, shouldDirty: true });
    setResult(null);
    setServerError(null);
    setProgress(0);
    setStage("Ready to upload");
  }

  async function submit(values: FormValues) {
    setServerError(null);
    setResult(null);
    setProgress(34);
    setStage("Uploading catalog");
    const validationTimer = window.setTimeout(() => {
      setProgress(72);
      setStage("Validating rows and duplicate SKUs");
    }, 350);
    try {
      const importResult = await uploadCatalog(values.file);
      setResult(importResult);
      setProgress(100);
      setStage("Import complete");
      toast.success(`${importResult.importedRows} products imported`);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "The import could not be completed.";
      setServerError(message);
      setProgress(0);
      setStage("Import failed");
      toast.error(message);
    } finally {
      window.clearTimeout(validationTimer);
    }
  }

  return (
    <div className="grid gap-[18px] xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
      <Card className="gap-0 py-0 shadow-none">
        <CardHeader className="border-b border-border px-[22px] py-5">
          <CardTitle className="text-sm">1. Select your catalog</CardTitle>
        </CardHeader>
        <CardContent className="p-[22px]">
          <form onSubmit={form.handleSubmit(submit)}>
            <div
              className={cn(
                "rounded-xl border border-dashed border-[#aeb5aa] bg-[#fbfaf6] px-5 py-11 text-center transition-colors",
                isDragging && "border-primary bg-[#f3f6f0]",
              )}
              onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                chooseFile(event.dataTransfer.files[0]);
              }}
            >
              <span className="mx-auto grid size-11 place-items-center rounded-[10px] bg-[#e4eadf] text-primary">
                <UploadSimpleIcon size={21} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-base font-semibold">Drop your product CSV here</h2>
              <p className="mt-2 text-sm text-muted-foreground">or choose a file from your computer</p>
              <Label htmlFor="catalog-file" className="sr-only">Catalog CSV file</Label>
              <Input
                ref={inputRef}
                id="catalog-file"
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(event) => chooseFile(event.target.files?.[0])}
              />
              <Button type="button" variant="outline" className="mt-5" onClick={() => inputRef.current?.click()}>
                <FileCsvIcon size={17} aria-hidden="true" /> Choose CSV
              </Button>
              {selectedFile && (
                <p className="mt-4 font-mono text-xs font-medium text-primary">{selectedFile.name}</p>
              )}
              {form.formState.errors.file && (
                <p className="mt-3 text-xs font-medium text-destructive" role="alert">{form.formState.errors.file.message}</p>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["CSV · 5 MB maximum", "Headers: sku, title, description, category", "UTF-8 encoding recommended"].map((requirement) => (
                <div key={requirement} className="rounded-lg bg-secondary p-3 text-xs leading-5 text-muted-foreground">{requirement}</div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <a className="focus-ring inline-flex items-center gap-2 rounded text-xs font-medium text-primary hover:underline" href="/catalogflow-sample.csv" download>
                <DownloadSimpleIcon size={15} aria-hidden="true" /> Download sample CSV
              </a>
              <Button type="submit" disabled={form.formState.isSubmitting || !selectedFile}>
                {form.formState.isSubmitting ? "Importing…" : "Validate and import"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 shadow-none">
        <CardHeader className="border-b border-border px-[22px] py-5">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm">2. Validation summary</CardTitle>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.6875rem] font-medium text-muted-foreground">{stage}</span>
          </div>
        </CardHeader>
        <CardContent className="p-[22px]">
          <Progress value={progress} className="h-1.5" aria-label={`Import progress ${progress}%`} />
          {!result && !serverError && (
            <div className="flex min-h-56 flex-col items-center justify-center text-center">
              <FileCsvIcon size={34} className="text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-sm font-semibold">Your validation results will appear here</h3>
              <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">Rows are checked for required values, SKU format, and duplicates before products are saved.</p>
            </div>
          )}
          {serverError && (
            <div className="mt-5 rounded-lg border border-[#e7c4bf] bg-[#f5dfdc] p-4 text-[#76352f]" role="alert">
              <div className="flex gap-3">
                <WarningCircleIcon size={20} className="shrink-0" aria-hidden="true" />
                <div><p className="text-sm font-semibold">Import failed</p><p className="mt-1 text-xs leading-5">{serverError}</p></div>
              </div>
            </div>
          )}
          {result && (
            <div className="mt-5">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircleIcon size={20} weight="fill" aria-hidden="true" />
                <h3 className="text-sm font-semibold">{result.filename} processed</h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Rows scanned", result.totalRows],
                  ["Ready to import", result.importedRows],
                  ["Invalid rows", result.rejectedRows - result.duplicateRows],
                  ["Duplicate SKUs", result.duplicateRows],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-lg bg-secondary p-3">
                    <p className="text-[0.6875rem] text-muted-foreground">{label}</p>
                    <strong className="mt-1.5 block font-mono text-xl">{value}</strong>
                  </div>
                ))}
              </div>
              {result.rejections.length > 0 && (
                <div className="mt-4 rounded-lg border border-[#e8d4ad] bg-[#f6ead3] p-4 text-[#73501c]">
                  <p className="text-xs font-semibold">{result.rejections.length} rows need correction</p>
                  <ul className="mt-2 space-y-1 text-[0.6875rem] leading-5">
                    {result.rejections.slice(0, 4).map((rejection) => (
                      <li key={`${rejection.rowNumber}-${rejection.sku}`}>Row {rejection.rowNumber}: {rejection.reason}</li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="mt-3 border-[#d8bd86] bg-white/50" asChild>
                    <a href={`${API_URL}/api/imports/${result.id}/rejections.csv`} download>
                      <DownloadSimpleIcon size={15} aria-hidden="true" /> Download rejection report
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
