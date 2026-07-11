// Small formatting helpers so numbers read the same everywhere.

// 0.208 -> "20.8%"
export function percent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

// 138788418 -> "138.8M PLN" (compact, for headline figures)
export function compactPln(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M PLN`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K PLN`;
  return `${value} PLN`;
}

// 502467 -> "502 467" (full number with thin separators, for tables)
export function groupedPln(value: number): string {
  return value.toLocaleString("pl-PL");
}
