import {
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <Card className="py-0 shadow-none" aria-label="Loading content">
      <CardContent className="space-y-4 p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-[82%]" />
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  kind?: "catalog" | "search";
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ kind = "catalog", title, description, action }: EmptyStateProps) {
  const Icon = kind === "search" ? MagnifyingGlassIcon : ArchiveBoxIcon;
  return (
    <Card className="py-0 shadow-none">
      <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary">
          <Icon size={23} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-semibold">{title}</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </CardContent>
    </Card>
  );
}

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Backend unavailable", description, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-[#e7c4bf] bg-[#f5dfdc] py-0 shadow-none" role="alert">
      <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <WarningCircleIcon className="shrink-0 text-[#7f332d]" size={26} aria-hidden="true" />
        <div className="flex-1">
          <h2 className="font-semibold text-[#65302b]">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-[#76352f]">{description}</p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="border-[#d7aaa5] bg-white/60">
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
