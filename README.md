# Credit Risk Dashboard

A full-stack web application for analyzing the credit risk of a loan portfolio.
It shows how banks measure and visualize risk: default rates, exposure, and how
risk differs across customer segments and debt levels.

## Features

- Portfolio of loans stored in a **SQLite** database (income, amount, segment,
  repayment status, ...).
- Core credit-risk metrics: **default rate**, total **exposure**, average
  **debt-to-income**, with a per-segment breakdown.
- Interactive **dashboard** (Polish UI): a risk-appetite gauge, KPI tiles, a
  debt-to-income → default chart, a portfolio-composition donut, and a
  recent-loans table.
- **Filtering** by customer segment and origination year, recomputed across the
  whole view via query parameters and parameterized SQL.

## Tech stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Frontend | React + TypeScript (Vite)      |
| Backend  | Node.js + Express + TypeScript |
| Database | SQLite                         |
| Tooling  | Git, npm                       |

## Author

Krystian Fijałkowski
