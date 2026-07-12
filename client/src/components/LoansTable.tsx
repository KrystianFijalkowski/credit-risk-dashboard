import type { Loan } from "../types";
import { useLang } from "../i18n";
import { grouped, percent, decimal } from "../format";

interface LoansTableProps {
  loans: Loan[];
}

export function LoansTable({ loans }: LoansTableProps) {
  const { lang, t } = useLang();

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t.tblId}</th>
            <th>{t.tblSegment}</th>
            <th style={{ textAlign: "right" }}>{t.tblAmount}</th>
            <th style={{ textAlign: "right" }}>{t.tblIncome}</th>
            <th style={{ textAlign: "right" }}>{t.tblDti}</th>
            <th style={{ textAlign: "right" }}>{t.tblRate}</th>
            <th>{t.tblDate}</th>
            <th>{t.tblStatus}</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className="mono">{loan.id}</td>
              <td>{t.segment[loan.segment]}</td>
              <td className="num">{grouped(loan.loanAmount, lang)}</td>
              <td className="num">{grouped(loan.annualIncome, lang)}</td>
              <td className="num">
                {decimal(loan.loanAmount / loan.annualIncome, lang)}
              </td>
              <td className="num">{percent(loan.interestRate / 100, lang)}</td>
              <td className="mono">{loan.issueDate}</td>
              <td>
                <span className={`pill ${loan.status}`}>
                  {t.status[loan.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
