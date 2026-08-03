# V6 authoring content (Slice 1)

Structured authoring tables and schemas for the V6 formula recipe generator.

- **SoT for humans:** edit files here (`formulaAuthoring.slice1.ts`, `cards/`).
- **Runtime catalog:** generated under `src/generated/v6/` — never hand-edit.
- **Current locked catalog:** **1420** recipes = **10T×6E×10K** (#383):
  - 10 Techniken · 6 Essenzen · 10 Katalysatoren
  - 6 catalysts `supported` (spielbar): Echo, Überladung, Verdichtung, Verzögerung, Sofortzünder, Opfergabe
  - 4 catalysts `availability: unsupported` (Ausbreitung, Kettenkopplung, Spiegelung, Umkehrung) — explicit recipes, Play rejects (§50.3)
  - Breakdown: 60 TE + 100 TK + 60 EK + 600 TEK + 600 Überformel
  - Arenas: Späti / Kristall / Vulkan / Sumpf / Club / Schattenbasar (#350)
- **Element cards (#376):** hand-only V6 defs under `cards/elementCards.ts`
- **Items (#377):** `cards/itemCards.ts` — wired into `V6_CORE_PACK.items`
- **Echo/Delay:** catalog TEK with `timingMode` (#382)
- **Constructs:** catalog Technik Beschwörungsritual (TE `summon_construct`)

See `docs/letz-fetz-v6-spielkonzept.md` §0 Integrationsvertrag + §50.6 Slice 1.
