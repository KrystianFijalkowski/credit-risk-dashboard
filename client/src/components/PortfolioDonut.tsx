import type { Loan } from "../types";
import { percent } from "../format";

interface PortfolioDonutProps {
  loans: Loan[];
}

// Loan statuses in a fixed order, each with its reserved status color.
const STATUS = [
  { key: "active", label: "Aktywne", color: "var(--accent)" },
  { key: "paid_off", label: "Spłacone", color: "var(--good)" },
  { key: "default", label: "Default", color: "var(--risk)" },
] as const;

export function PortfolioDonut({ loans }: PortfolioDonutProps) {
  const total = loans.length || 1;

  // Count loans per status and lay them out around the ring.
  // pathLength="100" lets us work in percentages instead of circumferences.
  let cumulative = 0;
  const slices = STATUS.map((s) => {
    const count = loans.filter((l) => l.status === s.key).length;
    const pct = (count / total) * 100;
    const slice = { ...s, count, pct, offset: -cumulative };
    cumulative += pct;
    return slice;
  });

  return (
    <div className="panel">
      <div className="panel-head">Struktura portfela wg statusu</div>
      <div className="donut-wrap">
        <svg viewBox="0 0 160 160" className="donut" role="img"
          aria-label="Struktura portfela wg statusu">
          <g transform="rotate(-90 80 80)">
            <circle cx="80" cy="80" r="60" fill="none" stroke="var(--surface-2)"
              strokeWidth="20" />
            {slices.map((s) => (
              <circle
                key={s.key}
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke={s.color}
                strokeWidth="20"
                pathLength={100}
                strokeDasharray={`${s.pct} ${100 - s.pct}`}
                strokeDashoffset={s.offset}
              />
            ))}
          </g>
          <text x="80" y="77" textAnchor="middle" className="donut-num">
            {loans.length}
          </text>
          <text x="80" y="95" textAnchor="middle" className="donut-lbl">
            kredytów
          </text>
        </svg>

        <ul className="donut-legend">
          {slices.map((s) => (
            <li key={s.key}>
              <span className="dot" style={{ background: s.color }} />
              <span className="lg-label">{s.label}</span>
              <span className="lg-val">
                {s.count} · {percent(s.count / total)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
