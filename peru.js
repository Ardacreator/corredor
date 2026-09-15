// ============================================================
// PERU COMPLIANCE RULES
// Authorities: SBS (+ UIF-Perú, AML), SUNAT (tax), BCRP (central bank), SMV (securities)
// Framework: Supreme Decree 006-2023-JUS (PSAVs as reporting entities)
//            + SBS Resolution 02648-2024 (PSAV AML/CFT norm)
//            + Law 27693 (creates UIF-Perú) / SD 020-2017-JUS
// ------------------------------------------------------------
// Contrast note: Peru is "registration-only" — no crypto license,
// no capital regime, no market-conduct rulebook. The single ask is
// UIF-Perú registration + an AML program. The Travel Rule (Ch. VIII,
// "Regla de Viaje") took effect 1 Aug 2026, so it is now LIVE.
//   status: 'ok' | 'flag' | 'fail'
// ============================================================

export const meta = {
  code: "PE",
  country: "Peru",
  authorities: "SBS · UIF-Perú · SUNAT · BCRP",
  rulesVersion: "0.1",
  lastReviewed: "2026-09",
  sources: [
    { label: "SBS — Superintendencia de Banca, Seguros y AFP", url: "https://www.sbs.gob.pe" },
    { label: "UIF-Perú — Unidad de Inteligencia Financiera", url: "https://www.sbs.gob.pe/prevencion-de-lavado-activos" },
    { label: "SUNAT — tax authority", url: "https://www.sunat.gob.pe" },
  ],
};

export const rules = [
  // --- KYC / Customer Due Diligence (PSAV AML program) ---
  (t) => {
    if (t.kyc === "full")
      return { status: "ok", title: "Customer due diligence complete",
        basis: "SBS Res.02648-2024 — PSAV must identify/verify customers before onboarding" };
    if (t.kyc === "partial")
      return { status: "flag", title: "KYC partial — enhanced due diligence needed",
        basis: "SBS Res.02648-2024 — EDD required for higher-risk customers" };
    return { status: "fail", title: "Recipient not verified",
      basis: "SD 006-2023-JUS / Law 27693 — identification required for PSAV operations" };
  },

  // --- UIF-Perú registration (the one required status) ---
  (t) => {
    if (t.rail === "stablecoin")
      return { status: "flag", title: "Crypto rail — PSAV must be UIF-Perú registered",
        basis: "SBS Res.02648-2024 — VASPs (PSAV) must register with UIF-Perú + run an AML program" };
    return { status: "ok", title: "Bank rail — regulated financial channel",
      basis: "SBS supervises the financial system; bank channel already in scope" };
  },

  // --- Travel Rule (Chapter VIII — LIVE since 1 Aug 2026) ---
  (t) => {
    if (t.rail === "stablecoin")
      return { status: "flag", title: "Travel Rule now in force — originator/beneficiary data required",
        basis: "SBS Res.02648-2024 Ch.VIII (Regla de Viaje) — effective 1 Aug 2026 for crypto transfers" };
    return { status: "ok", title: "Travel Rule data attached (bank channel)",
      basis: "originator + beneficiary information must travel with the transfer" };
  },

  // --- Beneficial owner (UBO) ---
  (t) => {
    if (t.purpose !== "supplier") return null;
    if (t.ubo === "yes")
      return { status: "ok", title: "Beneficial owner identified",
        basis: "UIF-Perú AML program — beneficial-ownership identification for entities" };
    return { status: "fail", title: "Beneficial owner not identified",
      basis: "UIF-Perú — UBO identification required for entity customers" };
  },

  // --- Suspicious operation reporting to UIF-Perú ---
  (t) => ({ status: "ok", title: "SAR / ROS channel to UIF-Perú",
    basis: "Law 27693 — report suspicious operations (ROS) to UIF-Perú via the compliance officer" }),

  // --- SUNAT tax reporting ---
  (t) => {
    if (t.taxid === "yes")
      return { status: "ok", title: "Tax ID (RUC) on file",
        basis: "SUNAT — traceability; crypto gains signalled for taxation" };
    return { status: "flag", title: "No RUC tax ID",
      basis: "SUNAT — recommended for traceability & tax reporting" };
  },

  // --- BCRP note: crypto is not legal tender ---
  (t) => ({ status: "ok", title: "BCRP — crypto is not legal tender (PEN only)",
    basis: "BCRP — only the sol is legal tender; crypto treated as a private asset" }),
];
