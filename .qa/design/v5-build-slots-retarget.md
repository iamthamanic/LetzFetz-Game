# Design: v5-build-slots-retarget

**Issue:** #230  
**Epic:** `.qa/design/v5-formula-migration.md`

## Intent
Build Combinate slots use Technik / Essenz / Katalysator (DE); no default „Fetzgerät · Entwurf“.

## Decision
- Rename `BuildSlotRole` to `technik | essenz | katalysator`.
- Bump session version → 3 (v2 sessions reset; documented).
- Map legacy Meshy slots: Träger→Technik, Antrieb→Essenz, Aufsatz→Katalysator.
- Default name: „Meine Formel“; result eyebrow: „Formel · Entwurf“.

## Non-goals
Meshy re-batch; Development pipeline slot rename beyond labels.
