import { useEffect, useState } from "react";
import type { MetricsResponse, LoansResponse } from "./types";
import { compactPln, percent, SEGMENT_LABEL } from "./format";
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
      .catch(() =>
        setError("Nie można połączyć się z API. Czy backend działa?")
      );
  }, []);

  if (error) {
    return (
      <div className="state">
        <strong>Coś poszło nie tak</strong>
        <span>{error}</span>
      </div>
    );
  }

  if (!metrics || !loans) {
    return (
      <div className="state">
        <div className="spinner" />
        <span>Wczytywanie portfela…</span>
      </div>
    );
  }

  const { overall, bySegment } = metrics;
  const today = new Date().toLocaleDateString("pl-PL");

  // Scale the default-rate bars to the riskiest segment for a clear comparison.
  const maxSegDefault = Math.max(...bySegment.map((s) => s.defaultRate));
  const defaultRows = bySegment.map((s) => ({
    name: SEGMENT_LABEL[s.segment],
    fraction: s.defaultRate / maxSegDefault,
    figure: percent(s.defaultRate),
  }));

  // Exposure bars show each segment's share of total money at risk.
  const totalExposure = bySegment.reduce((sum, s) => sum + s.totalExposure, 0);
  const exposureRows = bySegment.map((s) => ({
    name: SEGMENT_LABEL[s.segment],
    fraction: s.totalExposure / totalExposure,
    figure: compactPln(s.totalExposure),
  }));

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="eyebrow">Analityka ryzyka kredytowego</div>
          <h1>Panel ryzyka portfela</h1>
        </div>
        <div className="as-of">
          <span className="live-dot" />
          <span className="mono">stan na {today}</span>
        </div>
      </header>

      {/* Signature: default rate vs risk-appetite threshold */}
      <RiskGauge defaultRate={overall.defaultRate} />

      {/* Headline KPIs */}
      <div className="tiles">
        <div className="tile">
          <div className="k-label">Całkowita ekspozycja</div>
          <div className="k-value">{compactPln(overall.totalExposure)}</div>
          <div className="k-sub">kwota wciąż zagrożona</div>
        </div>
        <div className="tile">
          <div className="k-label">Śr. dług do dochodu</div>
          <div className="k-value">
            {overall.averageDebtToIncome.toFixed(2).replace(".", ",")}
          </div>
          <div className="k-sub">kredyt ÷ roczny dochód</div>
        </div>
        <div className="tile">
          <div className="k-label">Kredyty</div>
          <div className="k-value">{overall.totalLoans}</div>
          <div className="k-sub">w portfelu</div>
        </div>
        <div className="tile">
          <div className="k-label">Niespłacone</div>
          <div className="k-value" style={{ color: "var(--risk)" }}>
            {overall.defaultCount}
          </div>
          <div className="k-sub">{percent(overall.defaultRate)} kredytów</div>
        </div>
      </div>

      {/* Per-segment breakdown */}
      <section className="section">
        <h2 className="section-title">Ryzyko wg segmentu klienta</h2>
        <div className="seg-grid">
          <SegmentBars
            head="Wskaźnik niespłacalności"
            rows={defaultRows}
            color="var(--risk)"
          />
          <SegmentBars
            head="Udział w ekspozycji"
            rows={exposureRows}
            color="var(--accent)"
          />
        </div>
      </section>

      {/* Recent loans */}
      <section className="section">
        <h2 className="section-title">Ostatnie kredyty</h2>
        <LoansTable loans={loans.loans.slice(0, 12)} />
      </section>
    </div>
  );
}

export default App;
