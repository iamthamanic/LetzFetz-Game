# Effekseer Runtime Wiring — Issues CREATED

Epic: `.qa/design/effekseer-runtime-wiring.md`  
Repo: `iamthamanic/LetzFetz-Game`  
Created: 2026-07-30  
Parent: `.qa/design/vfx-studio.md`

| # | Priority | Title | featureSlug | Depends on |
|---|----------|-------|-------------|------------|
| #300 | P0 | VFX: wire Effekseer WASM adapter + load real aura.efkefc (stand-in fallback) | `vfx-effekseer-wasm-adapter` | — |
| #301 | P0 | VFX: shared preview plays Effekseer when effect ready (Timeline/Hero) | `vfx-effekseer-preview-play` | #300 |
| #302 | P1 | VFX: Effekseer preset node in asset pipeline + effectId on save | `vfx-effekseer-preset-node` | #301 |
| #303 | P1 | VFX: Combinate VisualRecipe → preset layers for MVP-9 (T/E/K) | `vfx-combinate-preset-layers-mvp9` | #302 |
| #304 | P2 | VFX docs: refresh effects README + vfx-studio Effekseer runtime pointer | `vfx-effekseer-docs-refresh` | #300 |

**Skipped:** #286 Meshy MVP-9 batch (`needs-human`). Never stash `src/features/build/` regressively (#290 on main).

**Sample assets staged locally (commit with #300):** MIT EffekseerForWebGL `tests/Resources` → `aura`/`trail`/`impact`/`ambient` `.efkefc` + `Parts/` + `Texture/` + `EFFEKSEER_SAMPLE_LICENSE.txt`.

Runner: `@ecc-runner-loop` (user approved create + merge-in-loop)
