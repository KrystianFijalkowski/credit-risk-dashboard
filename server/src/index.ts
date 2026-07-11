import express from "express";
import { sampleLoans } from "./data/sampleLoans";
import { computeRiskMetrics, computeMetricsBySegment } from "./metrics";

// Create the Express application — this object *is* our server.
const app = express();

// Middleware: let the server understand JSON request bodies.
app.use(express.json());

// The port the server listens on (like the number of a pickup window).
const PORT = 4000;

// Our first API endpoint: a simple "health check".
// A GET request to /api/health returns a small JSON response,
// which lets us confirm the server is alive and responding.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "credit-risk-dashboard-api" });
});

// Return the whole loan portfolio.
app.get("/api/loans", (req, res) => {
  res.json({ count: sampleLoans.length, loans: sampleLoans });
});

// Return credit-risk metrics for the portfolio (overall + per segment).
app.get("/api/metrics", (req, res) => {
  res.json({
    overall: computeRiskMetrics(sampleLoans),
    bySegment: computeMetricsBySegment(sampleLoans),
  });
});

// Start the server and keep it listening for incoming requests.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
