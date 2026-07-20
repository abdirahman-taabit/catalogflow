import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";

interface StatCardProps {
  label: string;
  value: number;
  note: string;
  tone?: "positive" | "neutral" | "warning";
}

export function StatCard({ label, value, note, tone = "positive" }: StatCardProps) {
  return (
    <Card className="rounded-[10px] py-0 shadow-none">
      <CardContent className="p-[18px]">
        <p className="text-[0.6875rem] font-medium leading-4 text-muted-foreground">{label}</p>
        <p className="mt-3 font-mono text-[1.75rem] font-semibold leading-none tracking-[-0.04em]">
          {formatNumber(value)}
        </p>
        <p
          className={cn(
            "mt-2.5 text-[0.6875rem]",
            tone === "positive" && "text-primary",
            tone === "neutral" && "text-muted-foreground",
            tone === "warning" && "text-[var(--warning)]",
          )}
        >
          {note}
        </p>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";

