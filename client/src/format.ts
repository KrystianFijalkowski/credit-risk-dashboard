// Small formatting helpers so numbers read the same everywhere (Polish locale).

// 0.208 -> "20,8%"
export function percent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits).replace(".", ",")}%`;
}

// 138788418 -> "138,8 mln zł" (compact, for headline figures)
export function compactPln(value: number): string {
  if (value >= 1_000_000)
    return `${(value / 1_000_000).toFixed(1).replace(".", ",")} mln zł`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)} tys. zł`;
  return `${value} zł`;
}

// 502467 -> "502 467" (full number with thin separators, for tables)
export function groupedPln(value: number): string {
  return value.toLocaleString("pl-PL");
}

// Polish display labels for the data values coming from the API.
export const SEGMENT_LABEL: Record<string, string> = {
  retail: "detaliczny",
  sme: "MŚP",
  corporate: "korporacyjny",
};

export const STATUS_LABEL: Record<string, string> = {
  active: "aktywny",
  paid_off: "spłacony",
  default: "default",
};
