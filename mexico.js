// ============================================================
// MEXICO COMPLIANCE RULES
// Authorities: CNBV, UIF, SAT, Banxico, SHCP
// Framework: LFPIORPI (AML Law) + Fintech Law (Ley Fintech)
// ------------------------------------------------------------
// HOW TO EXTEND: add a new rule object to the `rules` array.
// Each rule is a function that receives the transfer `t`
// and returns a result {status, title, basis} — or null to skip.
//   status: 'ok' (pass) | 'flag' (human review) | 'fail' (block)
// Keep each rule small and cite the real regulation in `basis`.
// As domain knowledge deepens over 2 years, refine these.
// ------------------------------------------------------------
// v2 (thresholds): the reporting threshold is no longer a magic
// USD number. LFPIORPI thresholds are expressed in UMA (Unidad de
// Medida y Actualización), re-published yearly by INEGI. We import
// the dated UMA value from thresholds.js and convert explicitly, so
// the number is auditable and updatable. See honesty note on the rule.
// ============================================================

import { unitsToUSD, citeUnit } from '../thresholds.js';

export const meta = {
  code: "MX",
  country: "Mexico",
  authorities: "CNBV · UIF · SAT",
  rulesVersion: "0.2",
  lastReviewed: "2026-09",
  sources: [
    { label: "SAT — SPPLD AML portal (criteria)", url: "https://sppld.sat.gob.mx" },
    { label: "CNBV — official site", url: "https://www.gob.mx/cnbv" },
    { label: "UIF — Financial Intelligence Unit", url: "https://www.gob.mx/uif" },
  ],
};

// Representative UIF/SAT aviso threshold in UMA. NOTE: LFPIORPI
// thresholds are activity-specific (Art. 17 lists many, each with its
// own UMA count); cross-border transfers by financial entities fall
// under the stricter CNBV regime rather than a single flat number.
// 645 UMA (~the old ~$750 heuristic in 2026 pesos) is used here as a
// transparent, sourced stand-in until per-activity thresholds are modelled.
const AVISO_THRESHOLD_UMA = 645;

export const rules = [
  // --- KYC / Customer Due Diligence ---
  (t) => {
    if (t.kyc === "full")
      return { status: "ok", title: "Customer due diligence complete",
        basis: "LFPIORPI Art.18 — client identification required" };
    if (t.kyc === "partial")
      return { status: "flag", title: "KYC partial — enhanced due diligence needed",
        basis: "CNBV — EDD required for incomplete/high-risk profiles" };
    return { status: "fail", title: "Recipient not verified",
      basis: "LFPIORPI Art.18 — cannot proceed without identification" };
  },

  // --- Beneficial owner (UBO) for business payments ---
  (t) => {
    if (t.purpose !== "supplier") return null;
    if (t.ubo === "yes")
      return { status: "ok", title: "Beneficial owner (UBO) identified",
        basis: "2025 LFPIORPI reform — beneficial-controller documents required" };
    return { status: "fail", title: "Beneficial owner not identified",
      basis: "2025 LFPIORPI reform — UBO identification mandatory for entities" };
  },

  // --- UIF reporting threshold (UMA-based, sourced) ---
  (t) => {
    if (t.purpose === "remittance") return null;
    const conv = unitsToUSD("UMA", AVISO_THRESHOLD_UMA);
    const approxUSD = conv.usd != null ? `~$${Math.round(conv.usd).toLocaleString()}` : "the UMA threshold";
    if (conv.usd != null && t.amount > conv.usd)
      return { status: "flag", title: `Above reporting threshold (${approxUSD}) — UIF aviso`,
        basis: `LFPIORPI Art.17 — ${AVISO_THRESHOLD_UMA} UMA. ${conv.detail}` };
    return { status: "ok", title: "Below reporting threshold",
      basis: `LFPIORPI Art.17 — under ${AVISO_THRESHOLD_UMA} UMA (${citeUnit("UMA")})` };
  },

  // --- SAT tax ID (RFC) ---
  (t) => {
    if (t.taxid === "yes")
      return { status: "ok", title: "RFC tax ID on file",
        basis: "SAT — traceability" };
    return { status: "flag", title: "No RFC tax ID",
      basis: "SAT — recommended for traceability & reporting" };
  },

  // --- Record retention (informational obligation) ---
  (t) => ({ status: "ok", title: "10-year record retention will apply",
    basis: "LFPIORPI reform — 10 yrs for ops from 17 Jul 2025 (was 5)" }),
];
