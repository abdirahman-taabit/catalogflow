import { cn } from "@/lib/utils";

interface QualityScoreProps {
  value: number;
  size?: "sm" | "lg";
  showLabel?: boolean;
}

export function QualityScore({ value, size = "sm", showLabel = false }: QualityScoreProps) {
  const color = value < 60 ? "#a84c43" : value < 80 ? "#a76a17" : "#52654a";
  const dimension = size === "lg" ? 76 : 36;
  const inset = size === "lg" ? 8 : 4;
  return (
    <div className="inline-flex items-center gap-2.5">
      <span
        className={cn("grid shrink-0 place-items-center rounded-full", size === "lg" ? "text-base" : "text-[0.6875rem]")}
        style={{
          width: dimension,
          height: dimension,
          padding: inset,
          background: `conic-gradient(${color} ${value}%, #e5e4de ${value}% 100%)`,
        }}
        aria-label={`Quality score ${value} out of 100`}
      >
        <span className="grid size-full place-items-center rounded-full bg-card font-mono font-semibold">
          {value}
        </span>
      </span>
      {showLabel && (
        <span className="text-xs leading-4">
          <strong className="block font-semibold">Quality score</strong>
          <span className="text-muted-foreground">{value < 60 ? "Needs attention" : value < 80 ? "Watch" : "Healthy"}</span>
        </span>
      )}
    </div>
  );
}

