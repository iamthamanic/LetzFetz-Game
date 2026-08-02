# V6 Slice 0 — Formula recipe generator

**Status:** Slice 0 foundation  
**Issues:** #312 (generator + fail-closed check)

## Contract

| Axis | Rule |
|------|------|
| Authoring SoT | `src/content/v6/` |
| Generated output | `src/generated/v6/` — **never hand-edit** |
| Runtime | Lookup only (later slices); generator is build-time |
| Empty catalog | Valid |
| Missing required keys | Fail closed (non-zero exit) |

## Commands

```bash
npm run generate:v6-formula-recipes
npm run check:v6-formula-recipes   # generate + git diff --exit-code
```

`npm run checks` includes `check:v6-formula-recipes`.

## Play-Default

V6 remains **INTERNAL**. Play-Default stays V5 until PLAYABLE cutover.
