import { useEffect, useState } from "react";
import type { MetricsResponse, LoansResponse } from "./types";
import { compactPln, percent, SEGMENT_LABEL } from "./format";
import { FilterBar } from "./components/FilterBar";
import { RiskGauge } from "./components/RiskGauge";
import { SegmentBars } from "./components/SegmentBars";
import { DtiDefaultChart } from "./components/DtiDefaultChart";
import { LoansTable } from "./components/LoansTable";

function App() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loans, setLoans] = useState<LoansResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter state — drives the query sent to the API.
  const [segment, setSegment] = useState("all");
  const [year, setYear] = useState("all");

  // Refetch whenever a filter changes. Previous data stays on screen until
  // the new data arrives, so the dashboard never flashes empty.
  useEffect(() => {
    const qs = new URLSearchParams();
    if (segment !== "all") qs.set("segment", segment);
    if (year !== "all") qs.set("year", year);
    const suffix = qs.toString() ? `?${qs}` : "";

    Promise.all([
      fetch(`/api/metrics${suffix}`).then((r) => r.json()),
      fetch(`/api/loans${suffix}`).then((r) => r.json()),
    ])
      .then(([m, l]) => {
        setMetrics(m);
        setLoans(l);
      })
      .catch(() =>
        setError("Nie można połączyć się z API. Czy backend działa?")
      );
  }, [segment, year]);

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

  // Scale the default-rate bars to the riskiest segment (guarded against 0).
  const maxSegDefault = Math.max(...bySegment.map((s) => s.defaultRate), 0.0001);
  const defaultRows = bySegment.map((s) => ({
    name: SEGMENT_LABEL[s.segment],
    fraction: s.defaultRate / maxSegDefault,
    figure: percent(s.defaultRate),
  }));

  // Exposure bars show each segment's share of total money at risk.
  const totalExposure =
    bySegment.reduce((sum, s) => sum + s.totalExposure, 0) || 1;
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

      <FilterBar
        segment={segment}
        year={year}
        onSegment={setSegment}
        onYear={setYear}
      />

      {overall.totalLoans === 0 ? (
        <div className="panel">Brak kredytów dla wybranych filtrów.</div>
      ) : (
        <>
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
              <div className="k-sub">
                {percent(overall.defaultRate)} kredytów
              </div>
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

          {/* DTI -> default relationship */}
          <section className="section">
            <h2 className="section-title">Ryzyko wg poziomu zadłużenia</h2>
            <DtiDefaultChart loans={loans.loans} />
          </section>

          {/* Recent loans */}
          <section className="section">
            <h2 className="section-title">Ostatnie kredyty</h2>
            <LoansTable loans={loans.loans.slice(0, 12)} />
          </section>
        </>
      )}
    </div>
  );
}

export default App;
