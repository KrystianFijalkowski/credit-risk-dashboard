import { Loan, CustomerSegment, LoanStatus } from "../types";

// --- Small random helpers (used only to fake a realistic portfolio) ---

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

// Typical yearly income range (PLN) per segment — corporates borrow bigger.
const INCOME_BY_SEGMENT: Record<CustomerSegment, [number, number]> = {
  retail: [40_000, 150_000],
  sme: [150_000, 600_000],
  corporate: [600_000, 3_000_000],
};

// Build one random-but-plausible loan.
function makeLoan(index: number): Loan {
  const segment = pick<CustomerSegment>(["retail", "sme", "corporate"]);

  const [minIncome, maxIncome] = INCOME_BY_SEGMENT[segment];
  const annualIncome = randomInt(minIncome, maxIncome);

  // Loan size is 20%–120% of yearly income.
  const loanAmount = Math.round(annualIncome * (randomInt(20, 120) / 100));

  // Debt-to-income ratio: the higher it is, the riskier the loan.
  const debtToIncome = loanAmount / annualIncome;

  // Probability of default grows with debt-to-income (capped at 60%).
  const defaultProbability = Math.min(0.6, debtToIncome * 0.35);

  // Decide the status.
  let status: LoanStatus;
  if (Math.random() < defaultProbability) {
    status = "default";
  } else {
    // Non-defaulted loans are split between still-active and fully paid off.
    status = Math.random() < 0.5 ? "active" : "paid_off";
  }

  const issueYear = randomInt(2021, 2025);
  const issueMonth = String(randomInt(1, 12)).padStart(2, "0");
  const issueDay = String(randomInt(1, 28)).padStart(2, "0");

  return {
    id: `L-${String(index + 1).padStart(4, "0")}`,
    borrowerAge: randomInt(21, 70),
    annualIncome,
    loanAmount,
    interestRate: randomInt(30, 150) / 10, // 3.0% – 15.0%
    termMonths: pick([12, 24, 36, 48, 60, 72, 84, 120]),
    segment,
    status,
    issueDate: `${issueYear}-${issueMonth}-${issueDay}`,
  };
}

// Generate a whole portfolio of `count` loans.
export function generateSampleLoans(count: number): Loan[] {
  return Array.from({ length: count }, (_, i) => makeLoan(i));
}

// A fixed portfolio, built once when the server starts.
export const sampleLoans: Loan[] = generateSampleLoans(500);
