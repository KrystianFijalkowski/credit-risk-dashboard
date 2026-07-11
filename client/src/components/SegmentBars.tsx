export interface BarRow {
  name: string;
  fraction: number; // 0..1 — how full the bar is
  figure: string; // the value shown on the right
}

interface SegmentBarsProps {
  head: string;
  rows: BarRow[];
  color: string;
}

// A small horizontal bar list. Comparing one measure across segments is a
// magnitude comparison, so all bars share a single hue (dataviz rule).
export function SegmentBars({ head, rows, color }: SegmentBarsProps) {
  return (
    <div className="panel">
      <div className="panel-head">{head}</div>
      {rows.map((row) => (
        <div className="seg-row" key={row.name}>
          <span className="seg-name">{row.name}</span>
          <div className="seg-track">
            <div
              className="seg-fill"
              style={{
                width: `${Math.min(100, row.fraction * 100)}%`,
                background: color,
              }}
            />
          </div>
          <span className="seg-figure">{row.figure}</span>
        </div>
      ))}
    </div>
  );
}
