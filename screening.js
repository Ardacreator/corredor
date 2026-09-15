// ============================================================
// SANCTIONS & PEP SCREENING (cross-cutting layer)
// Applies to EVERY corridor, on top of country rules.
// Real compliance screens each party against:
//   - International sanctions lists (OFAC SDN, UN, EU)
//   - Local terrorism registries (e.g. Argentina RePET)
//   - PEP lists (Politically Exposed Persons)
//   - Adverse media
// ------------------------------------------------------------
// PROTOTYPE: no real list access yet. This models the CHECK and
// its verdict logic. Future: connect to real screening providers
// / official list feeds, with fuzzy name matching + audit trail.
// The transfer object may carry: sanctionsHit, pep, adverseMedia.
// ============================================================

export const meta = {
  name: "Sanctions & PEP screening",
  lists: "OFAC SDN · UN · EU · local terrorism registries · PEP",
};

export const rules = [
  // --- Sanctions list hit = hard block, always ---
  (t) => {
    if (t.sanctions === "hit")
      return { status: "fail", title: "Sanctions list match",
        basis: "OFAC SDN / UN / EU — a confirmed match is a hard block, no exceptions" };
    if (t.sanctions === "possible")
      return { status: "flag", title: "Possible sanctions match — manual review",
        basis: "fuzzy name match requires analyst confirmation before release" };
    return { status: "ok", title: "No sanctions match",
      basis: "screened against OFAC SDN / UN / EU lists" };
  },

  // --- PEP (Politically Exposed Person) ---
  (t) => {
    if (t.pep === "yes")
      return { status: "flag", title: "Politically Exposed Person — enhanced due diligence",
        basis: "PEP status requires EDD, source-of-funds review, senior sign-off" };
    return { status: "ok", title: "Not a PEP",
      basis: "screened against PEP lists" };
  },

  // --- Adverse media ---
  (t) => {
    if (t.adverseMedia === "yes")
      return { status: "flag", title: "Adverse media found — review",
        basis: "negative news screening flagged this party for analyst review" };
    return { status: "ok", title: "No adverse media",
      basis: "negative news screening clear" };
  },
];
