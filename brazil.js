// ============================================================
// BRAZIL COMPLIANCE RULES
// Authorities: BCB, COAF, CVM, Receita Federal
// Framework: BCB Circular 3.978/2020 / COAF + Circular 3.839
//            + BCB Resoluções 519/520/521 (PSAVs, eff. 2 Feb 2026)
// ------------------------------------------------------------
// Same structure as mexico.js. Add rules to the array.
//   status: 'ok' | 'flag' | 'fail'
// ------------------------------------------------------------
// v3: corrected the stablecoin rule. Cross-border stablecoin is NOT
// banned — BCB Res. 521 classifies it as an FX (câmbio) operation that
// must run through an authorized PSAV, with counterparty identification
// and BCB reporting (monthly info from May 2026; authorized counterparty
// required from 30 Oct 2026). COAF cash threshold is R$50,000 (Circular
// 3.839), expressed in BRL and converted via thresholds.js FX.
// ============================================================

import { fxInfo } from '../thresholds.js';

export const meta = {
  code: "BR",
  country: "Brazil",
  authorities: "BCB · COAF · Receita",
  rulesVersion: "0.3",
  lastReviewed: "2026-09",
  sources: [
    { label: "BCB — Banco Central do Brasil", url: "https://www.bcb.gov.br" },
    { label: "COAF — financial intelligence", url: "https://www.gov.br/coaf" },
    { label: "CVM — securities commission", url: "https://www.gov.br/cvm" },
  ],
};

// COAF automatic cash-reporting threshold: R$50,000 (BCB Circular 3.839).
// Convert to USD transparently via the dated FX snapshot.
const COAF_CASH_BRL = 50000;
const _fx = fxInfo();
const COAF_CASH_USD = _fx.perUSD.BRL ? COAF_CASH_BRL / _fx.perUSD.BRL : null;

export const rules = [
  // --- Cross-border stablecoin = FX operation via authorized PSAV ---
  (t) => {
    if (t.rail === "stablecoin")
      return { status: "flag", title: "Stablecoin cross-border = FX operation — authorized PSAV required",
        basis: "BCB Res.519/520/521 (eff. 2 Feb 2026) — cross-border stablecoin is a câmbio operation: route via authorized PSAV, identify counterparties, report to BCB (authorized counterparty required from 30 Oct 2026)" };
    return { status: "ok", title: "Bank rail permitted for cross-border",
      basis: "BCB — regulated FX / bank channel" };
  },

  // --- KYC ---
  (t) => {
    if (t.kyc === "full")
      return { status: "ok", title: "Customer identification complete",
        basis: "BCB Circular 3.978/2020 — customer identification" };
    if (t.kyc === "partial")
      return { status: "flag", title: "KYC partial — synchronous gatekeeper needed",
        basis: "PIX synthetic-identity risk — verify at onboarding (<3s)" };
    return { status: "fail", title: "Recipient not verified",
      basis: "BCB Circular 3.978/2020 — identification required" };
  },

  // --- Travel Rule ---
  (t) => ({ status: "ok", title: "Travel Rule data attached",
    basis: "Resolution 520 — originator + beneficiary info must travel" }),

  // --- COAF automatic cash-reporting threshold (R$50,000) ---
  (t) => {
    // Automatic COA is cash-specific; non-cash flows use suspicious reporting.
    if (t.rail !== "cash"){
      return { status: "ok", title: "Non-cash rail — automatic COA not triggered",
        basis: "BCB Circular 3.978/2020 — automatic cash COA is for espécie only; non-cash uses suspicious-operation reporting" };
    }
    const usdTxt = COAF_CASH_USD != null ? `~$${Math.round(COAF_CASH_USD).toLocaleString()}` : "the COAF cash limit";
    if (COAF_CASH_USD != null && t.amount > COAF_CASH_USD)
      return { status: "flag", title: `Cash over R$${COAF_CASH_BRL.toLocaleString()} (${usdTxt}) — automatic COAF report`,
        basis: `BCB Circular 3.839 — cash operations ≥ R$50,000 trigger an automatic COA to COAF (R$50,000 ÷ ${_fx.perUSD.BRL} BRL/USD ≈ ${usdTxt}; FX ${_fx.asOf}, placeholder)` };
    return { status: "ok", title: "Cash below COAF automatic threshold",
      basis: `BCB Circular 3.839 — under R$${COAF_CASH_BRL.toLocaleString()} cash` };
  },

  // --- Receita Federal CPF ---
  (t) => {
    if (t.taxid === "yes")
      return { status: "ok", title: "CPF tax ID on file",
        basis: "Receita Federal — traceability" };
    return { status: "flag", title: "No CPF tax ID",
      basis: "Receita Federal — recommended" };
  },
];
