# Changelog

Log every change here, newest first. Date each entry. This is the record of the
2-year build — small daily progress compounds.

Format: `## YYYY-MM-DD` then bullet points of what changed.

---

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
