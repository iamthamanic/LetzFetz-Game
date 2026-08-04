/**
 * Tests: hand card def resolution must not fall through to glitch for items/formula.
 * Location: src/features/play/board/resolveHandCardDefs.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V6_CORE_PACK } from '../../../game';
import { formulaRoleDe, resolveHandCardDefs } from './resolveHandCardDefs';

describe('resolveHandCardDefs', () => {
  it('resolves V6 item as item, not glitch', () => {
    const item = V6_CORE_PACK.items?.find((i) => i.id.includes('kabelbinder'));
    expect(item).toBeDefined();
    const resolved = resolveHandCardDefs(V6_CORE_PACK, item!.id);
    expect(resolved.itemDef?.id).toBe(item!.id);
    expect(resolved.displayName).toBe(item!.name);
    expect(resolved.glitchDef).toBeNull();
    expect(resolved.elementDef).toBeNull();
    expect(resolved.formulaDef).toBeNull();
  });

  it('resolves V6 catalyst as formula Katalysator, not glitch', () => {
    const cat = V6_CORE_PACK.catalysts?.find((c) => c.id.includes('kettenkopplung'));
    expect(cat).toBeDefined();
    const resolved = resolveHandCardDefs(V6_CORE_PACK, cat!.id);
    expect(resolved.formulaDef?.id).toBe(cat!.id);
    expect(formulaRoleDe(resolved.formulaDef!)).toBe('Katalysator');
    expect(resolved.displayName).toBe(cat!.name);
    expect(resolved.glitchDef).toBeNull();
  });

  it('still resolves real glitches', () => {
    const glitch = V6_CORE_PACK.glitches.find((g) => g.id.includes('rueckkopplung'));
    expect(glitch).toBeDefined();
    const resolved = resolveHandCardDefs(V6_CORE_PACK, glitch!.id);
    expect(resolved.glitchDef?.id).toBe(glitch!.id);
    expect(resolved.itemDef).toBeNull();
    expect(resolved.formulaDef).toBeNull();
  });
});
