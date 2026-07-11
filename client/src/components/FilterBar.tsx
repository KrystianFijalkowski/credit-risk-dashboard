interface FilterBarProps {
  segment: string;
  year: string;
  onSegment: (value: string) => void;
  onYear: (value: string) => void;
}

const SEGMENTS = [
  { value: "all", label: "Wszystkie" },
  { value: "retail", label: "Detaliczny" },
  { value: "sme", label: "MŚP" },
  { value: "corporate", label: "Korporacyjny" },
];

const YEARS = ["all", "2021", "2022", "2023", "2024", "2025"];

export function FilterBar({ segment, year, onSegment, onYear }: FilterBarProps) {
  return (
    <div className="filters">
      <div className="filter-group">
        <span className="filter-label">Segment</span>
        <div className="chips">
          {SEGMENTS.map((s) => (
            <button
              key={s.value}
              className={`chip ${segment === s.value ? "active" : ""}`}
              onClick={() => onSegment(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">Rok udzielenia</span>
        <div className="chips">
          {YEARS.map((y) => (
            <button
              key={y}
              className={`chip ${year === y ? "active" : ""}`}
              onClick={() => onYear(y)}
            >
              {y === "all" ? "Wszystkie" : y}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
