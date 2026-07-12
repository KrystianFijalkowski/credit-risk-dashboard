import { useLang, type SegmentKey } from "../i18n";

interface FilterBarProps {
  segment: string;
  year: string;
  onSegment: (value: string) => void;
  onYear: (value: string) => void;
}

const SEGMENT_VALUES: SegmentKey[] = ["retail", "sme", "corporate"];
const YEARS = ["2021", "2022", "2023", "2024", "2025"];

export function FilterBar({ segment, year, onSegment, onYear }: FilterBarProps) {
  const { t } = useLang();

  return (
    <div className="filters">
      <div className="filter-group">
        <span className="filter-label">{t.filterSegment}</span>
        <div className="chips">
          <button
            className={`chip ${segment === "all" ? "active" : ""}`}
            onClick={() => onSegment("all")}
          >
            {t.all}
          </button>
          {SEGMENT_VALUES.map((s) => (
            <button
              key={s}
              className={`chip ${segment === s ? "active" : ""}`}
              onClick={() => onSegment(s)}
            >
              {t.segment[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">{t.filterYear}</span>
        <div className="chips">
          <button
            className={`chip ${year === "all" ? "active" : ""}`}
            onClick={() => onYear("all")}
          >
            {t.all}
          </button>
          {YEARS.map((y) => (
            <button
              key={y}
              className={`chip ${year === y ? "active" : ""}`}
              onClick={() => onYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
