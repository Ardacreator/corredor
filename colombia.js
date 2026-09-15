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
// ============================================================

export const meta = {
  code: "CO",
  country: "Colombia",
  authorities: "UIAF · SFC · DIAN",
  rulesVersion: "0.1",
  lastReviewed: "2026-07",
  sources: [
    { label: "UIAF — financial intelligence unit", url: "https://www.uiaf.gov.co" },
    { label: "SFC — Superintendencia Financiera", url: "https://www.superfinanciera.gov.co" },
    { label: "DIAN — tax authority (RUB/UBO)", url: "https://www.dian.gov.co" },
  ],
};

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

  // --- UIAF crypto reporting threshold (~$150) ---
  (t) => {
    if (t.rail === "stablecoin" && t.amount > 150)
      return { status: "flag", title: "Crypto transaction — UIAF report required",
        basis: "UIAF Res.314/2021 — crypto transactions over ~$150 reported to UIAF" };
    return { status: "ok", title: "Below crypto reporting threshold",
      basis: "no UIAF crypto report triggered by amount" };
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
