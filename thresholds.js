// ============================================================
// REGULATORY THRESHOLD UNITS (shared)
// ------------------------------------------------------------
// Why this exists — the moat is "correct, current, cited".
// LatAm AML thresholds are almost never fixed local-currency or
// USD amounts. They are expressed in INFLATION-INDEXED UNITS whose
// currency value is republished (usually yearly) by the state:
//   MX  UMA  — Unidad de Medida y Actualización (INEGI)
//   AR  UVA  — Unidad de Valor Adquisitivo (BCRA)
//   CO  UVT  — Unidad de Valor Tributario (DIAN)
//   PE  UIT  — Unidad Impositiva Tributaria (SUNAT/MEF)
//   CL  UTM  — Unidad Tributaria Mensual (SII)   [monthly]
// A rule that hard-codes "> $750" silently rots the moment the
// unit is republished or the FX rate moves. So instead each unit
// lives here ONCE, dated and sourced, and rules express thresholds
// as a COUNT OF UNITS. Conversion to USD is explicit and auditable.
// ------------------------------------------------------------
// IMPORTANT (honesty): the local-currency values below are the
// published unit values; the USD figures depend on a live FX rate
// this prototype does NOT have. `fxToUSD` is a clearly-labelled
// PLACEHOLDER snapshot so the engine can run — a real deployment
// pulls live FX and re-derives. Every value carries its source +
// asOf date so a reviewer can verify and update it.
// ============================================================

// Indicative FX snapshot (local currency per 1 USD). PLACEHOLDER —
// not live. Update alongside a real FX feed. Dated for audit.
export const fx = {
  asOf: "2026-09",
  note: "Indicative placeholder rates — a real deployment uses a live FX feed.",
  perUSD: { MXN: 18.5, ARS: 1530, COP: 3950, PEN: 3.55, CLP: 950, BRL: 5.4 },
};

// Inflation-indexed units. `value` is in the local currency shown,
// for the period in `asOf`. `basis`/`source` make each auditable.
export const UNITS = {
  UMA: {
    country: "MX", currency: "MXN", value: 117.31, period: "daily", asOf: "2026-02",
    label: "Unidad de Medida y Actualización",
    source: "INEGI — DOF 10 Jan 2026 (eff. 1 Feb 2026)",
    note: "LFPIORPI thresholds expressed in UMA since DOF reform 16 Jul 2025.",
  },
  UVT: {
    country: "CO", currency: "COP", value: 52374, period: "annual", asOf: "2026",
    label: "Unidad de Valor Tributario",
    source: "DIAN — Resolución 000238 of 15 Dec 2025 (eff. 1 Jan 2026, IPC +5.17%)",
    note: "Verified against multiple sources; annual value fixed for calendar 2026.",
  },
  UIT: {
    country: "PE", currency: "PEN", value: 5500, period: "annual", asOf: "2026",
    label: "Unidad Impositiva Tributaria",
    source: "MEF — Decreto Supremo N° 301-2025-EF (El Peruano 17 Dec 2025, eff. 1 Jan 2026)",
    note: "Verified; annual value fixed for calendar 2026 (up from S/5,350).",
  },
  UTM: {
    country: "CL", currency: "CLP", value: 71721, period: "monthly", asOf: "2026-09",
    label: "Unidad Tributaria Mensual",
    source: "SII — official monthly UTM table (Sep 2026)",
    note: "MONTHLY unit: SII republishes every month per IPC — snapshot, re-check monthly.",
  },
  UVA: {
    country: "AR", currency: "ARS", value: 2116.04, period: "daily", asOf: "2026-09-13",
    daily: true,
    label: "Unidad de Valor Adquisitivo",
    source: "BCRA — daily UVA/CER series (value at 13 Sep 2026)",
    note: "DAILY unit: BCRA updates every business day via CER/inflation — this is a dated SNAPSHOT, not a stable annual value. Argentina's high inflation means it drifts fast; treat USD conversions as indicative only.",
  },
};

// Convert a count of an indexed unit to USD, showing the work.
// Returns { usd, exact, detail } — `exact:false` flags that a value
// is missing or FX is placeholder, so callers can hedge wording.
export function unitsToUSD(unitCode, count){
  const u = UNITS[unitCode];
  if(!u || u.value == null)
    return { usd: null, exact: false,
      detail: `${count} ${unitCode} — local value not yet verified in-repo` };
  const rate = fx.perUSD[u.currency];
  if(!rate)
    return { usd: null, exact: false,
      detail: `${count} ${unitCode} — no FX rate for ${u.currency}` };
  const local = count * u.value;
  const usd = local / rate;
  return {
    usd,
    exact: false, // FX is a placeholder snapshot; never claim exactness
    detail: `${count.toLocaleString()} ${unitCode} × ${u.value} ${u.currency} ` +
            `÷ ${rate} ${u.currency}/USD ≈ $${Math.round(usd).toLocaleString()} ` +
            `(${u.source}; FX ${fx.asOf}, placeholder)`,
  };
}

// Human-readable citation line for a unit, for UI / reports.
export function citeUnit(unitCode){
  const u = UNITS[unitCode];
  if(!u) return "";
  const val = u.value != null ? `${u.value} ${u.currency} (${u.period}, ${u.asOf})` : "value pending verification";
  return `${unitCode} — ${u.label}: ${val}. ${u.source}.`;
}
