import { describe, expect, it } from 'vitest';
import type { ElementCardDef, PendingCombat } from '../../../game/types';
import {
  buildCombatStageImpulseLine,
  buildCombatStageSubtitle,
  buildCombatStageTitle,
  combatValueLabel,
  defenderValueLabel,
  defenderPendingValue,
} from './combatStageCopy';

const attack: PendingCombat = {
  attackerId: 'p2',
  defenderId: 'p1',
  attackCardDefId: 'feuer-angriff',
  attackRoll: 4,
  attackValue: 6,
  mode: 'player',
};

const challenge: PendingCombat = {
  ...attack,
  mode: 'challenge',
  targetBoundInstanceId: 'bound-1',
};

const impulseAttack: ElementCardDef = {
  id: 'v3-fire-attack-4-1',
  name: 'Feuer 4 Angriff',
  kind: 'element',
  element: 'fire',
  cardType: 'attack',
  value: 4,
  instantText: 'Angriff 4. Treffer: Erzeuge einen Feuer-Impuls.',
  boundText: 'V3: Angriff bleibt Hand-only.',
  elementImpulse: { element: 'fire', trigger: 'onHit' },
};

describe('combatStageCopy', () => {
  it('labels human block window for attack and challenge', () => {
    expect(buildCombatStageTitle(attack, true)).toBe('🛡️ Angriff blocken');
    expect(buildCombatStageTitle(challenge, true)).toBe('🛡️ Herausforderung blocken');
  });

  it('labels attacker view when human is not defender', () => {
    expect(buildCombatStageTitle(attack, false)).toBe('⚔️ Angriff');
    expect(buildCombatStageTitle(challenge, false)).toBe('⚔️ Herausforderung');
  });

  it('describes defender prompt vs bot blocking', () => {
    expect(buildCombatStageSubtitle(true, false)).toContain('Block-Karte');
    expect(buildCombatStageSubtitle(true, false)).toContain('danach');
    expect(buildCombatStageSubtitle(false, true)).toContain('entscheidet');
  });

  it('mentions Elementimpuls when attack card carries onHit keyword', () => {
    expect(buildCombatStageSubtitle(true, false, impulseAttack)).toContain('Elementimpuls');
    expect(buildCombatStageImpulseLine(impulseAttack)).toContain('Elementimpuls');
    expect(buildCombatStageImpulseLine(null)).toBeNull();
  });

  it('names combat value by mode', () => {
    expect(combatValueLabel(attack)).toBe('Angriffswert');
    expect(combatValueLabel(challenge)).toBe('Herausforderungswert');
  });

  it('labels defender side by mode and pending state', () => {
    expect(defenderValueLabel(attack)).toBe('Blockwert');
    expect(defenderValueLabel(challenge)).toBe('Block vs. Ziel');
    expect(defenderPendingValue(true, false)).toBe('?');
    expect(defenderPendingValue(false, true)).toBe('…');
    expect(defenderPendingValue(false, false)).toBe('—');
  });
});
