export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatRelativeTime(value: string): string {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, divisor] of ranges) {
    if (Math.abs(seconds) >= divisor) {
      return formatter.format(Math.round(seconds / divisor), unit);
    }
  }
  return "just now";
}

export function humanize(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

