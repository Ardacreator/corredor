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

export function makeEntry({ corridor, country, amount, rail, purpose, verdict, topReason }){
  return {
    id: "scr_" + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    ts: new Date().toISOString(),
    corridor, country, amount, rail, purpose, verdict,
    topReason: topReason || "—",
  };
}
