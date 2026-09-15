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
// ============================================================

export const meta = {
  code: "MX",
  country: "Mexico",
  authorities: "CNBV · UIF · SAT",
  rulesVersion: "0.1",
  lastReviewed: "2026-06",
  sources: [
    { label: "SAT — SPPLD AML portal (criteria)", url: "https://sppld.sat.gob.mx" },
    { label: "CNBV — official site", url: "https://www.gob.mx/cnbv" },
    { label: "UIF — Financial Intelligence Unit", url: "https://www.gob.mx/uif" },
  ],
};

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

  // --- UIF reporting threshold (~$750 business payments) ---
  (t) => {
    if (t.purpose !== "remittance" && t.amount > 750)
      return { status: "flag", title: "Above reporting threshold — UIF notice required",
        basis: "Business payments > ~$750 trigger reporting to UIF" };
    return { status: "ok", title: "Below reporting threshold",
      basis: "no UIF notice triggered by amount" };
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
