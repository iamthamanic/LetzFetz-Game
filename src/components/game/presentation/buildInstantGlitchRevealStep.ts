/**
 * Presentation step: Sofort-Glitch revealed face-up in the center.
 * Location: src/components/game/presentation/buildInstantGlitchRevealStep.ts
 */
import type { InstantReveal } from '../../../game/types';
import type { PresentationStep } from './types';

export const INSTANT_GLITCH_REVEAL_MS = 2200;

export function buildInstantGlitchRevealStep(reveal: InstantReveal): PresentationStep {
  return {
    id: `instant-glitch-${reveal.instanceId}-${reveal.defId}`,
    kind: 'instant-glitch-reveal',
    durationMs: INSTANT_GLITCH_REVEAL_MS,
    locksInput: true,
    payload: {
      playerId: reveal.playerId,
      instanceId: reveal.instanceId,
      cardDefId: reveal.defId,
      name: reveal.name,
      effectText: reveal.effectText,
      resolution: reveal.resolution,
    },
  };
}

export function buildInstantGlitchRevealSteps(reveals: InstantReveal[]): PresentationStep[] {
  return reveals.map(buildInstantGlitchRevealStep);
}

export function isInstantGlitchRevealStep(step: PresentationStep): boolean {
  return step.kind === 'instant-glitch-reveal';
}
