import { ArrowRightIcon } from "@phosphor-icons/react";

import type { ProductDetail, Suggestion } from "@/lib/types";

interface ProductComparisonProps {
  product: ProductDetail;
  suggestion: Suggestion;
}

const fields = [
  ["Title", "title", "suggestedTitle"],
  ["Description", "description", "suggestedDescription"],
  ["Category", "category", "suggestedCategory"],
  ["Keywords", "keywords", "suggestedKeywords"],
] as const;

export function ProductComparison({ product, suggestion }: ProductComparisonProps) {
  return (
    <div className="space-y-3">
      {fields.map(([label, originalKey, suggestedKey]) => (
        <div key={label} className="grid gap-2 md:grid-cols-[1fr_32px_1fr] md:items-stretch">
          <div className="rounded-[10px] border border-border bg-[#fbfaf6] p-4">
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Original {label}</p>
            <p className="mt-3 whitespace-pre-wrap text-xs leading-5">
              {product[originalKey] || <span className="font-medium text-destructive">Not provided</span>}
            </p>
          </div>
          <ArrowRightIcon className="m-auto rotate-90 text-primary md:rotate-0" size={17} aria-hidden="true" />
          <div className="rounded-[10px] border border-[#c8d2c2] bg-[#f3f6f0] p-4">
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Suggested {label}</p>
            <p className="mt-3 whitespace-pre-wrap text-xs font-medium leading-5">{suggestion[suggestedKey]}</p>
          </div>
        </div>
      ))}
      <div className="border-l-[3px] border-primary bg-[#e4eadf] px-3.5 py-3 text-xs leading-5 text-[#46533f]">
        <strong className="block font-semibold">Why this suggestion was created</strong>
        {suggestion.explanation}
      </div>
    </div>
  );
}

