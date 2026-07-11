// Types describing what the backend API returns.
// They mirror the server's types so the whole app is type-checked end to end.

export type CustomerSegment = "retail" | "sme" | "corporate";
export type LoanStatus = "active" | "paid_off" | "default";

export interface Loan {
  id: string;
  borrowerAge: number;
  annualIncome: number;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  segment: CustomerSegment;
  status: LoanStatus;
  issueDate: string;
}

export interface RiskMetrics {
  totalLoans: number;
  defaultCount: number;
  defaultRate: number;
  totalExposure: number;
  averageDebtToIncome: number;
}

export interface SegmentMetrics extends RiskMetrics {
  segment: CustomerSegment;
}

export interface MetricsResponse {
  overall: RiskMetrics;
  bySegment: SegmentMetrics[];
}

export interface LoansResponse {
  count: number;
  loans: Loan[];
}
