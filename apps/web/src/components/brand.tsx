import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandProps {
  inverted?: boolean;
  compact?: boolean;
}

export function Brand({ inverted = false, compact = false }: BrandProps) {
  return (
    <Link
      href="/"
      className={cn(
        "focus-ring inline-flex items-center gap-2.5 rounded-md font-semibold tracking-[-0.03em]",
        inverted ? "text-white" : "text-foreground",
      )}
      aria-label="CatalogFlow home"
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-7 place-items-center rounded-lg text-[0.625rem] font-extrabold",
          inverted ? "bg-[#dfe8d8] text-[#20231f]" : "bg-primary text-primary-foreground",
        )}
      >
        CF
      </span>
      {!compact && <span>CatalogFlow</span>}
    </Link>
  );
}

