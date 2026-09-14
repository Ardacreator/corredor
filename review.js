// ============================================================
// HUMAN-IN-THE-LOOP REVIEW QUEUE (prototype)
// Regulators do NOT accept fully autonomous compliance decisions.
// When a screening is flagged (verdict 'review'), it must land in
// a queue where a human analyst approves or rejects it. This module
// holds that queue.
// ------------------------------------------------------------
// Persistence: localStorage for now. Future: real backend with
// user roles (analyst / supervisor), assignment, and an immutable
// decision trail tied to the audit log.
// ============================================================

const KEY = "corredor_review_v1";

export function loadQueue(){
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(q){
  try { localStorage.setItem(KEY, JSON.stringify(q.slice(0,200))); } catch {}
  return q;
}

// add a flagged screening to the queue
export function enqueue(item){
  const q = loadQueue();
  q.unshift(item);
  return save(q);
}

// analyst decision: 'approved' | 'rejected'
export function decide(id, decision, note){
  const q = loadQueue().map(it =>
    it.id === id
      ? { ...it, status: decision, decidedAt: new Date().toISOString(), note: note || "" }
      : it
  );
  return save(q);
}

export function clearQueue(){
  try { localStorage.removeItem(KEY); } catch {}
  return [];
}

export function makeReviewItem({ country, amount, rail, purpose, flags }){
  return {
    id: "rev_" + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    ts: new Date().toISOString(),
    country, amount, rail, purpose,
    flags: flags || [],            // the flagged rule titles + basis
    status: "pending",             // pending | approved | rejected
    decidedAt: null,
    note: "",
  };
}
