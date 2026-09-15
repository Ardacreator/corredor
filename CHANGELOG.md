# Changelog

Log every change here, newest first. Date each entry. This is the record of the
2-year build — small daily progress compounds.

Format: `## YYYY-MM-DD` then bullet points of what changed.

---

---

---

---

---

---

---

---

## 2026-XX-XX — v0.13 — Chile added (5th corridor)
- New Chile rulebook (chile.js): CMF Fintech Law 21.521, UAF AML, KYC+UBO,
  crypto legal-but-AML-bound, Travel Rule, SEIL reporting portal, SII tax.
- Chile is the STRUCTURED contrast to Argentina's flux — five countries now span the
  full spectrum: MX permits, BR bans, CO gray, AR strict-registered, CL clear-regulated.
- Compare-all now spans 5 corridors.

## 2026-XX-XX — v0.12 — Sanctions & PEP screening
- Added rules/screening.js: a cross-cutting layer that runs on EVERY corridor before
  country rules — sanctions-list match (OFAC SDN/UN/EU), PEP status, adverse media.
- A confirmed sanctions hit is a hard block, no exceptions; possible match / PEP /
  adverse media route to analyst review.
- New form inputs (sanctions screen, PEP status) + two scenarios ("Sanctions hit", "PEP recipient").
- This is the universal core every real compliance system has, on top of local rules.

## 2026-XX-XX — v0.11 — Dashboard summary
- Added a live summary strip above the workspace, computed from the audit log:
  transfers screened, auto-clear rate, flagged for review, blocked, pending analyst,
  and busiest corridor. Updates after every screening.
- Gives the "command center" overview a compliance lead sees first.

## 2026-XX-XX — v0.10 — Primary source links
- Each country's meta now carries official primary sources (regulator sites/portals).
- Single-country results show a "Verify against primary sources" panel with clickable
  links (Mexico SPPLD/CNBV/UIF, Brazil BCB/COAF/CVM, Colombia UIAF/SFC/DIAN, Argentina CNV/UIF/BCRA).
- Reinforces the moat: rules are traceable to real, current authorities — accuracy over guesswork.

## 2026-XX-XX — v0.9 — Visual system (design pass)
- Extracted CSS into styles.css (cleaner structure, HTML/JS untouched).
- New design language for a compliance instrument: ink-navy base on warm paper,
  a single deep-green signal accent, verdict semantics as the only saturated color.
- Serif display type (Iowan/Palatino) for headings + clean sans for UI; tabular
  numerals for money; pill flags; hairline structure over heavy boxes.
- Refined every surface: header, account strip, hero, form, result panel, agents,
  compare view, audit table, review queue, plans. Reduced-motion respected; mobile tuned.
- No functional change — all 70+ components and every JS binding preserved.

## 2026-XX-XX — v0.8 — Compliance report export
- Added report.js: turns a screening into a formal, printable report (Save as PDF).
- "Export compliance report" button on single-country results — includes verdict,
  transfer parameters, every rule with PASS/FLAG/FAIL and its regulatory basis,
  a reference number, and timestamp.
- Future: server-side signed PDFs, tamper-evident hashes, regulator-specific filing formats.

## 2026-XX-XX — v0.7 — Review queue (human-in-the-loop)
- Added review.js: flagged transfers (verdict 'review') enter an analyst queue.
- Review queue section: each pending item shows the flagged rules + basis, with
  Approve / Reject buttons. Decided items show the analyst verdict.
- This is the regulator-required human-in-the-loop step — the system never auto-clears
  a flagged transfer; a person signs off.
- Persists in localStorage for the prototype; future: real roles, assignment, immutable trail.

## 2026-XX-XX — v0.6 — Screening history (audit log)
- Added audit.js: records every screened transfer (time, corridor, amount, rail, verdict, reason).
- Screening-history section: filterable table (all / approved / review / blocked), record count, clear.
- Compare-all mode logs each country's result separately.
- Stored in browser (localStorage) for the prototype; survives refresh on this device.
- Future: immutable, timestamped, exportable audit trail for legal defensibility.

## 2026-XX-XX — v0.5 — Account shell + plans
- Added account.js: account model + plan tiers (Starter/Growth/Scale) as the foundation
  for future subscription, billing, and usage-metering features.
- Account bar (org, plan, usage counter) — counter increments per screened transfer.
- Plans section with placeholder pricing (usage-based intent, corridors gated by tier).
- NOTE: no real auth or payments yet — this defines the SHAPE so Stripe/billing/login
  plug in later, once the core engine and real customers exist.

## 2026-XX-XX — v0.4 — Compare-all mode
- Added "Compare all countries" corridor option: screens one transfer against every
  rulebook at once and shows outcomes side by side.
- Highlights when the SAME payment gets DIFFERENT verdicts across countries — the
  fragmentation thesis made visible in one screen.

## 2026-XX-XX — v0.3 — Argentina added
- New Argentina rulebook (argentina.js): UIF KYC, mandatory RePET+PEP list screening,
  BCRA bank-crypto bar, VASP registration threshold (~$29k/mo), UBO verification,
  150-day SAR window, AFIP tax classification.
- Registered US→Argentina corridor. Added "Large crypto → Argentina" scenario.
- Now 4 corridors. Each country's crypto stance differs — the fragmentation thesis in action:
  MX permits (AML), BR bans (cross-border), CO gray area (bank-restricted), AR strict-registered (VASP+threshold).

## 2026-XX-XX — v0.2 — Colombia added
- New Colombia rulebook (colombia.js): SARLAFT KYC, crypto bank-servicing restriction,
  UIAF ~$150 crypto reporting threshold, DIAN RUB beneficial-owner registration,
  UIAF suspicious-transaction channel, Travel Rule note (not formally required).
- Registered US→Colombia corridor in index.html.
- Added "Crypto payout → Colombia" scenario.
- Now covers 3 corridors: Mexico, Brazil, Colombia — each with different crypto stance
  (MX permits under AML, BR bans from cross-border rails, CO gray area).

## 2026-XX-XX — v0.1 — Foundation
- Project structure created: modular rules per country.
- Mexico rulebook (mexico.js): KYC/CDD, UBO, UIF reporting threshold, RFC, 10-yr retention.
- Brazil rulebook (brazil.js): Resolution 561 stablecoin block, KYC, Travel Rule, COAF threshold, CPF.
- 3-agent model: country agent + manager decision (approve / review / block).
- 4 test scenarios.
- UI: transfer form, scenario chips, agent review panel with cited rules.

<!--
NEXT IDEAS (pick one per session):
- Add Colombia (rules/colombia.js: UIAF, SFC) and register it.
- Add Argentina (rules/argentina.js: UIF, CNV, FX permission).
- Add more Mexico rules: PEP screening, sanctions list check, 24h notice rule.
- Add more Brazil rules: PIX MED fraud-return, asset segregation.
- Add "explain" links to each rule pointing to the primary source.
- Add a running log of screened transfers (needs storage).
- Refine thresholds/amounts against primary sources.
-->
