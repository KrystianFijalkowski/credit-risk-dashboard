import { Loan, CustomerSegment } from "./types";

// The shape of the risk metrics we compute for a set of loans.
export interface RiskMetrics {
  totalLoans: number;
  defaultCount: number;
  defaultRate: number; // share of loans in default, 0..1
  totalExposure: number; // money still at risk (active + default loans), in PLN
  averageDebtToIncome: number; // mean of loanAmount / annualIncome
}

// Same metrics, but computed for one customer segment.
export interface SegmentMetrics extends RiskMetrics {
  segment: CustomerSegment;
}

// --- Core calculations (pure functions: input loans -> output numbers) ---

// A loan still carries exposure unless it has been fully paid off.
function isOutstanding(loan: Loan): boolean {
  return loan.status !== "paid_off";
}

// Compute the headline risk metrics for any list of loans.
export function computeRiskMetrics(loans: Loan[]): RiskMetrics {
  const totalLoans = loans.length;

  // Guard against dividing by zero on an empty portfolio.
  if (totalLoans === 0) {
    return {
      totalLoans: 0,
      defaultCount: 0,
      defaultRate: 0,
      totalExposure: 0,
      averageDebtToIncome: 0,
    };
  }

  const defaultCount = loans.filter((l) => l.status === "default").length;

  const totalExposure = loans
    .filter(isOutstanding)
    .reduce((sum, l) => sum + l.loanAmount, 0);

  const sumDebtToIncome = loans.reduce(
    (sum, l) => sum + l.loanAmount / l.annualIncome,
    0
  );

  return {
    totalLoans,
    defaultCount,
    defaultRate: defaultCount / totalLoans,
    totalExposure,
    averageDebtToIncome: sumDebtToIncome / totalLoans,
  };
}

// Break the same metrics down per customer segment.
export function computeMetricsBySegment(loans: Loan[]): SegmentMetrics[] {
  const segments: CustomerSegment[] = ["retail", "sme", "corporate"];

  return segments.map((segment) => {
    const loansInSegment = loans.filter((l) => l.segment === segment);
    return { segment, ...computeRiskMetrics(loansInSegment) };
  });
}
