/**
 * V3 reaction outcomes — P0: six mono + Dampf (§8.1–8.7).
 * Location: src/game/engine/status/reactionOutcomes.ts
 */
import type { GameState, PlayerId, PrimaryMarkId, RulesetConfig, StatusId } from '../../types';
import { cloneState } from '../helpers';
import { addShield, applyStatus, getStatus, removeStatus } from './applyStatus';
import { applyDamageThroughShield } from './shield';
import { REACTION_LABEL_DE, type ReactionId } from './reactions';

const NEGATIVE_STATUSES: StatusId[] = [
  'brennen',
  'verflucht',
  'verpeilt',
  'geblendet',
  'gift',
  'ueberflutet',
  'nebel',
  'dichter_nebel',
  'ausgeblendet',
];

export interface ReactionContext {
  targetId: PlayerId;
  chooserId: PlayerId;
  consumedMark: PrimaryMarkId;
  ruleset: RulesetConfig;
}

function keepsMark(reactionId: ReactionId): boolean {
  return reactionId === 'deep_high' || reactionId === 'tiefer_fluch';
}

/**
 * Resolve a reaction: optionally consume mark, apply outcome, bump action counter.
 */
export function applyReactionWithOutcome(
  state: GameState,
  reactionId: ReactionId,
  ctx: ReactionContext,
): GameState {
  const stacksBefore = getStatus(state, ctx.targetId, ctx.consumedMark)?.stacks ?? 1;
  let next = cloneState(state);
  next.pendingChoice = null;
  next.meta = {
    ...next.meta,
    v3ReactionsThisAction: (next.meta.v3ReactionsThisAction ?? 0) + 1,
  };

  if (!keepsMark(reactionId)) {
    next = removeStatus(next, ctx.targetId, ctx.consumedMark);
  }

  switch (reactionId) {
    case 'inferno': {
      const leftover = getStatus(next, ctx.targetId, 'brennen');
      let stacksRemoved = 0;
      if (ctx.consumedMark === 'brennen') stacksRemoved += stacksBefore;
      if (leftover) {
        stacksRemoved += leftover.stacks;
        next = removeStatus(next, ctx.targetId, 'brennen');
      }
      const damage = stacksRemoved + 1;
      next = applyDamageThroughShield(next, ctx.targetId, damage, ctx.ruleset).state;
      break;
    }
    case 'ueberflutung':
      next = applyStatus(next, ctx.targetId, 'ueberflutet', 1);
      break;
    case 'deep_high': {
      if (!getStatus(next, ctx.targetId, 'high')) {
        next = applyStatus(next, ctx.targetId, 'high', stacksBefore);
      }
      next = applyStatus(next, ctx.targetId, 'high', 1);
      break;
    }
    case 'rueckenwind': {
      next = applyStatus(next, ctx.targetId, 'fokus', 1);
      const exhausted = next.players[ctx.targetId].bound.find((b) => b.exhausted);
      if (exhausted) {
        next = cloneState(next);
        const idx = next.players[ctx.targetId].bound.findIndex(
          (b) => b.instanceId === exhausted.instanceId,
        );
        if (idx >= 0) next.players[ctx.targetId].bound[idx].exhausted = false;
      }
      break;
    }
    case 'erleuchtung': {
      const negatives = (next.players[ctx.targetId].statuses ?? []).filter((s) =>
        NEGATIVE_STATUSES.includes(s.id),
      );
      if (negatives.length > 0) {
        next = removeStatus(next, ctx.targetId, negatives[0].id);
        next = addShield(next, ctx.targetId, 1);
      } else {
        next = addShield(next, ctx.targetId, 2);
      }
      break;
    }
    case 'tiefer_fluch': {
      if (!getStatus(next, ctx.targetId, 'verflucht')) {
        next = applyStatus(next, ctx.targetId, 'verflucht', stacksBefore);
      }
      next = applyStatus(next, ctx.targetId, 'verflucht', 2);
      break;
    }
    case 'dampf':
      next = applyStatus(next, ctx.targetId, 'nebel', 1);
      break;
    default:
      break;
  }

  next = cloneState(next);
  next.lastEvent = `Reaktion: ${REACTION_LABEL_DE[reactionId]}.`;
  return next;
}
