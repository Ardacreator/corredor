// ============================================================
// AUDIT LOG (prototype)
// Records every screening: what was checked, the verdict, when.
// Compliance tools MUST keep this — regulators ask "what did you
// screen, and why did you block it?" (e.g. Mexico requires 10-year
// record retention). This is the evidence trail.
// ------------------------------------------------------------
// Persistence: browser localStorage for now (survives refresh,
// stays on this device). Future: real database / backend so the
// log is durable, tamper-evident, and exportable for auditors.
// Wrapped in try/catch — storage can be unavailable or full.
// ------------------------------------------------------------
// v2: each entry now carries the FULL check list + the transfer
// inputs, so any screening can be reopened in a detail view and
// re-exported as a report. Old v1 entries (summary only) still
// load — the detail view degrades gracefully when checks are absent.
// ============================================================

const KEY = "corredor_audit_v1";

export function loadLog(){
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// append newest-first, cap stored entries to keep prototype light
export function saveEntry(entry){
  try {
    const log = loadLog();
    log.unshift(entry);
    const capped = log.slice(0, 200);
    localStorage.setItem(KEY, JSON.stringify(capped));
    return capped;
  } catch {
    return loadLog();
  }
}

// alias kept for compatibility
export const appendLog = saveEntry;

export function clearLog(){
  try { localStorage.removeItem(KEY); } catch {}
  return [];
}

// look up a single entry by id (for the detail view)
export function getEntry(id){
  return loadLog().find(e => e.id === id) || null;
}

export function makeEntry({
  corridor, country, authorities, amount, rail, purpose,
  kyc, ubo, taxid, sanctions, pep,
  verdict, topReason, checks, mode
}){
  return {
    id: "scr_" + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    ts: new Date().toISOString(),
    corridor, country,
    authorities: authorities || "",
    amount, rail, purpose,
    // full input snapshot — lets the detail view rebuild the exact context
    inputs: {
      kyc: kyc ?? null, ubo: ubo ?? null, taxid: taxid ?? null,
      sanctions: sanctions ?? null, pep: pep ?? null,
    },
    verdict,
    topReason: topReason || "—",
    // full result: every check that ran (sanctions/PEP + country), in order
    checks: Array.isArray(checks)
      ? checks.map(c => ({ status: c.status, title: c.title, basis: c.basis }))
      : [],
    // 'single' | 'compare' — lets us mark/label compare-run rows later
    mode: mode || "single",
  };
}
