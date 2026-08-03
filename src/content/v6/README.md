# V6 authoring content (Slice 1)

Structured authoring tables and schemas for the V6 formula recipe generator.

- **SoT for humans:** edit files here (`formulaAuthoring.slice1.ts`, `cards/`).
- **Runtime catalog:** generated under `src/generated/v6/` — never hand-edit.
- **Current locked catalog:** **876** recipes from Slice-1 cards:
  - 10 Techniken: Impulsgeschoss … Beschwörungsritual (#381)
  - 6 Essenzen: Feuer / Wasser / Erde / Luft / Licht / Schatten (#380)
  - 10 Katalysatoren: Echo … Opfergabe (#382) — **matrix expands 6 supported** (Echo, Überladung, Verdichtung, Verzögerung, Sofortzünder, Opfergabe)
  - 4 Katalysatoren `availability: unsupported` (Ausbreitung, Kettenkopplung, Spiegelung, Umkehrung) — cards + transform rows only until #383
  - Breakdown: 60 TE + 60 TK + 36 EK + 360 TEK + 360 Überformel
  - Arenas: Späti / Kristall / Vulkan / Sumpf / Club / Schattenbasar (V6-adapted, #350)
- **Element cards (#376):** hand-only V6 defs under `cards/elementCards.ts` (no Base/V5 bound); value roles 2/3/4/6
- **Items (#377):** `cards/itemCards.ts` — 3 Ausrüstung + 5 Verbrauch; wired into `V6_CORE_PACK.items`
- **Out of scope here:** full 10T×10K matrix — catalog-expansion (#383).
- **Echo/Delay:** catalog TEK with `timingMode` (#382); playtest-only duplicate cards removed.
- **Constructs:** catalog Technik Beschwörungsritual (TE `summon_construct`); playtest EK hook remains optional.

See `docs/letz-fetz-v6-spielkonzept.md` §0 Integrationsvertrag + §50.6 Slice 1.
