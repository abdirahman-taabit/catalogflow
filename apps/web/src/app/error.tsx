"use client";

import { ErrorState } from "@/components/data-state";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <ErrorState description="The page encountered an unexpected error." onRetry={reset} />
    </div>
  );
}

