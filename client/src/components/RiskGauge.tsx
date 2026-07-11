import { percent } from "../format";

interface RiskGaugeProps {
  defaultRate: number; // 0..1
  threshold?: number; // risk-appetite limit, 0..1
  maxScale?: number; // right edge of the scale, 0..1
}

// The signature element: the portfolio default rate measured against the
// bank's risk-appetite threshold. Over the threshold -> it turns red.
export function RiskGauge({
  defaultRate,
  threshold = 0.15,
  maxScale = 0.4,
}: RiskGaugeProps) {
  const overLimit = defaultRate > threshold;
  const color = overLimit ? "var(--risk)" : "var(--good)";

  const fillWidth = `${Math.min(100, (defaultRate / maxScale) * 100)}%`;
  const thresholdLeft = `${(threshold / maxScale) * 100}%`;

  return (
    <div className="gauge">
      <div>
        <div className="gauge-label">Wskaźnik niespłacalności portfela</div>
        <div className="gauge-value" style={{ color }}>
          {percent(defaultRate)}
        </div>
        <div className="gauge-caption">
          {overLimit ? "Powyżej" : "W granicach"} limitu apetytu na ryzyko (
          {percent(threshold, 0)})
        </div>
      </div>

      <div>
        <div
          className="gauge-track"
          role="meter"
          aria-valuenow={Number((defaultRate * 100).toFixed(1))}
          aria-valuemin={0}
          aria-valuemax={maxScale * 100}
          aria-label="Wskaźnik niespłacalności portfela"
        >
          <div
            className="gauge-fill"
            style={{ width: fillWidth, background: color }}
          />
          <div
            className="gauge-threshold"
            style={{ left: thresholdLeft }}
            data-label={`limit ${percent(threshold, 0)}`}
          />
        </div>
        <div className="gauge-scale">
          <span>0%</span>
          <span>{percent(maxScale, 0)}</span>
        </div>
      </div>
    </div>
  );
}
