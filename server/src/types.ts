// Domain model: the shape of the data our whole app is built around.
// Defining it once here means the compiler checks every other file against it.

// Customer segment — banks group borrowers to compare risk across groups.
export type CustomerSegment = "retail" | "sme" | "corporate";

// The lifecycle status of a loan.
// "default" means the borrower failed to repay — the key event for credit risk.
export type LoanStatus = "active" | "paid_off" | "default";

// A single loan in our portfolio.
export interface Loan {
  id: string;
  borrowerAge: number;
  annualIncome: number; // borrower's yearly income, in PLN
  loanAmount: number; // amount borrowed, in PLN
  interestRate: number; // annual interest rate, in %
  termMonths: number; // loan term, in months
  segment: CustomerSegment;
  status: LoanStatus;
  issueDate: string; // ISO date (YYYY-MM-DD) the loan was granted
}
