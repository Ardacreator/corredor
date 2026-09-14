// ============================================================
// BRAZIL COMPLIANCE RULES
// Authorities: BCB, COAF, CVM, Receita Federal
// Framework: BCB Circular 3.978 / COAF Res.36 + Resolution 561
// ------------------------------------------------------------
// Same structure as mexico.js. Add rules to the array.
//   status: 'ok' | 'flag' | 'fail'
// ============================================================

export const meta = {
  code: "BR",
  country: "Brazil",
  authorities: "BCB · COAF · Receita",
  rulesVersion: "0.1",
  lastReviewed: "2026-06"
};

export const rules = [
  // --- BCB Resolution 561: stablecoins removed from cross-border rails ---
  (t) => {
    if (t.rail === "stablecoin")
      return { status: "fail", title: "Stablecoin blocked on cross-border rail",
        basis: "BCB Resolution 561 — crypto/stablecoins removed from cross-border payments (eff. Oct 2026)" };
    return { status: "ok", title: "Bank rail permitted for cross-border",
      basis: "BCB — regulated FX / bank channel" };
  },

  // --- KYC ---
  (t) => {
    if (t.kyc === "full")
      return { status: "ok", title: "Customer identification complete",
        basis: "BCB Circular 3.978 / COAF Res.36" };
    if (t.kyc === "partial")
      return { status: "flag", title: "KYC partial — synchronous gatekeeper needed",
        basis: "PIX synthetic-identity risk — verify at onboarding (<3s)" };
    return { status: "fail", title: "Recipient not verified",
      basis: "COAF Res.36 — identification required" };
  },

  // --- Travel Rule ---
  (t) => ({ status: "ok", title: "Travel Rule data attached",
    basis: "Resolution 520 — originator + beneficiary info must travel" }),

  // --- COAF threshold reporting ---
  (t) => {
    if (t.amount > 10000)
      return { status: "flag", title: "Threshold transaction — COAF report",
        basis: "report to COAF regardless of suspicion" };
    return { status: "ok", title: "Below COAF threshold",
      basis: "no automatic report triggered" };
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
