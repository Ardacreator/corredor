# Changelog

Log every change here, newest first. Date each entry. This is the record of the
2-year build — small daily progress compounds.

Format: `## YYYY-MM-DD` then bullet points of what changed.

---

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
