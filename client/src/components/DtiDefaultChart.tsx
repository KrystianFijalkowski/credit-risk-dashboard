import type { Loan } from "../types";
import { percent } from "../format";

interface DtiDefaultChartProps {
  loans: Loan[];
}

// Ordered debt-to-income bands. Each column's height = its default rate,
// so the chart shows how risk rises as borrowers take on more debt.
const BANDS: { label: string; min: number; max: number }[] = [
  { label: "<0,4", min: 0, max: 0.4 },
  { label: "0,4–0,6", min: 0.4, max: 0.6 },
  { label: "0,6–0,8", min: 0.6, max: 0.8 },
  { label: "0,8–1,0", min: 0.8, max: 1.0 },
  { label: "≥1,0", min: 1.0, max: Infinity },
];

export function DtiDefaultChart({ loans }: DtiDefaultChartProps) {
  const rows = BANDS.map((band) => {
    const inBand = loans.filter((l) => {
      const dti = l.loanAmount / l.annualIncome;
      return dti >= band.min && dti < band.max;
    });
    const defaults = inBand.filter((l) => l.status === "default").length;
    const rate = inBand.length ? defaults / inBand.length : 0;
    return { label: band.label, count: inBand.length, rate };
  });

  // Scale the tallest bar to the plot height for a clear comparison.
  const maxRate = Math.max(...rows.map((r) => r.rate), 0.0001);

  return (
    <div className="panel">
      <div className="panel-head">
        Wskaźnik niespłacalności wg poziomu zadłużenia (DTI)
      </div>
      <div className="dti-chart">
        {rows.map((r) => (
          <div className="dti-col" key={r.label}>
            <div className="dti-figure">{percent(r.rate)}</div>
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
      <div className="dti-caption">
        Im wyższe zadłużenie względem dochodu (DTI), tym wyższy odsetek
        defaultów — kluczowa zależność w ocenie ryzyka kredytowego.
      </div>
    </div>
  );
}
