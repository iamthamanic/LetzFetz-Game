# Playmat background assets

Top-down playmat backgrounds for base-pack arenas. Zone layout is shared (Späti reference); only the background art and per-arena tint differ.

## Paths

| Kind | Pattern | Example |
|------|---------|---------|
| Top-down playmat | `public/textures/playmat/{arenaId}-topdown.png` | `arena-spaeti-topdown.png` |
| Zone overlay (dev) | `public/textures/playmat/arena-spaeti-topdown-zones.svg` | Späti reference only |
| Card-art fallback | `public/cards/arena/{arenaId}.png` | Always present for base pack |

## Resolver

`src/components/game/playmat/playmatAssets.ts`:

- `resolvePlaymatBackground(arenaId)` — primary URL + fallback
- `SHIPPED_TOPDOWN_ARENA_IDS` — arenas with committed top-down PNGs
- `ArenaPlaymat.tsx` loads primary; on image error switches to card-art fallback

## Base-pack arenas

| Arena ID | Top-down shipped | Fallback |
|----------|------------------|----------|
| `arena-spaeti` | yes | `/cards/arena/arena-spaeti.png` |
| `arena-kristall` | pending | `/cards/arena/arena-kristall.png` |
| `arena-vulkan` | pending | `/cards/arena/arena-vulkan.png` |
| `arena-sumpf` | pending | `/cards/arena/arena-sumpf.png` |
| `arena-club` | pending | `/cards/arena/arena-club.png` |
| `arena-schattenbasar` | pending | `/cards/arena/arena-schattenbasar.png` |

After adding a PNG, register the id in `SHIPPED_TOPDOWN_ARENA_IDS`.

## Authoring new top-down art

**Target:** 1448×1086 px (matches Späti asset), design coords 1920×1080 — see `arenaPlaymatLayouts.ts`.

**Prompt direction (Higgsfield / Forge):**

- Top-down tabletop view of the arena theme (not portrait card framing)
- Leave center/combat lane readable; edges may be darker for vignette
- Match `arenaTheme.ts` palette (fuchsia Späti, amber Kristall, red Vulkan, cyan Sumpf, sky Club, purple Schattenbasar)

**Suggested Higgsfield flow:**

```bash
higgsfield product-photoshoot create \
  --mode hero_banner \
  --prompt "Top-down TCG playmat, {arena name}, subtle zone markings, dark vignette, 16:9"
```

Export PNG → `public/textures/playmat/arena-{id}-topdown.png` → add id to `SHIPPED_TOPDOWN_ARENA_IDS` → `npm run checks`.

**Dev preview:** `http://localhost:4789/?playmat-preview=1` (optional local gate).

## Tests

- Unit: `src/components/game/playmat/playmatAssets.test.ts`
- E2E: `arena-playmat` visible; Späti uses `data-playmat-source="topdown"`
