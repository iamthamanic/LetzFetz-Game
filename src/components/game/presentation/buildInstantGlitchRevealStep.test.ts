/**
 * Unit tests for Sofort-Glitch presentation steps.
 * Location: src/components/game/presentation/buildInstantGlitchRevealStep.test.ts
 */
import { describe, it, expect } from 'vitest';
import {
  buildInstantGlitchRevealStep,
  buildInstantGlitchRevealSteps,
  isInstantGlitchRevealStep,
  INSTANT_GLITCH_REVEAL_MS,
} from './buildInstantGlitchRevealStep';

describe('buildInstantGlitchRevealStep', () => {
  it('builds a locking center reveal step', () => {
    const step = buildInstantGlitchRevealStep({
      playerId: 'p1',
      instanceId: 'inst-1',
      defId: 'glitch-absturz',
      name: 'Absturz',
      effectText: 'Wirf 1 Handkarte ab.',
      resolution: 'Absturz: Feuer 1 Boost abgeworfen.',
    });
    expect(step.kind).toBe('instant-glitch-reveal');
    expect(step.durationMs).toBe(INSTANT_GLITCH_REVEAL_MS);
    expect(step.locksInput).toBe(true);
    expect(step.payload?.cardDefId).toBe('glitch-absturz');
    expect(isInstantGlitchRevealStep(step)).toBe(true);
  });

  it('maps multiple reveals', () => {
    const steps = buildInstantGlitchRevealSteps([
      {
        playerId: 'p2',
        instanceId: 'a',
        defId: 'glitch-selbstschaden',
        name: 'Selbstschaden.exe',
        effectText: '−2',
        resolution: 'Selbstschaden.exe: −2 Leben.',
      },
    ]);
    expect(steps).toHaveLength(1);
  });
});
