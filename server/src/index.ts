import express from "express";
import type { Request } from "express";
import { getAllLoans, LoanFilters } from "./db";
import { computeRiskMetrics, computeMetricsBySegment } from "./metrics";

// Create the Express application — this object *is* our server.
const app = express();

// Middleware: let the server understand JSON request bodies.
app.use(express.json());

// The port the server listens on (like the number of a pickup window).
const PORT = 4000;

// Read the optional ?segment= and ?year= filters from the request URL.
// "all" (or missing) means "no filter".
function filtersFromQuery(req: Request): LoanFilters {
  const segment = req.query.segment;
  const year = req.query.year;
  return {
    segment:
      typeof segment === "string" && segment !== "all" ? segment : undefined,
    year: typeof year === "string" && year !== "all" ? year : undefined,
  };
}

// Our first API endpoint: a simple "health check".
// A GET request to /api/health returns a small JSON response,
// which lets us confirm the server is alive and responding.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "credit-risk-dashboard-api" });
});

// Return the loan portfolio (read from the database), optionally filtered.
app.get("/api/loans", (req, res) => {
  const loans = getAllLoans(filtersFromQuery(req));
  res.json({ count: loans.length, loans });
});

// Return credit-risk metrics for the (optionally filtered) portfolio.
app.get("/api/metrics", (req, res) => {
  const loans = getAllLoans(filtersFromQuery(req));
  res.json({
    overall: computeRiskMetrics(loans),
    bySegment: computeMetricsBySegment(loans),
  });
});

// Start the server and keep it listening for incoming requests.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
