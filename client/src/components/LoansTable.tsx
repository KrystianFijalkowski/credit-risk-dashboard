import type { Loan } from "../types";
import { groupedPln, percent, SEGMENT_LABEL, STATUS_LABEL } from "../format";

interface LoansTableProps {
  loans: Loan[];
}

export function LoansTable({ loans }: LoansTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Segment</th>
            <th style={{ textAlign: "right" }}>Kwota</th>
            <th style={{ textAlign: "right" }}>Dochód</th>
            <th style={{ textAlign: "right" }}>DTI</th>
            <th style={{ textAlign: "right" }}>Oproc.</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className="mono">{loan.id}</td>
              <td>{SEGMENT_LABEL[loan.segment]}</td>
              <td className="num">{groupedPln(loan.loanAmount)}</td>
              <td className="num">{groupedPln(loan.annualIncome)}</td>
              <td className="num">
                {(loan.loanAmount / loan.annualIncome).toFixed(2).replace(".", ",")}
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
