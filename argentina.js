// ============================================================
// ARGENTINA COMPLIANCE RULES
// Authorities: CNV (VASP registry), UIF (AML), BCRA (central bank/FX), AFIP (tax)
// Framework: Law 27.739 (2024) + CNV Res. 1058/2025 + UIF Res. 49/2024
//            + Law 25.246 (AML)
// ------------------------------------------------------------
// Same structure as the other country modules.
//   status: 'ok' | 'flag' | 'fail'
// NOTE: Argentina is the strictest/most complex corridor — VASP
// registration thresholds, mandatory terrorism/PEP list screening,
// and a central bank that bars banks from crypto activity.
// ------------------------------------------------------------
// v2 (thresholds): the VASP registration threshold (~35,000 UVA/mo)
// is now derived from the live-ish BCRA UVA value in thresholds.js
// instead of a frozen USD constant. UVA changes DAILY with inflation,
// so the USD equivalent is a dated snapshot — flagged as such.
// ============================================================

import { unitsToUSD, citeUnit } from '../thresholds.js';

export const meta = {
  code: "AR",
  country: "Argentina",
  authorities: "CNV · UIF · BCRA · AFIP",
  rulesVersion: "0.2",
  lastReviewed: "2026-09",
  sources: [
    { label: "CNV — securities commission (VASP registry)", url: "https://www.argentina.gob.ar/cnv" },
    { label: "UIF — financial intelligence unit", url: "https://www.argentina.gob.ar/uif" },
    { label: "BCRA — central bank", url: "https://www.bcra.gob.ar" },
  ],
};

// VASP registration threshold expressed in its real unit: ~35,000 UVA
// monthly crypto volume (CNV Res.1058/2025). Converted to USD via the
// dated BCRA UVA snapshot in thresholds.js.
const VASP_THRESHOLD_UVA = 35000;
const vaspConv = unitsToUSD("UVA", VASP_THRESHOLD_UVA);
const VASP_THRESHOLD_USD = vaspConv.usd; // may be a dated snapshot

export const rules = [
  // --- KYC / Customer Due Diligence (UIF) ---
  (t) => {
    if (t.kyc === "full")
      return { status: "ok", title: "Customer due diligence complete",
        basis: "UIF Res.49/2024 — customer identification for obligated subjects" };
    if (t.kyc === "partial")
      return { status: "flag", title: "KYC partial — enhanced due diligence needed",
        basis: "UIF — EDD required for higher-risk customers/jurisdictions" };
    return { status: "fail", title: "Recipient not verified",
      basis: "Law 25.246 / UIF Res.49/2024 — identification required" };
  },

  // --- Mandatory RePET (terrorism) + PEP list screening ---
  (t) => ({ status: "flag", title: "Screen against RePET + PEP lists",
    basis: "Post-FATF 2024 — screen local terrorism registry (RePET) and PEP list" }),

  // --- BCRA: banks barred from crypto → off-ramp restricted ---
  (t) => {
    if (t.rail === "stablecoin")
      return { status: "flag", title: "Crypto rail — bank off-ramp barred by BCRA",
        basis: "BCRA prohibits banks from crypto services — settlement via registered VASP only" };
    return { status: "ok", title: "Bank rail — subject to BCRA FX controls",
      basis: "BCRA regulates FX and cross-border settlement" };
  },

  // --- VASP registration threshold (~35,000 UVA/month) ---
  (t) => {
    if (t.rail !== "stablecoin") return null;
    if (VASP_THRESHOLD_USD != null && t.amount > VASP_THRESHOLD_USD)
      return { status: "flag", title: `Above VASP registration threshold (~$${Math.round(VASP_THRESHOLD_USD).toLocaleString()})`,
        basis: `CNV Res.1058/2025 — over ${VASP_THRESHOLD_UVA.toLocaleString()} UVA/mo requires VASP registration. ${vaspConv.detail}` };
    return { status: "ok", title: "Below VASP registration threshold",
      basis: `under ${VASP_THRESHOLD_UVA.toLocaleString()} UVA monthly crypto volume (${citeUnit("UVA")})` };
  },

  // --- Beneficial owner (UBO) ---
  (t) => {
    if (t.purpose !== "supplier") return null;
    if (t.ubo === "yes")
      return { status: "ok", title: "Beneficial owner verified",
        basis: "UIF — beneficial ownership verification required" };
    return { status: "fail", title: "Beneficial owner not verified",
      basis: "UIF — UBO verification mandatory for entities" };
  },

  // --- Suspicious activity reporting window ---
  (t) => ({ status: "ok", title: "SAR channel to UIF (150-day window)",
    basis: "VASPs report suspicious activity to UIF within 150 days" }),

  // --- AFIP tax classification note ---
  (t) => ({ status: "ok", title: "AFIP tax classification applies",
    basis: "AFIP — crypto gains classified as income/capital; reporting applies" }),
];
