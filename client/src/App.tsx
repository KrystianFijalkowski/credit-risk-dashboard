import { useEffect, useState } from "react";
import type { MetricsResponse, LoansResponse } from "./types";
import { useLang } from "./i18n";
import { compactMoney, percent, decimal, locale } from "./format";
import { FilterBar } from "./components/FilterBar";
import { RiskGauge } from "./components/RiskGauge";
import { SegmentBars } from "./components/SegmentBars";
import { PortfolioDonut } from "./components/PortfolioDonut";
import { DtiDefaultChart } from "./components/DtiDefaultChart";
import { LoansTable } from "./components/LoansTable";

function App() {
  const { lang, setLang, t } = useLang();

  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loans, setLoans] = useState<LoansResponse | null>(null);
  const [hasError, setHasError] = useState(false);

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
      .catch(() => setHasError(true));
  }, [segment, year]);

  // Small PL/EN switch shown in the header.
  const langToggle = (
    <div className="lang-toggle">
      <button
        className={lang === "pl" ? "active" : ""}
        onClick={() => setLang("pl")}
      >
        PL
      </button>
      <button
        className={lang === "en" ? "active" : ""}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );

  if (hasError) {
    return (
      <div className="state">
        <strong>{t.errorTitle}</strong>
        <span>{t.errorMsg}</span>
      </div>
    );
  }

  if (!metrics || !loans) {
    return (
      <div className="state">
        <div className="spinner" />
        <span>{t.loading}</span>
      </div>
    );
  }

  const { overall, bySegment } = metrics;
  const today = new Date().toLocaleDateString(locale(lang));

  // Scale the default-rate bars to the riskiest segment (guarded against 0).
  const maxSegDefault = Math.max(...bySegment.map((s) => s.defaultRate), 0.0001);
  const defaultRows = bySegment.map((s) => ({
    name: t.segment[s.segment],
    fraction: s.defaultRate / maxSegDefault,
    figure: percent(s.defaultRate, lang),
  }));

  // Exposure bars show each segment's share of total money at risk.
  const totalExposure =
    bySegment.reduce((sum, s) => sum + s.totalExposure, 0) || 1;
  const exposureRows = bySegment.map((s) => ({
    name: t.segment[s.segment],
    fraction: s.totalExposure / totalExposure,
    figure: compactMoney(s.totalExposure, lang),
  }));

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.title}</h1>
        </div>
        <div className="header-right">
          {langToggle}
          <div className="as-of">
            <span className="live-dot" />
            <span className="mono">
              {t.asOf} {today}
            </span>
          </div>
        </div>
      </header>

      <FilterBar
        segment={segment}
        year={year}
        onSegment={setSegment}
        onYear={setYear}
      />

      {overall.totalLoans === 0 ? (
        <div className="panel">{t.emptyFilters}</div>
      ) : (
        <>
          {/* Signature: default rate vs risk-appetite threshold */}
          <RiskGauge defaultRate={overall.defaultRate} />

          {/* Headline KPIs */}
          <div className="tiles">
            <div className="tile">
              <div className="k-label">{t.tileExposure}</div>
              <div className="k-value">
                {compactMoney(overall.totalExposure, lang)}
              </div>
              <div className="k-sub">{t.tileExposureSub}</div>
            </div>
            <div className="tile">
              <div className="k-label">{t.tileDti}</div>
              <div className="k-value">
                {decimal(overall.averageDebtToIncome, lang)}
              </div>
              <div className="k-sub">{t.tileDtiSub}</div>
            </div>
            <div className="tile">
              <div className="k-label">{t.tileLoans}</div>
              <div className="k-value">{overall.totalLoans}</div>
              <div className="k-sub">{t.tileLoansSub}</div>
            </div>
            <div className="tile">
              <div className="k-label">{t.tileDefaults}</div>
              <div className="k-value" style={{ color: "var(--risk)" }}>
                {overall.defaultCount}
              </div>
              <div className="k-sub">
                {percent(overall.defaultRate, lang)} {t.ofLoans}
              </div>
            </div>
          </div>

          {/* Portfolio composition */}
          <section className="section">
            <h2 className="section-title">{t.secComposition}</h2>
            <PortfolioDonut loans={loans.loans} />
          </section>

          {/* Per-segment breakdown */}
          <section className="section">
            <h2 className="section-title">{t.secBySegment}</h2>
            <div className="seg-grid">
              <SegmentBars
                head={t.headDefaultRate}
                rows={defaultRows}
                color="var(--risk)"
              />
              <SegmentBars
                head={t.headExposureShare}
                rows={exposureRows}
                color="var(--accent)"
              />
            </div>
          </section>

          {/* DTI -> default relationship */}
          <section className="section">
            <h2 className="section-title">{t.secByDti}</h2>
            <DtiDefaultChart loans={loans.loans} />
          </section>

          {/* Recent loans */}
          <section className="section">
            <h2 className="section-title">{t.secRecent}</h2>
            <LoansTable loans={[...loans.loans].reverse().slice(0, 12)} />
          </section>
        </>
      )}
    </div>
  );
}

export default App;
