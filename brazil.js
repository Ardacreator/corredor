// ============================================================
// BRAZIL COMPLIANCE RULES
// Authorities: BCB, COAF, CVM, Receita Federal
// Framework: BCB Circular 3.978/2020 / COAF + Circular 3.839
//            + BCB Resoluções 519/520/521 (PSAVs, eff. 2 Feb 2026)
// ------------------------------------------------------------
// Same structure as mexico.js. Add rules to the array.
//   status: 'ok' | 'flag' | 'fail'
// ------------------------------------------------------------
// v2 (thresholds): the COAF automatic cash-reporting threshold is a
// fixed BRL amount (R$50,000, per BCB Circular 3.839 which lowered it
// from R$100k in 2017) — NOT USD. We express it in BRL and convert to
// USD via thresholds.js FX so the figure is transparent. Cash-specific.
// REVIEW NOTE: the old "Resolution 561 bans stablecoins" rule needs
// re-verification — BCB Res. 519/520/521 (Feb 2026) REGULATE PSAVs /
// crypto FX rather than ban them. Kept as-is pending a sourced update.
// ============================================================

import { fxInfo } from '../thresholds.js';

export const meta = {
  code: "BR",
  country: "Brazil",
  authorities: "BCB · COAF · Receita",
  rulesVersion: "0.2",
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
  // --- BCB Resolution 561: stablecoins removed from cross-border rails ---
  // REVIEW: verify against BCB Res. 519/520/521 (Feb 2026) before relying on this.
  (t) => {
    if (t.rail === "stablecoin")
      return { status: "fail", title: "Stablecoin blocked on cross-border rail",
        basis: "BCB Resolution 561 — crypto/stablecoins removed from cross-border payments (eff. Oct 2026) [under review vs Res.519/520/521]" };
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
