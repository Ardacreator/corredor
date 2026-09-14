# Corredor — US↔LatAm Cross-Border Compliance Engine

A prototype compliance-screening tool for payments between the US and Latin America.
Three agents review each transfer: a per-country agent applies that country's rulebook,
and a manager agent decides **approve / route-to-human / block**.

This is the working foundation of a 2-year project — built to be extended a little every day.

> **Status:** prototype. Encoded rules are a real but *starter* subset of 2026 regulation.
> Not a finished product and not legal or financial advice.

---

## Project structure

```
corredor/
  index.html         → the app (UI + engine). Open in a browser.
  rules/
    mexico.js        → Mexico rulebook (CNBV/UIF/SAT, LFPIORPI)
    brazil.js        → Brazil rulebook (BCB/COAF, Resolution 561)
  scenarios/
    presets.js       → saved example transfers to test with
  README.md          → this file
  CHANGELOG.md       → log every change here, dated
```

Rules live in their own files so you can improve one country without touching another.

---

## How to extend it (the daily habit)

Pick ONE of these each session and make it a little better:

1. **Add a rule** to a country file (`rules/mexico.js` etc.). Copy an existing rule,
   change the logic and the `basis` citation. Keep it small and cite the real regulation.
2. **Add a country.** Copy `brazil.js` → `colombia.js`, fill in its authorities and rules,
   then register it in `index.html`.
3. **Add a scenario** to `scenarios/presets.js` so you can test a new edge case.
4. **Improve the UI** in `index.html`.
5. **Correct a rule** as you learn the real detail (this is the moat — accuracy).

Every rule returns one of: `ok` (pass) · `flag` (human review) · `fail` (block).

---

## The rule of accuracy

The value of this product is **correct, current, cited** rules. A wrong rule is worse
than no rule. As you learn the domain over 2 years, your job is to make every rule in
here real, sourced, and up to date. That accuracy — not the code — is the moat.

---

## Honest scope

- Rules are hard-coded today. A future version connects to live regulatory monitoring + AI.
- This screens against an encoded subset, not the full law.
- Always verify against primary sources (e.g. Mexico: sppld.sat.gob.mx; Brazil: bcb.gov.br).
