import express from "express";

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

// Start the server and keep it listening for incoming requests.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
