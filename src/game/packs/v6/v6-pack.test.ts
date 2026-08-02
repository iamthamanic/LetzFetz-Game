/**
 * V6 core pack stub smoke tests (#311).
 * Location: src/game/packs/v6/v6-pack.test.ts
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGame } from '../../engine/createGame';
import { isV6FormulaEnabled } from '../../types';
import { V6_GENERATED_FORMULA_RECIPES } from '../../../generated/v6/formulaRecipes.generated';
import { V6_FORMULA_AUTHORING_STUB } from '../../../content/v6/formulaAuthoring.stub';
import { V6_CORE_PACK, V6_PACK_RULESET, buildV6CorePack } from './v6-pack';

const here = dirname(fileURLToPath(import.meta.url));

describe('V6_CORE_PACK stub (INTERNAL)', () => {
  it('exports stub pack with empty formula slots and V6 ruleset', () => {
    expect(V6_CORE_PACK.id).toBe('v6-core');
    expect(V6_CORE_PACK.techniques).toEqual([]);
    expect(V6_CORE_PACK.essences).toEqual([]);
    expect(V6_CORE_PACK.catalysts).toEqual([]);
    expect(isV6FormulaEnabled(V6_PACK_RULESET)).toBe(true);
    expect(V6_PACK_RULESET.v5Formula).toBe(false);
    expect(buildV6CorePack().id).toBe(V6_CORE_PACK.id);
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
  });

  it('ships empty authoring + generated placeholders', () => {
    expect(V6_FORMULA_AUTHORING_STUB.teBases).toEqual([]);
    expect(V6_GENERATED_FORMULA_RECIPES).toEqual([]);
  });

  it('does not import V5 formulaCombinations from v6 pack sources', () => {
    const sources = [
      join(here, 'v6-pack.ts'),
      join(here, 'index.ts'),
      join(here, '../../../content/v6/formulaAuthoring.stub.ts'),
      join(here, '../../../generated/v6/formulaRecipes.generated.ts'),
    ];
    for (const path of sources) {
      const text = readFileSync(path, 'utf8');
      expect(text, path).not.toMatch(/formulaCombinations/);
      expect(text, path).not.toMatch(/packs\/v5\/formulaCombinations/);
    }
  });
});
