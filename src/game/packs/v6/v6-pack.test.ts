/**
 * V6 core pack Slice-1 smoke tests (#318).
 * Location: src/game/packs/v6/v6-pack.test.ts
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGame } from '../../engine/createGame';
import { isV6FormulaEnabled } from '../../types';
import {
  V6_GENERATED_FORMULA_RECIPES,
  V6_GENERATED_RECIPE_COUNT,
} from '../../../generated/v6/formulaRecipes.generated';
import { V6_FORMULA_AUTHORING_SLICE1 } from '../../../content/v6/formulaAuthoring.slice1';
import {
  V6_SLICE1_ARENA_IDS,
  V6_SLICE1_CATALYST_IDS,
  V6_SLICE1_ESSENCE_IDS,
  V6_SLICE1_TECHNIQUE_IDS,
} from '../../../content/v6/slice1Ids';
import { V6_CORE_PACK, V6_PACK_RULESET, buildV6CorePack } from './v6-pack';

const here = dirname(fileURLToPath(import.meta.url));

describe('V6_CORE_PACK Slice-1 (INTERNAL)', () => {
  it('exports Slice-1 formula cards + Späti/Vulkan only', () => {
    expect(V6_CORE_PACK.id).toBe('v6-core');
    expect(V6_CORE_PACK.techniques?.map((t) => t.id)).toEqual([...V6_SLICE1_TECHNIQUE_IDS]);
    expect(V6_CORE_PACK.essences?.map((e) => e.id)).toEqual([...V6_SLICE1_ESSENCE_IDS]);
    expect(V6_CORE_PACK.catalysts?.map((c) => c.id)).toEqual([...V6_SLICE1_CATALYST_IDS]);
    expect(V6_CORE_PACK.arenas.map((a) => a.id).sort()).toEqual([...V6_SLICE1_ARENA_IDS].sort());
    expect(V6_CORE_PACK.ultimates).toEqual([]);
    expect(isV6FormulaEnabled(V6_PACK_RULESET)).toBe(true);
    expect(V6_PACK_RULESET.v5Formula).toBe(false);
    expect(buildV6CorePack().version).toBe(V6_CORE_PACK.version);
  });

  it('ships V6 characters with affinity scaffold and no V5 passives/ultis', () => {
    expect(V6_CORE_PACK.characters.length).toBeGreaterThanOrEqual(2);
    for (const ch of V6_CORE_PACK.characters) {
      expect(ch.elements).toHaveLength(2);
      expect(ch.ultimateId).toBe('');
      expect(ch.passiveText).toMatch(/Affinität/);
      expect(ch.passiveText).not.toMatch(/Einmal pro Zug, wenn du Feuer oder Erde baust/);
      expect(ch.passiveText).toMatch(/Keine V5-Passive/);
    }
  });

  it('createGame with V6 pack/ruleset stays INTERNAL (meta flag only)', () => {
    const state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 11,
    });
    expect(state.meta.v6FormulaEnabled).toBe(true);
    expect(state.meta.v5FormulaEnabled).toBeUndefined();
    expect(state.players.p1.ultimateAvailable).toBe(false);
    expect(state.players.p2.ultimateAvailable).toBe(false);
  });

  it('ships Slice-1 authoring + generated TE/TK/EK/TEK/overformula recipes', () => {
    expect(V6_FORMULA_AUTHORING_SLICE1.teBases).toHaveLength(9);
    expect(V6_GENERATED_RECIPE_COUNT).toBe(105);
    expect(V6_GENERATED_FORMULA_RECIPES).toHaveLength(105);
    const kinds = new Set(V6_GENERATED_FORMULA_RECIPES.map((r) => r.kind));
    expect(kinds).toEqual(new Set(['te', 'tk', 'ek', 'tek', 'overformula']));
    expect(V6_GENERATED_FORMULA_RECIPES.filter((r) => r.kind === 'tek').every((r) => r.grantsFetz)).toBe(
      true,
    );
    expect(
      V6_GENERATED_FORMULA_RECIPES.filter((r) => r.catalystId).every((r) => r.catalystConsumed),
    ).toBe(true);
  });

  it('does not import V5 formulaCombinations from v6 pack/content/generated sources', () => {
    const sources = [
      join(here, 'v6-pack.ts'),
      join(here, 'index.ts'),
      join(here, '../../../content/v6/formulaAuthoring.stub.ts'),
      join(here, '../../../content/v6/formulaAuthoring.slice1.ts'),
      join(here, '../../../content/v6/cards/slice1Cards.ts'),
      join(here, '../../../generated/v6/formulaRecipes.generated.ts'),
    ];
    for (const path of sources) {
      const text = readFileSync(path, 'utf8');
      expect(text, path).not.toMatch(/formulaCombinations/);
      expect(text, path).not.toMatch(/packs\/v5\/formulaCombinations/);
    }
  });
});
