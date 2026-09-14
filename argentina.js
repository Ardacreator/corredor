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
// ============================================================

export const meta = {
  code: "AR",
  country: "Argentina",
  authorities: "CNV · UIF · BCRA · AFIP",
  rulesVersion: "0.1",
  lastReviewed: "2026-08"
};

// ~35,000 UVA monthly ≈ $29,246 VASP registration threshold
const VASP_THRESHOLD_USD = 29246;

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

  // --- VASP registration threshold (~$29,246/month) ---
  (t) => {
    if (t.rail === "stablecoin" && t.amount > VASP_THRESHOLD_USD)
      return { status: "flag", title: "Above VASP registration threshold",
        basis: "CNV Res.1058/2025 — crypto volumes over ~35,000 UVA (~$29k)/mo require VASP registration" };
    return { status: "ok", title: "Below VASP registration threshold",
      basis: "under ~35,000 UVA (~$29k) monthly crypto volume" };
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
