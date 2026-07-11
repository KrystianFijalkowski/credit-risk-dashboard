import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { Loan } from "./types";
import { generateSampleLoans } from "./data/sampleLoans";

// Store the database file in server/data/ (ignored by git — it is generated).
const dataDir = path.join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, "portfolio.sqlite");

// Open (or create) the SQLite database file.
const db = new DatabaseSync(dbPath);

// Wait up to 5s for the file lock instead of failing instantly. This avoids
// "database is locked" during fast dev restarts / OneDrive file syncing.
db.exec("PRAGMA busy_timeout = 5000");

// Create the loans table once. "IF NOT EXISTS" makes this safe to run every start.
db.exec(`
  CREATE TABLE IF NOT EXISTS loans (
    id           TEXT PRIMARY KEY,
    borrowerAge  INTEGER NOT NULL,
    annualIncome INTEGER NOT NULL,
    loanAmount   INTEGER NOT NULL,
    interestRate REAL NOT NULL,
    termMonths   INTEGER NOT NULL,
    segment      TEXT NOT NULL,
    status       TEXT NOT NULL,
    issueDate    TEXT NOT NULL
  )
`);

// Seed the table with a sample portfolio the first time the DB is empty.
function seedIfEmpty(): void {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM loans").get() as {
    count: number;
  };
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO loans
      (id, borrowerAge, annualIncome, loanAmount, interestRate, termMonths, segment, status, issueDate)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const loans = generateSampleLoans(500);
  for (const l of loans) {
    insert.run(
      l.id,
      l.borrowerAge,
      l.annualIncome,
      l.loanAmount,
      l.interestRate,
      l.termMonths,
      l.segment,
      l.status,
      l.issueDate
    );
  }
  console.log(`Seeded database with ${loans.length} loans.`);
}

seedIfEmpty();

// Read every loan out of the database.
export function getAllLoans(): Loan[] {
  return db.prepare("SELECT * FROM loans ORDER BY id").all() as Loan[];
}
