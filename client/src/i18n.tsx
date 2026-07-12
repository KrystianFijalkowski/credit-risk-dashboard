import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "pl" | "en";
export type SegmentKey = "retail" | "sme" | "corporate";
export type StatusKey = "active" | "paid_off" | "default";

// Every user-facing string in the app, in both languages.
export interface Dict {
  eyebrow: string;
  title: string;
  asOf: string;

  loading: string;
  errorTitle: string;
  errorMsg: string;
  emptyFilters: string;

  filterSegment: string;
  filterYear: string;
  all: string;

  segment: Record<SegmentKey, string>;
  status: Record<StatusKey, string>;

  gaugeLabel: string;
  gaugeAbove: string;
  gaugeWithin: string;
  gaugeLimit: string; // "…risk-appetite limit"
  gaugeLimitShort: string; // marker "limit"

  tileExposure: string;
  tileExposureSub: string;
  tileDti: string;
  tileDtiSub: string;
  tileLoans: string;
  tileLoansSub: string;
  tileDefaults: string;
  ofLoans: string; // "…of loans"

  secComposition: string;
  secBySegment: string;
  secByDti: string;
  secRecent: string;

  headDefaultRate: string;
  headExposureShare: string;

  donutHead: string;
  donutCenter: string; // "loans" under the donut number

  dtiHead: string;
  dtiCaption: string;

  tblId: string;
  tblSegment: string;
  tblAmount: string;
  tblIncome: string;
  tblDti: string;
  tblRate: string;
  tblDate: string;
  tblStatus: string;
}

export const translations: Record<Lang, Dict> = {
  pl: {
    eyebrow: "Analityka ryzyka kredytowego",
    title: "Panel ryzyka portfela",
    asOf: "stan na",

    loading: "Wczytywanie portfela…",
    errorTitle: "Coś poszło nie tak",
    errorMsg: "Nie można połączyć się z API. Czy backend działa?",
    emptyFilters: "Brak kredytów dla wybranych filtrów.",

    filterSegment: "Segment",
    filterYear: "Rok udzielenia",
    all: "Wszystkie",

    segment: { retail: "detaliczny", sme: "MŚP", corporate: "korporacyjny" },
    status: { active: "aktywny", paid_off: "spłacony", default: "default" },

    gaugeLabel: "Wskaźnik niespłacalności portfela",
    gaugeAbove: "Powyżej",
    gaugeWithin: "W granicach",
    gaugeLimit: "limitu apetytu na ryzyko",
    gaugeLimitShort: "limit",

    tileExposure: "Całkowita ekspozycja",
    tileExposureSub: "kwota wciąż zagrożona",
    tileDti: "Śr. dług do dochodu",
    tileDtiSub: "kredyt ÷ roczny dochód",
    tileLoans: "Kredyty",
    tileLoansSub: "w portfelu",
    tileDefaults: "Niespłacone",
    ofLoans: "kredytów",

    secComposition: "Struktura portfela",
    secBySegment: "Ryzyko wg segmentu klienta",
    secByDti: "Ryzyko wg poziomu zadłużenia",
    secRecent: "Ostatnie kredyty",

    headDefaultRate: "Wskaźnik niespłacalności",
    headExposureShare: "Udział w ekspozycji",

    donutHead: "Struktura portfela wg statusu",
    donutCenter: "kredytów",

    dtiHead: "Wskaźnik niespłacalności wg poziomu zadłużenia (DTI)",
    dtiCaption:
      "Im wyższe zadłużenie względem dochodu (DTI), tym wyższy odsetek defaultów — kluczowa zależność w ocenie ryzyka kredytowego.",

    tblId: "ID",
    tblSegment: "Segment",
    tblAmount: "Kwota",
    tblIncome: "Dochód",
    tblDti: "DTI",
    tblRate: "Oproc.",
    tblDate: "Data",
    tblStatus: "Status",
  },
  en: {
    eyebrow: "Credit Risk Analytics",
    title: "Portfolio Risk Dashboard",
    asOf: "as of",

    loading: "Loading portfolio…",
    errorTitle: "Something went wrong",
    errorMsg: "Could not reach the API. Is the backend running?",
    emptyFilters: "No loans match the selected filters.",

    filterSegment: "Segment",
    filterYear: "Origination year",
    all: "All",

    segment: { retail: "retail", sme: "SME", corporate: "corporate" },
    status: { active: "active", paid_off: "paid off", default: "default" },

    gaugeLabel: "Portfolio default rate",
    gaugeAbove: "Above",
    gaugeWithin: "Within",
    gaugeLimit: "the risk-appetite limit",
    gaugeLimitShort: "limit",

    tileExposure: "Total exposure",
    tileExposureSub: "money still at risk",
    tileDti: "Avg debt-to-income",
    tileDtiSub: "loan ÷ annual income",
    tileLoans: "Loans",
    tileLoansSub: "in the portfolio",
    tileDefaults: "Defaults",
    ofLoans: "of loans",

    secComposition: "Portfolio composition",
    secBySegment: "Risk by customer segment",
    secByDti: "Risk by debt level",
    secRecent: "Recent loans",

    headDefaultRate: "Default rate",
    headExposureShare: "Exposure share",

    donutHead: "Portfolio by status",
    donutCenter: "loans",

    dtiHead: "Default rate by debt-to-income (DTI)",
    dtiCaption:
      "The higher the debt-to-income (DTI), the higher the share of defaults — a core relationship in credit-risk assessment.",

    tblId: "ID",
    tblSegment: "Segment",
    tblAmount: "Amount",
    tblIncome: "Income",
    tblDti: "DTI",
    tblRate: "Rate",
    tblDate: "Date",
    tblStatus: "Status",
  },
};

// --- React context that carries the current language through the app --------

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start from the saved choice (if any), otherwise Polish.
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("lang") as Lang) || "pl"
  );

  // Remember the choice across page reloads.
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

// Hook components use to read the language, change it, and get translations.
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return { lang: ctx.lang, setLang: ctx.setLang, t: translations[ctx.lang] };
}
