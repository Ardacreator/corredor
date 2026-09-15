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
// v2 (thresholds): the UIAF crypto reporting threshold is wired to
// the verified 2026 UVT value (DIAN) via thresholds.js. See honesty
// note on the threshold rule about the exact UVT count.
// ============================================================

import { unitsToUSD, citeUnit } from '../thresholds.js';

export const meta = {
  code: "CO",
  country: "Colombia",
  authorities: "UIAF · SFC · DIAN",
  rulesVersion: "0.2",
  lastReviewed: "2026-09",
  sources: [
    { label: "UIAF — financial intelligence unit", url: "https://www.uiaf.gov.co" },
    { label: "SFC — Superintendencia Financiera", url: "https://www.superfinanciera.gov.co" },
    { label: "DIAN — tax authority (RUB/UBO)", url: "https://www.dian.gov.co" },
  ],
};

// UIAF crypto reporting threshold. The widely-cited figure is ~$150 USD;
// expressing it in UVT keeps it inflation-tracked. NOTE: the exact UVT
// count for the UIAF crypto threshold is an INTERIM assumption here
// (~11 UVT ≈ the cited ~$150) pending verification of the precise
// resolution figure — flagged so it can be corrected.
const UIAF_CRYPTO_THRESHOLD_UVT = 11;
const uiafConv = unitsToUSD("UVT", UIAF_CRYPTO_THRESHOLD_UVT);

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

  // --- UIAF crypto reporting threshold (UVT-based) ---
  (t) => {
    if (t.rail !== "stablecoin") return null;
    const thrUSD = uiafConv.usd;
    if (thrUSD != null && t.amount > thrUSD)
      return { status: "flag", title: "Crypto transaction — UIAF report required",
        basis: `UIAF Res.314/2021 — over ~${UIAF_CRYPTO_THRESHOLD_UVT} UVT (interim). ${uiafConv.detail}` };
    return { status: "ok", title: "Below crypto reporting threshold",
      basis: `under ~${UIAF_CRYPTO_THRESHOLD_UVT} UVT (${citeUnit("UVT")})` };
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
