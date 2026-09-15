// ============================================================
// CHILE COMPLIANCE RULES
// Authorities: CMF (Fintech Law 21.521), UAF (AML), BCCh, SII
// Framework: Ley 21.521 + NCG 502 + AML Law 19.913 + CMF Circular 2.368 (2026)
// ------------------------------------------------------------
// Contrast note: Chile is LatAm's most STRUCTURED framework —
// clear registration (CMF/RPSF), formal reporting portal (SEIL),
// crypto legal-but-AML-bound. The opposite of Argentina's flux.
//   status: 'ok' | 'flag' | 'fail'
// ============================================================

export const meta = {
  code: "CL",
  country: "Chile",
  authorities: "CMF · UAF · BCCh · SII",
  rulesVersion: "0.1",
  lastReviewed: "2026-09",
  sources: [
    { label: "CMF — Comisión para el Mercado Financiero", url: "https://www.cmfchile.cl" },
    { label: "UAF — Unidad de Análisis Financiero", url: "https://www.uaf.cl" },
    { label: "BCCh — Banco Central de Chile", url: "https://www.bcentral.cl" },
  ],
};

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

  // --- Crypto legal but AML-bound (not a securities issue) ---
  (t) => {
    if (t.rail === "stablecoin")
      return { status: "ok", title: "Crypto permitted as means of exchange (AML-bound)",
        basis: "CMF Memo 20.088 — cryptoassets not securities but subject to AML/CFT" };
    return { status: "ok", title: "Bank rail — CMF/BCCh payment rules",
      basis: "BCCh oversees payment systems; CMF operational compliance" };
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
  (t) => ({ status: "ok", title: "SAR channel to UAF (SEIL portal)",
    basis: "UAF — suspicious activity reported via CMF's SEIL online platform" }),

  // --- SII tax reporting ---
  (t) => {
    if (t.taxid === "yes")
      return { status: "ok", title: "Tax ID (RUT) on file",
        basis: "SII — crypto as intangible asset; gains subject to income tax" };
    return { status: "flag", title: "No RUT tax ID",
      basis: "SII — recommended for tax traceability" };
  },
];
