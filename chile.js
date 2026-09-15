// ============================================================
// CHILE COMPLIANCE RULES
// Authorities: CMF (Fintech Law 21.521), UAF (AML), BCCh, SII
// Framework: Ley 21.521 + NCG 502 + AML Law 19.913 + CMF Circular 2.368 (2026)
//            + UAF Circular 62 + Ley 20.818 (ROE threshold)
// ------------------------------------------------------------
// Contrast note: Chile is LatAm's most STRUCTURED framework —
// clear registration (CMF/RPSF), formal reporting portal (SEIL),
// crypto legal-but-AML-bound. The opposite of Argentina's flux.
//   status: 'ok' | 'flag' | 'fail'
// ------------------------------------------------------------
// v2 (thresholds): Chile's cash-reporting threshold (ROE) is a
// FIXED USD 10,000 — set by Ley 20.818 (2015), which changed it
// from UF 450 to USD 10,000. It is NOT expressed in UTM, so we do
// NOT force a UTM conversion here (doing so would be a wrong rule).
// ROE applies to CASH ("efectivo") only; crypto/bank transfers fall
// under suspicious-operation reporting (ROS), not the ROE threshold.
// ============================================================

export const meta = {
  code: "CL",
  country: "Chile",
  authorities: "CMF · UAF · BCCh · SII",
  rulesVersion: "0.2",
  lastReviewed: "2026-09",
  sources: [
    { label: "CMF — Comisión para el Mercado Financiero", url: "https://www.cmfchile.cl" },
    { label: "UAF — Unidad de Análisis Financiero", url: "https://www.uaf.cl" },
    { label: "BCCh — Banco Central de Chile", url: "https://www.bcentral.cl" },
  ],
};

// UAF thresholds — fixed USD, per Ley 20.818 / UAF Circular 62.
const ROE_CASH_THRESHOLD_USD = 10000; // cash operations report to UAF
const CDD_TRIGGER_USD = 3000;         // occasional-transaction CDD trigger

export const rules = [
  // --- KYC + UBO due diligence (AML Law 19.913) ---
  (t) => {
    if (t.kyc === "full")
      return { status: "ok", title: "KYC + beneficial-owner due diligence complete",
        basis: "AML Law 19.913 / CMF NCG 502 — KYC and UBO required" };
    if (t.kyc === "partial")
      return { status: "flag", title: "KYC partial — complete due diligence",
        basis: "CMF Circular 2.368 (2026) — strengthened CDD & UBO identification" };
    return { status: "fail", title: "Recipient not verified",
      basis: "AML Law 19.913 — identification required" };
  },

  // --- Occasional-transaction CDD trigger (~USD 3,000, Circular 62) ---
  (t) => {
    if (t.amount >= CDD_TRIGGER_USD)
      return { status: "ok", title: "CDD trigger met — customer due diligence applied",
        basis: `UAF Circular 62 — CDD required for occasional transactions ≥ USD ${CDD_TRIGGER_USD.toLocaleString()}` };
    return { status: "ok", title: "Below occasional-transaction CDD trigger",
      basis: `UAF Circular 62 — CDD trigger is USD ${CDD_TRIGGER_USD.toLocaleString()} (ongoing monitoring still applies)` };
  },

  // --- Crypto legal but AML-bound (not a securities issue) ---
  (t) => {
    if (t.rail === "stablecoin")
      return { status: "ok", title: "Crypto permitted as means of exchange (AML-bound)",
        basis: "CMF Memo 20.088 — cryptoassets not securities but subject to AML/CFT" };
    return { status: "ok", title: "Bank rail — CMF/BCCh payment rules",
      basis: "BCCh oversees payment systems; CMF operational compliance" };
  },

  // --- ROE cash-reporting threshold (USD 10,000, cash only) ---
  (t) => {
    // ROE is cash-specific; a stablecoin/bank transfer is not "efectivo".
    if (t.rail !== "cash") {
      if (t.amount > ROE_CASH_THRESHOLD_USD)
        return { status: "ok", title: "Non-cash rail — ROE not triggered (ROS still applies)",
          basis: `Ley 20.818 — ROE covers cash > USD ${ROE_CASH_THRESHOLD_USD.toLocaleString()} only; non-cash flows use suspicious-operation reporting (ROS)` };
      return null; // nothing to say for small non-cash transfers
    }
    if (t.amount > ROE_CASH_THRESHOLD_USD)
      return { status: "flag", title: `Cash over USD ${ROE_CASH_THRESHOLD_USD.toLocaleString()} — UAF ROE required`,
        basis: "Ley 20.818 — cash operations over USD 10,000 trigger an automatic ROE to UAF (no suspicion needed)" };
    return { status: "ok", title: "Cash below ROE threshold",
      basis: `Ley 20.818 — under USD ${ROE_CASH_THRESHOLD_USD.toLocaleString()} cash` };
  },

  // --- UBO for business ---
  (t) => {
    if (t.purpose !== "supplier") return null;
    if (t.ubo === "yes")
      return { status: "ok", title: "Beneficial owner identified",
        basis: "CMF Circular 2.368 — detailed beneficial-ownership requirements" };
    return { status: "fail", title: "Beneficial owner not identified",
      basis: "CMF Circular 2.368 — UBO identification required for entities" };
  },

  // --- Travel Rule (matters for banking relationships) ---
  (t) => ({ status: "ok", title: "Travel Rule data attached",
    basis: "Effective Travel Rule systems expected for banking access & regulator confidence" }),

  // --- UAF suspicious-activity reporting via SEIL ---
  (t) => ({ status: "ok", title: "SAR / ROS channel to UAF (SEIL portal)",
    basis: "UAF — suspicious activity reported via CMF's SEIL online platform (ROS, no amount threshold)" }),

  // --- SII tax reporting ---
  (t) => {
    if (t.taxid === "yes")
      return { status: "ok", title: "Tax ID (RUT) on file",
        basis: "SII — crypto as intangible asset; gains subject to income tax" };
    return { status: "flag", title: "No RUT tax ID",
      basis: "SII — recommended for tax traceability" };
  },
];
