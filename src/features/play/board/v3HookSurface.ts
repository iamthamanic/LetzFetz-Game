/**
 * Derives German HUD chips for active V3 Ulti / Blueprint / Transform hooks.
 * Location: src/features/play/board/v3HookSurface.ts
 */
import type { ContentPack, GameState, PlayerId } from '../../../game';
import {
  DEFAULT_REACTION_LIMIT,
  readV3CombatHooks,
} from '../../../game/engine/status/v3CombatHooks';
import { matchingBlueprintIds } from '../../../game/engine/status/applyBlueprints';
import { isTransformed } from '../../../game/engine/status/transform';

export interface V3HookChip {
  id: string;
  labelDe: string;
}

/**
 * Thin surface of active / ready V3 hooks for one player (Play coach/HUD).
 * Reads engine meta + ulti flag — no rule duplication.
 */
export function buildV3HookSurface(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
): V3HookChip[] {
  const chips: V3HookChip[] = [];
  const player = state.players[playerId];

  if (player.ultimateAvailable) {
    chips.push({ id: 'ulti-ready', labelDe: 'Ulti bereit' });
  }

  if (isTransformed(state, playerId)) {
    chips.push({ id: 'transformed', labelDe: 'Transformiert' });
  }

  const hooks = readV3CombatHooks(state.meta);
  if (hooks.reactionLimit > DEFAULT_REACTION_LIMIT) {
    chips.push({ id: 'double-reaction', labelDe: 'Doppelreaktion' });
  }
  if (hooks.dampfBecomesDichterNebel) {
    chips.push({ id: 'dampf-dichter-nebel', labelDe: 'Dampf → Dichter Nebel' });
  }
  if (hooks.preserveFirstConsumedMark) {
    chips.push({ id: 'mark-preserve', labelDe: 'Markenerhalt' });
  }

  if (state.meta.v3CombatEnabled === true && pack.blueprints?.length) {
    for (const bpId of matchingBlueprintIds(state, pack, playerId)) {
      const bp = pack.blueprints.find((b) => b.id === bpId);
      chips.push({
        id: `blueprint-${bpId}`,
        labelDe: bp ? `Blueprint: ${bp.name}` : `Blueprint: ${bpId}`,
      });
    }
  }

  return chips;
}
