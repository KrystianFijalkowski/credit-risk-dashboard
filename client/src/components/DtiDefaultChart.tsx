import type { Loan } from "../types";
import { useLang, type Lang } from "../i18n";
import { percent, decimal } from "../format";

interface DtiDefaultChartProps {
  loans: Loan[];
}

// Ordered debt-to-income bands (numeric bounds; labels are built per language).
const BANDS: { min: number; max: number }[] = [
  { min: 0, max: 0.4 },
  { min: 0.4, max: 0.6 },
  { min: 0.6, max: 0.8 },
  { min: 0.8, max: 1.0 },
  { min: 1.0, max: Infinity },
];

function bandLabel(min: number, max: number, lang: Lang): string {
  if (min === 0) return `<${decimal(max, lang, 1)}`;
  if (max === Infinity) return `≥${decimal(min, lang, 1)}`;
  return `${decimal(min, lang, 1)}–${decimal(max, lang, 1)}`;
}

export function DtiDefaultChart({ loans }: DtiDefaultChartProps) {
  const { lang, t } = useLang();

  const rows = BANDS.map((band) => {
    const inBand = loans.filter((l) => {
      const dti = l.loanAmount / l.annualIncome;
      return dti >= band.min && dti < band.max;
    });
    const defaults = inBand.filter((l) => l.status === "default").length;
    const rate = inBand.length ? defaults / inBand.length : 0;
    return { label: bandLabel(band.min, band.max, lang), count: inBand.length, rate };
  });

  const maxRate = Math.max(...rows.map((r) => r.rate), 0.0001);

  return (
    <div className="panel">
      <div className="panel-head">{t.dtiHead}</div>
      <div className="dti-chart">
        {rows.map((r) => (
          <div className="dti-col" key={r.label}>
            <div className="dti-figure">{percent(r.rate, lang)}</div>
            <div className="dti-plot">
              <div
                className="dti-bar"
                style={{ height: `${(r.rate / maxRate) * 100}%` }}
              />
            </div>
            <div className="dti-x">{r.label}</div>
            <div className="dti-n">n={r.count}</div>
          </div>
        ))}
      </div>
      <div className="dti-caption">{t.dtiCaption}</div>
    </div>
  );
}
