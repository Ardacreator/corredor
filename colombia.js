// ============================================================
// COLOMBIA COMPLIANCE RULES
// Authorities: UIAF, SFC, Superintendencia de Sociedades, DIAN
// Framework: SARLAFT (financial) / SAGRILAFT (non-financial)
//            + UIAF Resolution 314/2021, SFC Resolution 0555/2019
// ------------------------------------------------------------
// Same structure as mexico.js / brazil.js.
//   status: 'ok' | 'flag' | 'fail'
// NOTE: Colombia crypto sits in a legal "gray area" — banks are
// restricted from servicing crypto firms, making COP conversion hard.
// ------------------------------------------------------------
// v3: the UIAF crypto reporting threshold is a FIXED USD figure, not
// UVT — Resolución 314/2021 sets USD 150 (individual) / USD 450
// (multiple, aggregated monthly). Corrected from the earlier guessed
// ~11 UVT. UVT is not used here (it's a tax unit, unrelated to this rule).
// ============================================================

export const meta = {
  code: "CO",
  country: "Colombia",
  authorities: "UIAF · SFC · DIAN",
  rulesVersion: "0.3",
  lastReviewed: "2026-09",
  sources: [
    { label: "UIAF — financial intelligence unit", url: "https://www.uiaf.gov.co" },
    { label: "SFC — Superintendencia Financiera", url: "https://www.superfinanciera.gov.co" },
    { label: "DIAN — tax authority (RUB/UBO)", url: "https://www.dian.gov.co" },
  ],
};

// UIAF crypto reporting thresholds (Resolución 314/2021), fixed USD.
const UIAF_INDIVIDUAL_USD = 150; // individual virtual-asset transaction
const UIAF_MULTIPLE_USD = 450;   // aggregated multiple transactions / month

export const rules = [
  // --- KYC / Customer Due Diligence (SARLAFT) ---
  (t) => {
    if (t.kyc === "full")
      return { status: "ok", title: "Customer due diligence complete",
        basis: "SFC Resolution 0555/2019 — SARLAFT customer identification" };
    if (t.kyc === "partial")
      return { status: "flag", title: "KYC partial — enhanced due diligence needed",
        basis: "SARLAFT — EDD required for PEPs / high-risk clients" };
    return { status: "fail", title: "Recipient not verified",
      basis: "SARLAFT — identification required before proceeding" };
  },

  // --- Bank-servicing restriction on crypto (gray area) ---
  (t) => {
    if (t.rail === "stablecoin")
      return { status: "flag", title: "Crypto rail — bank off-ramp restricted",
        basis: "Financial institutions restricted from servicing crypto firms — COP conversion bottleneck" };
    return { status: "ok", title: "Bank rail — FX authorization applies",
      basis: "Banco de la República / SFC FX rules" };
  },

  // --- UIAF crypto reporting threshold (USD 150 / 450, Res.314/2021) ---
  (t) => {
    if (t.rail !== "stablecoin") return null;
    if (t.amount >= UIAF_INDIVIDUAL_USD)
      return { status: "flag", title: `Crypto ≥ USD ${UIAF_INDIVIDUAL_USD} — UIAF report required`,
        basis: `UIAF Res.314/2021 — individual virtual-asset transactions ≥ USD ${UIAF_INDIVIDUAL_USD} (or ≥ USD ${UIAF_MULTIPLE_USD} aggregated monthly) reported to UIAF via SIREL` };
    return { status: "ok", title: "Below UIAF crypto reporting threshold",
      basis: `UIAF Res.314/2021 — under USD ${UIAF_INDIVIDUAL_USD} individual (USD ${UIAF_MULTIPLE_USD} multiple)` };
  },

  // --- Beneficial owner (UBO) registration in RUB ---
  (t) => {
    if (t.purpose !== "supplier") return null;
    if (t.ubo === "yes")
      return { status: "ok", title: "Beneficial owner registered (RUB)",
        basis: "DIAN — UBO registration in RUB mandatory since Apr 2024" };
    return { status: "fail", title: "Beneficial owner not registered",
      basis: "DIAN RUB — UBO registration required for entities" };
  },

  // --- Suspicious transaction reporting to UIAF ---
  (t) => ({ status: "ok", title: "Suspicious-transaction reporting channel to UIAF",
    basis: "Law 526/1999 — report suspicious activity to UIAF" }),

  // --- Travel Rule note (Colombia has NOT formally implemented it) ---
  (t) => ({ status: "ok", title: "Travel Rule not formally required (ex-post reporting)",
    basis: "Colombia focuses on ex-post UIAF reporting, not real-time Travel Rule" }),
];

