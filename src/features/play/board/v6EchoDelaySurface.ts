/**
 * Derives German HUD chips + catalyst pending badge from V6 Echo/Delay queues.
 * Location: src/features/play/board/v6EchoDelaySurface.ts
 *
 * Reads engine meta only — no rule duplication. Fixed Echo 1 / Delay +2 are
 * already baked into queue entry values by the engine (#344).
 */
import type { GameState, PlayerId } from '../../../game';
import type { V6QueuedPrimaryKind } from '../../../game/types/v6EchoDelay';

export type V6EchoDelayKind = 'echo' | 'delay';

export interface V6EchoDelayChip {
  id: string;
  kind: V6EchoDelayKind;
  labelDe: string;
  titleDe: string;
}

const PRIMARY_KIND_DE: Record<V6QueuedPrimaryKind, string> = {
  damage: 'Schaden',
  heal: 'Heilung',
  shield: 'Schild',
  prep_attack: 'Angriffsvorbereitung',
  prep_block: 'Blockvorbereitung',
  prep_boost: 'Boostvorbereitung',
  fessel: 'Fessel',
};

function primaryKindDe(kind: V6QueuedPrimaryKind): string {
  return PRIMARY_KIND_DE[kind] ?? kind;
}

/**
 * Pending Echo + Verzögerung chips for one player (public board info).
 */
export function buildV6EchoDelaySurface(
  state: GameState,
  playerId: PlayerId,
): V6EchoDelayChip[] {
  const chips: V6EchoDelayChip[] = [];
  const echoQueue = state.meta.v6EchoQueue?.[playerId] ?? [];
  const delayQueue = state.meta.v6DelayQueue?.[playerId] ?? [];

  echoQueue.forEach((entry, index) => {
    const kindDe = primaryKindDe(entry.kind);
    chips.push({
      id: `echo-${entry.recipeId}-${index}`,
      kind: 'echo',
      labelDe: `Echo · ${entry.recipeName} (+${entry.echoAmount} ${kindDe})`,
      titleDe: `Echo in Warteschlange — +${entry.echoAmount} ${kindDe} in deiner nächsten Startphase. Katalysator bleibt bis Auflösung.`,
    });
  });

  delayQueue.forEach((entry, index) => {
    const kindDe = primaryKindDe(entry.kind);
    chips.push({
      id: `delay-${entry.recipeId}-${index}`,
      kind: 'delay',
      labelDe: `Verzögerung · ${entry.recipeName} (${entry.value} ${kindDe})`,
      titleDe: `Verzögerung in Warteschlange — ${entry.value} ${kindDe} in deiner nächsten Startphase. Katalysator bleibt bis Auflösung.`,
    });
  });

  return chips;
}

/**
 * If the seated catalyst is still waiting for Echo/Delay resolve, return which.
 * Echo checked before Delay when both somehow reference the same instance.
 */
export function pendingCatalystTiming(
  state: GameState,
  playerId: PlayerId,
  catalystInstanceId: string | null | undefined,
): V6EchoDelayKind | null {
  if (!catalystInstanceId) return null;

  const echoHit = (state.meta.v6EchoQueue?.[playerId] ?? []).some(
    (e) => e.catalystInstanceId === catalystInstanceId,
  );
  if (echoHit) return 'echo';

  const delayHit = (state.meta.v6DelayQueue?.[playerId] ?? []).some(
    (e) => e.catalystInstanceId === catalystInstanceId,
  );
  if (delayHit) return 'delay';

  return null;
}
