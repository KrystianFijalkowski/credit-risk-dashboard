import type { Lang } from "./i18n";

// Locale string for the built-in Intl formatters.
export function locale(lang: Lang): string {
  return lang === "pl" ? "pl-PL" : "en-US";
}

// 0.208 -> "20,8%" (pl) / "20.8%" (en)
export function percent(value: number, lang: Lang, digits = 1): string {
  const s = (value * 100).toFixed(digits);
  return `${lang === "pl" ? s.replace(".", ",") : s}%`;
}

// 1.23 -> "1,23" (pl) / "1.23" (en)
export function decimal(value: number, lang: Lang, digits = 2): string {
  const s = value.toFixed(digits);
  return lang === "pl" ? s.replace(".", ",") : s;
}

// 138788418 -> "138,8 mln zł" (pl) / "138.8M PLN" (en)
export function compactMoney(value: number, lang: Lang): string {
  if (lang === "pl") {
    if (value >= 1_000_000)
      return `${(value / 1_000_000).toFixed(1).replace(".", ",")} mln zł`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)} tys. zł`;
    return `${value} zł`;
  }
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M PLN`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K PLN`;
  return `${value} PLN`;
}

// 502467 -> "502 467" with locale-aware grouping.
export function grouped(value: number, lang: Lang): string {
  return value.toLocaleString(locale(lang));
}
