import { useEffect, useState } from "react";
import type { MetricsResponse, LoansResponse } from "./types";
import { compactPln, percent } from "./format";
import { RiskGauge } from "./components/RiskGauge";
import { SegmentBars } from "./components/SegmentBars";
import { LoansTable } from "./components/LoansTable";

function App() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loans, setLoans] = useState<LoansResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load the portfolio metrics and loans once when the page mounts.
  useEffect(() => {
    Promise.all([
      fetch("/api/metrics").then((r) => r.json()),
      fetch("/api/loans").then((r) => r.json()),
    ])
      .then(([m, l]) => {
        setMetrics(m);
        setLoans(l);
      })
      .catch(() => setError("Could not reach the API. Is the backend running?"));
  }, []);

  if (error) {
    return (
      <div className="state">
        <strong>Something went wrong</strong>
        <span>{error}</span>
      </div>
    );
  }

  if (!metrics || !loans) {
    return (
      <div className="state">
        <div className="spinner" />
        <span>Loading portfolio…</span>
      </div>
    );
  }

  const { overall, bySegment } = metrics;
  const today = new Date().toISOString().slice(0, 10);

  // Scale the default-rate bars to the riskiest segment for a clear comparison.
  const maxSegDefault = Math.max(...bySegment.map((s) => s.defaultRate));
  const defaultRows = bySegment.map((s) => ({
    name: s.segment,
    fraction: s.defaultRate / maxSegDefault,
    figure: percent(s.defaultRate),
  }));

  // Exposure bars show each segment's share of total money at risk.
  const totalExposure = bySegment.reduce((sum, s) => sum + s.totalExposure, 0);
  const exposureRows = bySegment.map((s) => ({
    name: s.segment,
    fraction: s.totalExposure / totalExposure,
    figure: compactPln(s.totalExposure),
  }));

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="eyebrow">Credit Risk Analytics</div>
          <h1>Portfolio Risk Dashboard</h1>
        </div>
        <div className="as-of">
          <span className="live-dot" />
          <span className="mono">as of {today}</span>
        </div>
      </header>

      {/* Signature: default rate vs risk-appetite threshold */}
      <RiskGauge defaultRate={overall.defaultRate} />

      {/* Headline KPIs */}
      <div className="tiles">
        <div className="tile">
          <div className="k-label">Total exposure</div>
          <div className="k-value">{compactPln(overall.totalExposure)}</div>
          <div className="k-sub">money still at risk</div>
        </div>
        <div className="tile">
          <div className="k-label">Avg debt-to-income</div>
          <div className="k-value">
            {overall.averageDebtToIncome.toFixed(2)}
          </div>
          <div className="k-sub">loan ÷ annual income</div>
        </div>
        <div className="tile">
          <div className="k-label">Loans</div>
          <div className="k-value">{overall.totalLoans}</div>
          <div className="k-sub">in the portfolio</div>
        </div>
        <div className="tile">
          <div className="k-label">Defaults</div>
          <div className="k-value" style={{ color: "var(--risk)" }}>
            {overall.defaultCount}
          </div>
          <div className="k-sub">{percent(overall.defaultRate)} of loans</div>
        </div>
      </div>

      {/* Per-segment breakdown */}
      <section className="section">
        <h2 className="section-title">Risk by customer segment</h2>
        <div className="seg-grid">
          <SegmentBars
            head="Default rate"
            rows={defaultRows}
            color="var(--risk)"
          />
          <SegmentBars
            head="Exposure share"
            rows={exposureRows}
            color="var(--accent)"
          />
        </div>
      </section>

      {/* Recent loans */}
      <section className="section">
        <h2 className="section-title">Recent loans</h2>
        <LoansTable loans={loans.loans.slice(0, 12)} />
      </section>
    </div>
  );
}

export default App;
