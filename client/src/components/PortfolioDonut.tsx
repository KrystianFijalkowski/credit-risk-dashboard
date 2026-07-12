import type { Loan } from "../types";
import { useLang, type StatusKey } from "../i18n";
import { percent } from "../format";

interface PortfolioDonutProps {
  loans: Loan[];
}

// Loan statuses in a fixed order, each with its reserved status color.
const STATUS: { key: StatusKey; color: string }[] = [
  { key: "active", color: "var(--accent)" },
  { key: "paid_off", color: "var(--good)" },
  { key: "default", color: "var(--risk)" },
];

export function PortfolioDonut({ loans }: PortfolioDonutProps) {
  const { lang, t } = useLang();
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
      <div className="panel-head">{t.donutHead}</div>
      <div className="donut-wrap">
        <svg
          viewBox="0 0 160 160"
          className="donut"
          role="img"
          aria-label={t.donutHead}
        >
          <g transform="rotate(-90 80 80)">
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="var(--surface-2)"
              strokeWidth="20"
            />
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
            {t.donutCenter}
          </text>
        </svg>

        <ul className="donut-legend">
          {slices.map((s) => (
            <li key={s.key}>
              <span className="dot" style={{ background: s.color }} />
              <span className="lg-label">{t.status[s.key]}</span>
              <span className="lg-val">
                {s.count} · {percent(s.count / total, lang)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
