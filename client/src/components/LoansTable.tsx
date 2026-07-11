import type { Loan } from "../types";
import { groupedPln, percent } from "../format";

interface LoansTableProps {
  loans: Loan[];
}

const STATUS_LABEL: Record<Loan["status"], string> = {
  active: "active",
  paid_off: "paid off",
  default: "default",
};

export function LoansTable({ loans }: LoansTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Segment</th>
            <th style={{ textAlign: "right" }}>Amount</th>
            <th style={{ textAlign: "right" }}>Income</th>
            <th style={{ textAlign: "right" }}>DTI</th>
            <th style={{ textAlign: "right" }}>Rate</th>
            <th>Issued</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className="mono">{loan.id}</td>
              <td style={{ textTransform: "capitalize" }}>{loan.segment}</td>
              <td className="num">{groupedPln(loan.loanAmount)}</td>
              <td className="num">{groupedPln(loan.annualIncome)}</td>
              <td className="num">
                {(loan.loanAmount / loan.annualIncome).toFixed(2)}
              </td>
              <td className="num">{percent(loan.interestRate / 100)}</td>
              <td className="mono">{loan.issueDate}</td>
              <td>
                <span className={`pill ${loan.status}`}>
                  {STATUS_LABEL[loan.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
