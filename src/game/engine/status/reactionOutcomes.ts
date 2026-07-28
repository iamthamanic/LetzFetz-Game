/**
 * V3 reaction outcomes — mono + all mixed (§8).
 * Location: src/game/engine/status/reactionOutcomes.ts
 */
import type { GameState, PlayerId, PrimaryMarkId, RulesetConfig, StatusId } from '../../types';
import { opponentOf } from '../createGame';
import { cloneState } from '../helpers';
import { addShield, applyStatus, getStatus, removeStatus, setShield } from './applyStatus';
import { applyDamageThroughShield } from './shield';
import { REACTION_LABEL_DE, type ReactionId } from './reactions';
import { infernoResonanceBonus, tryTwoPartWaterReactionCharge, ueberflutungExtraCharge, deepHighExtraDraw, rueckenwindUprightLimit, erleuchtungCleanseLimit, tieferFluchMaxStacks } from './resonance';
import type { ContentPack } from '../../types';
import { readV3CombatHooks, shouldPreserveConsumedMark } from './v3CombatHooks';

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
  /** Optional pack for resonance bonuses. */
  pack?: import('../../types').ContentPack;
}

function keepsMark(reactionId: ReactionId): boolean {
  return reactionId === 'deep_high' || reactionId === 'tiefer_fluch';
}

/** Owner picks which hand card to discard — KISS: last card. */
function forceDiscardOne(state: GameState, playerId: PlayerId): GameState {
  const hand = state.players[playerId].hand;
  if (hand.length === 0) return state;
  const next = cloneState(state);
  const card = next.players[playerId].hand.pop();
  if (card) next.piles.discard.push(card);
  return next;
}

function heal(state: GameState, playerId: PlayerId, amount: number, ruleset: RulesetConfig): GameState {
  const next = cloneState(state);
  next.players[playerId].hp = Math.min(
    ruleset.maxHp,
    next.players[playerId].hp + amount,
  );
  return next;
}

/**
 * Resolve a reaction: optionally consume mark, apply outcome, bump action counter.
 * Status applied as reaction results do not chain-react (caller responsibility).
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

  const preserve = shouldPreserveConsumedMark(
    next.meta,
    reactionId,
    keepsMark(reactionId),
  );
  next.meta = preserve.nextMeta;
  if (!preserve.preserve) {
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
      let damage = stacksRemoved + 1;
      if (ctx.pack) {
        const reso = infernoResonanceBonus(next, ctx.pack, ctx.chooserId, ctx.ruleset);
        next = reso.state;
        damage += reso.bonus;
      }
      next = applyDamageThroughShield(next, ctx.targetId, damage, ctx.ruleset).state;
      break;
    }
    case 'ueberflutung':
      next = applyStatus(next, ctx.targetId, 'ueberflutet', 1);
      if (ctx.pack) {
        const reso = ueberflutungExtraCharge(next, ctx.pack, ctx.chooserId, ctx.ruleset);
        next = reso.state;
        if (reso.extraCharge > 0) {
          next.lastEvent = `${REACTION_LABEL_DE.ueberflutung}: volle Wasser-Resonanz (+1 Ladungskosten).`;
        }
        next = tryTwoPartWaterReactionCharge(next, ctx.pack, ctx.chooserId, ctx.ruleset);
      }
      break;
    case 'deep_high': {
      if (!getStatus(next, ctx.targetId, 'high')) {
        next = applyStatus(next, ctx.targetId, 'high', stacksBefore);
      }
      next = applyStatus(next, ctx.targetId, 'high', 1);
      if (ctx.pack) {
        const reso = deepHighExtraDraw(next, ctx.pack, ctx.chooserId, ctx.ruleset);
        next = reso.state;
        // Base: filter 1; full reso: +1 draw (KISS: draw from deck if available)
        const draws = 1 + reso.extraDraw;
        for (let i = 0; i < draws; i++) {
          const top = next.piles.deck.pop();
          if (top) next.players[ctx.chooserId].hand.push(top);
        }
        next = forceDiscardOne(next, ctx.chooserId);
      }
      break;
    }
    case 'rueckenwind': {
      next = applyStatus(next, ctx.targetId, 'fokus', 1);
      let uprightLimit = 1;
      if (ctx.pack) {
        const reso = rueckenwindUprightLimit(next, ctx.pack, ctx.chooserId, ctx.ruleset);
        next = reso.state;
        uprightLimit = reso.limit;
      }
      let uprighted = 0;
      next = cloneState(next);
      for (const b of next.players[ctx.targetId].bound) {
        if (uprighted >= uprightLimit) break;
        if (b.exhausted) {
          b.exhausted = false;
          uprighted += 1;
        }
      }
      break;
    }
    case 'erleuchtung': {
      let cleanseLimit = 1;
      if (ctx.pack) {
        const reso = erleuchtungCleanseLimit(next, ctx.pack, ctx.chooserId, ctx.ruleset);
        next = reso.state;
        cleanseLimit = reso.limit;
      }
      const negatives = (next.players[ctx.targetId].statuses ?? []).filter((s) =>
        NEGATIVE_STATUSES.includes(s.id),
      );
      let cleansed = 0;
      for (const n of negatives) {
        if (cleansed >= cleanseLimit) break;
        next = removeStatus(next, ctx.targetId, n.id);
        cleansed += 1;
      }
      if (cleansed > 0) {
        next = addShield(next, ctx.targetId, 1);
      } else {
        next = addShield(next, ctx.targetId, 2);
      }
      break;
    }
    case 'tiefer_fluch': {
      let maxStacks = 3;
      if (ctx.pack) {
        const reso = tieferFluchMaxStacks(next, ctx.pack, ctx.chooserId, ctx.ruleset);
        next = reso.state;
        maxStacks = reso.maxStacks;
      }
      if (!getStatus(next, ctx.targetId, 'verflucht')) {
        next = applyStatus(next, ctx.targetId, 'verflucht', stacksBefore);
      }
      next = applyStatus(next, ctx.targetId, 'verflucht', 2);
      const curse = getStatus(next, ctx.targetId, 'verflucht');
      if (curse && curse.stacks > maxStacks) {
        next = cloneState(next);
        const list = next.players[ctx.targetId].statuses ?? [];
        const idx = list.findIndex((s) => s.id === 'verflucht');
        if (idx >= 0) list[idx] = { ...list[idx], stacks: maxStacks };
        next.players[ctx.targetId].statuses = list;
      }
      break;
    }
    case 'dampf': {
      const fog = readV3CombatHooks(next.meta).dampfBecomesDichterNebel
        ? 'dichter_nebel'
        : 'nebel';
      next = applyStatus(next, ctx.targetId, fog, 1);
      break;
    }
    case 'hotbox': {
      next = applyStatus(next, ctx.targetId, 'high', 2);
      next = applyStatus(next, ctx.targetId, 'nebel', 1);
      break;
    }
    case 'feuersturm': {
      next = applyDamageThroughShield(next, ctx.targetId, 2, ctx.ruleset).state;
      next = applyStatus(next, ctx.targetId, 'brennen', 1);
      break;
    }
    case 'sonnenbrand': {
      next = applyDamageThroughShield(next, ctx.targetId, 1, ctx.ruleset).state;
      const shield = next.players[ctx.targetId].shield ?? 0;
      next = setShield(next, ctx.targetId, Math.max(0, shield - 2));
      next = applyStatus(next, ctx.targetId, 'geblendet', 1);
      break;
    }
    case 'hexenbrand': {
      next = applyStatus(next, ctx.targetId, 'brennen', 1);
      next = applyStatus(next, ctx.targetId, 'verflucht', 1);
      break;
    }
    case 'kraeutersud': {
      next = heal(next, ctx.targetId, 1, ctx.ruleset);
      const negatives = (next.players[ctx.targetId].statuses ?? []).filter((s) =>
        NEGATIVE_STATUSES.includes(s.id),
      );
      if (negatives.length > 0) {
        next = removeStatus(next, ctx.targetId, negatives[0].id);
      }
      next = applyStatus(next, ctx.targetId, 'high', 1);
      break;
    }
    case 'wirbel': {
      const upright = next.players[ctx.targetId].bound.find((b) => !b.exhausted);
      if (upright) {
        next = cloneState(next);
        const idx = next.players[ctx.targetId].bound.findIndex(
          (b) => b.instanceId === upright.instanceId,
        );
        if (idx >= 0) next.players[ctx.targetId].bound[idx].exhausted = true;
      } else {
        next = forceDiscardOne(next, ctx.targetId);
      }
      break;
    }
    case 'prisma': {
      const negatives = (next.players[ctx.targetId].statuses ?? []).filter((s) =>
        NEGATIVE_STATUSES.includes(s.id),
      );
      if (negatives.length > 0) {
        next = removeStatus(next, ctx.targetId, negatives[0].id);
        next = addShield(next, ctx.targetId, 2);
      } else {
        next = addShield(next, ctx.targetId, 3);
      }
      break;
    }
    case 'giftbruehe': {
      const alreadyPoisoned = Boolean(getStatus(next, ctx.targetId, 'gift'));
      next = applyStatus(next, ctx.targetId, 'gift', 1);
      if (alreadyPoisoned) next = forceDiscardOne(next, ctx.targetId);
      break;
    }
    case 'pollenflug': {
      const other = opponentOf(ctx.targetId);
      next = applyStatus(next, ctx.targetId, 'high', 1);
      next = applyStatus(next, other, 'high', 1);
      next = applyStatus(next, ctx.targetId, 'geblendet', 1);
      break;
    }
    case 'growlight': {
      next = heal(next, ctx.targetId, 1, ctx.ruleset);
      next = addShield(next, ctx.targetId, 1);
      next = applyStatus(next, ctx.targetId, 'high', 1);
      break;
    }
    case 'paranoia': {
      const remainingHigh = getStatus(next, ctx.targetId, 'high');
      const highStacks =
        ctx.consumedMark === 'high' ? stacksBefore : remainingHigh?.stacks ?? 0;
      if (remainingHigh) next = removeStatus(next, ctx.targetId, 'high');
      const curseStacks = Math.min(3, highStacks + 1);
      // Replace curse entirely to the computed stack count
      if (getStatus(next, ctx.targetId, 'verflucht')) {
        next = removeStatus(next, ctx.targetId, 'verflucht');
      }
      next = applyStatus(next, ctx.targetId, 'verflucht', curseStacks);
      break;
    }
    case 'blendwerk': {
      next = applyStatus(next, ctx.targetId, 'geblendet', 1);
      next = applyStatus(next, ctx.chooserId, 'fokus', 1);
      break;
    }
    case 'fluestersturm': {
      next = forceDiscardOne(next, ctx.targetId);
      next = applyStatus(next, ctx.targetId, 'verflucht', 1);
      break;
    }
    case 'finsternis': {
      next = applyStatus(next, ctx.targetId, 'ausgeblendet', 1);
      next = cloneState(next);
      next.meta = { ...next.meta, v3BlockShieldThisAction: true };
      break;
    }
    default:
      break;
  }

  next = cloneState(next);
  next.lastEvent = `Reaktion: ${REACTION_LABEL_DE[reactionId]}.`;
  return next;
}
