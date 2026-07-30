# Acceptance — V5 E2E / verify-ui (#233)

## Intent

Playwright smoke: start a V5 solo match, build a Formelkomponente, play a direct attack; capture evidence screenshots.

## In scope

- `e2e/v5-e2e-verify-ui.spec.ts`
- Playtest patch `demoV5FormulaReady` (pull cards from deck)
- Fix initiative rebuild preserving `V5_PACK_RULESET`
- Formula hand name via `findFormulaComponentDef`

## Out of scope

- Full match to rematch / win screen
- Visual regression baselines

## Acceptance criteria

1. E2E starts V5 match (`data-v5-formula=true`, FormulaRig visible, no Live-3D)
2. At least one Formelaktion (FORMULA_BUILD) and one Kampfaktion (Direktangriff)
3. Evidence under `.qa/evidence/v5-e2e-verify-ui/`
4. `npm run checks` green; `npx playwright test e2e/v5-e2e-verify-ui.spec.ts` green
5. typed-strict on touched files

## Evidence

- `.qa/evidence/v5-e2e-verify-ui/01-setup-v5.png` … `05-after-direct-attack.png`
