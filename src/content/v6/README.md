# V6 authoring content (Slice 1)

Structured authoring tables and schemas for the V6 formula recipe generator.

- **SoT for humans:** edit files here (`formulaAuthoring.slice1.ts`, `cards/`).
- **Runtime catalog:** generated under `src/generated/v6/` — never hand-edit.
- **Current locked catalog:** **198** recipes from Slice-1 cards:
  - 3 Techniken: Impulsgeschoss / Adrenalinschrei / Magiepanzer
  - 6 Essenzen: Feuer / Wasser / Erde / Luft / Licht / Schatten (#380)
  - 4 Katalysatoren: Überladung / Verdichtung / Sofortzünder / Opfergabe
  - Breakdown: 18 TE + 12 TK + 24 EK + 72 TEK + 72 Überformel
  - Arenas: Späti / Kristall / Vulkan / Sumpf / Club / Schattenbasar (V6-adapted, #350)
- **Element cards (#376):** hand-only V6 defs under `cards/elementCards.ts` (no Base/V5 bound); value roles 2/3/4/6
- **Items (#377):** `cards/itemCards.ts` — 3 Ausrüstung + 5 Verbrauch; wired into `V6_CORE_PACK.items`
- **Out of scope here:** full 60-TE × 10K matrix, extra Techniken beyond Slice-1 — later catalog issues.
- **Echo/Delay (#344):** engine queues + 2 playtest TEK hooks (`v6-katalysator-echo` / `v6-katalysator-verzoegerung`); not in the locked 198 catalog.

See `docs/letz-fetz-v6-spielkonzept.md` §0 Integrationsvertrag + §50.6 Slice 1.
