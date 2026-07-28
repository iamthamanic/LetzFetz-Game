/**
 * Unit tests for Elementimpuls keyword DE copy helpers.
 * Location: src/components/cards/impulseKeywordCopy.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  ELEMENTIMPULS_KEYWORD,
  formatCombatImpulseFeedback,
  formatCombatStageImpulseHint,
  formatImpulseKeywordChip,
  formatImpulseTooltipLine,
  formatImpulseTriggerLabel,
  resolveCombatImpulseFeedback,
} from './impulseKeywordCopy';

describe('impulseKeywordCopy', () => {
  it('formats chip and tooltip with Elementimpuls keyword', () => {
    const kw = { element: 'fire' as const, trigger: 'onHit' as const };
    expect(formatImpulseKeywordChip(kw)).toBe(`${ELEMENTIMPULS_KEYWORD} · Feuer`);
    expect(formatImpulseTriggerLabel('onHit')).toBe('bei Treffer');
    expect(formatImpulseTriggerLabel('onFullBlock')).toBe('bei Vollblock');
    expect(formatImpulseTooltipLine(kw)).toContain(ELEMENTIMPULS_KEYWORD);
    expect(formatImpulseTooltipLine(kw)).toContain('bei Treffer');
  });

  it('formats combat stage hints and resolve feedback', () => {
    expect(formatCombatStageImpulseHint({ element: 'water', trigger: 'onHit' })).toContain(
      'Elementimpuls',
    );
    expect(formatCombatImpulseFeedback('earth', 'onFullBlock')).toBe(
      'Elementimpuls Erde (bei Vollblock)',
    );
  });

  it('resolves hit vs full-block impulse from combat outcome', () => {
    const hit = resolveCombatImpulseFeedback({
      damage: 3,
      attackImpulse: { element: 'fire', trigger: 'onHit' },
      blockImpulse: { element: 'water', trigger: 'onFullBlock' },
    });
    expect(hit).toBe('Elementimpuls Feuer (bei Treffer)');

    const full = resolveCombatImpulseFeedback({
      damage: 0,
      attackImpulse: { element: 'fire', trigger: 'onHit' },
      blockImpulse: { element: 'water', trigger: 'onFullBlock' },
    });
    expect(full).toBe('Elementimpuls Wasser (bei Vollblock)');

    expect(
      resolveCombatImpulseFeedback({
        damage: 2,
        attackImpulse: null,
        blockImpulse: { element: 'water', trigger: 'onFullBlock' },
      }),
    ).toBeNull();
  });
});
