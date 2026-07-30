/**
 * Element / instant-glitch effects with arena heal + Späti damage cap.
 * Location: src/game/engine/effects.ts
 */
import type { ContentPack, Element, GameState, GlitchCardDef, PlayerId, RulesetConfig } from '../types';
import { DEFAULT_RULESET } from '../types';
import { opponentOf, checkWinner } from './createGame';
import { cloneState, drawForPlayer, clampHp } from './helpers';
import { findElementDef, findGlitchDef } from './lookup';
import type { Rng } from './deck';
import { tickBrennenAfterMainAction } from './status/tickStatuses';

function capBoostDamage(state: GameState, damage: number): number {
  if (state.arena.arenaId !== 'arena-spaeti') return damage;
  return Math.min(3, damage);
}

function applyHealAmount(
  state: GameState,
  playerId: PlayerId,
  amount: number,
  ruleset: RulesetConfig,
): GameState {
  const next = cloneState(state);
  let heal = amount;
  if (
    next.arena.arenaId === 'arena-kristall' &&
    amount > 0 &&
    !next.meta.kristallHealUsed[playerId]
  ) {
    heal += 1;
    next.meta = {
      ...next.meta,
      kristallHealUsed: { ...next.meta.kristallHealUsed, [playerId]: true },
    };
  }
  next.players[playerId].hp = clampHp(next.players[playerId].hp + heal, ruleset);
  return next;
}

function cardLabel(pack: ContentPack, defId: string): string {
  const el = findElementDef(pack, defId);
  if (el) return el.name;
  const g = findGlitchDef(pack, defId);
  return g?.name ?? defId;
}

export function applyInstantGlitch(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  glitch: GlitchCardDef,
  rng: Rng,
  ruleset: RulesetConfig = DEFAULT_RULESET,
  instanceId = 'unknown',
): GameState {
  let next = cloneState(state);
  let resolution: string;

  switch (glitch.id) {
    case 'glitch-selbstschaden':
      next.players[playerId].hp = clampHp(next.players[playerId].hp - 2, ruleset);
      resolution = 'Selbstschaden.exe: −2 Leben.';
      break;
    case 'glitch-datenleck': {
      const other = opponentOf(playerId);
      next = drawForPlayer(next, playerId, 1, rng, ruleset, { allowExtra: true });
      next = drawForPlayer(next, other, 1, rng, ruleset, { allowExtra: true });
      resolution = 'Datenleck: Beide ziehen 1 Karte.';
      break;
    }
    case 'glitch-absturz':
      if (next.players[playerId].hand.length > 0) {
        const removed = next.players[playerId].hand.pop()!;
        next.piles.discard.push(removed);
        resolution = `Absturz: ${cardLabel(pack, removed.defId)} abgeworfen.`;
      } else {
        next.players[playerId].hp = clampHp(next.players[playerId].hp - 1, ruleset);
        resolution = 'Absturz: Keine Handkarte → −1 Leben.';
      }
      break;
    default:
      resolution = `${glitch.name} ausgeführt.`;
  }

  next.lastEvent = resolution;
  next.instantReveals = [
    ...next.instantReveals,
    {
      playerId,
      instanceId,
      defId: glitch.id,
      name: glitch.name,
      effectText: glitch.effectText,
      resolution,
    },
  ];
  return checkWinner(next);
}

function drawOneResolvingInstant(
  state: GameState,
  pack: ContentPack | undefined,
  playerId: PlayerId,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  let next = drawForPlayer(state, playerId, 1, rng, ruleset);
  const drawn = next.players[playerId].hand[next.players[playerId].hand.length - 1];
  if (!drawn || !pack) return next;
  const glitch = findGlitchDef(pack, drawn.defId);
  if (glitch?.glitchType === 'instant') {
    next.players[playerId].hand.pop();
    next.piles.discard.push(drawn);
    next = applyInstantGlitch(next, pack, playerId, glitch, rng, ruleset, drawn.instanceId);
  }
  return next;
}

export function applyElementEffect(
  state: GameState,
  playerId: PlayerId,
  element: Element,
  rng: Rng,
  ruleset: RulesetConfig = DEFAULT_RULESET,
  options?: { targetBoundId?: string; pack?: ContentPack; amountBonus?: number },
): GameState {
  let next = cloneState(state);
  const opponent = opponentOf(playerId);
  const amountBonus = options?.amountBonus ?? 0;

  switch (element) {
    case 'fire': {
      const dmg = capBoostDamage(next, 2 + amountBonus);
      next.players[opponent].hp = clampHp(next.players[opponent].hp - dmg, ruleset);
      next.lastEvent = `Feuer: ${dmg} Schaden.`;
      break;
    }
    case 'water': {
      next = applyHealAmount(next, playerId, 2 + amountBonus, ruleset);
      next.lastEvent = 'Wasser: geheilt.';
      break;
    }
    case 'earth': {
      const targetId = options?.targetBoundId ?? next.players[playerId].bound[0]?.instanceId;
      const bound = next.players[playerId].bound.find((b) => b.instanceId === targetId);
      if (bound) {
        bound.resistanceBonus += 2 + amountBonus;
        next.lastEvent = 'Erde: +2 Widerstand auf gebaute Karte.';
      } else {
        next.lastEvent = 'Erde: Keine gebaute Karte — kein Effekt.';
      }
      break;
    }
    case 'air': {
      const beforeReveals = next.instantReveals.length;
      next = drawOneResolvingInstant(next, options?.pack, playerId, rng, ruleset);
      if (next.winner) return next;
      next = drawOneResolvingInstant(next, options?.pack, playerId, rng, ruleset);
      if (next.winner) return next;
      const newReveals = next.instantReveals.slice(beforeReveals);
      const revealNote =
        newReveals.length > 0
          ? ` Sofort-Glitch: ${newReveals.map((r) => r.resolution).join(' ')}`
          : '';
      if (next.players[playerId].hand.length === 0) {
        next.lastEvent = `Luft: 2 gezogen.${revealNote} Keine Handkarte zum Abwerfen.`.trim();
        break;
      }
      next.pendingChoice = { type: 'must-discard', playerId, source: 'air' };
      next.lastEvent = `Luft: 2 Karten gezogen.${revealNote} — wähle 1 zum Abwerfen.`.trim();
      break;
    }
    case 'shadow': {
      if (next.players[opponent].hand.length > 0) {
        const removed = next.players[opponent].hand.pop()!;
        next.piles.discard.push(removed);
        next.lastEvent = 'Schatten: Gegner wirft 1 Karte ab.';
      } else {
        next.lastEvent = 'Schatten: Gegner hat keine Handkarten.';
      }
      break;
    }
    case 'light': {
      next = drawForPlayer(next, playerId, 1, rng, ruleset);
      next = applyHealAmount(next, playerId, 1 + amountBonus, ruleset);
      next.lastEvent = 'Licht: 1 Karte gezogen, geheilt.';
      break;
    }
  }

  return checkWinner(next);
}

export function applyBoundActivation(
  state: GameState,
  playerId: PlayerId,
  boundInstanceId: string,
  element: Element,
  rng: Rng,
  ruleset: RulesetConfig = DEFAULT_RULESET,
  pack?: ContentPack,
): GameState {
  let next = cloneState(state);
  const bound = next.players[playerId].bound.find((b) => b.instanceId === boundInstanceId);
  if (!bound || bound.exhausted) throw new Error('Bound card not activatable');
  if (next.meta.activationLockedBoundId === boundInstanceId) {
    throw new Error('Bound card activation locked (Systemfehler)');
  }

  bound.exhausted = true;

  if (element === 'shadow') {
    const opp = opponentOf(playerId);
    const oppBound =
      next.players[opp].bound.find((b) => !b.exhausted) ?? next.players[opp].bound[0];
    if (oppBound) {
      oppBound.exhausted = true;
      next.lastEvent = 'Schatten-Aktivierung: Gegnerische Karte erschöpft.';
    } else {
      next.lastEvent = 'Schatten-Aktivierung: Keine gegnerische gebaute Karte.';
    }
    return checkWinner(next);
  }

  return applyElementEffect(next, playerId, element, rng, ruleset, {
    targetBoundId: boundInstanceId,
    pack,
  });
}

export function finishMainAction(state: GameState, message?: string): GameState {
  const next = cloneState(state);
  if (next.pendingChoice) {
    if (message) next.lastEvent = message;
    return next;
  }
  next.phase = 'end';
  if (message) next.lastEvent = message;
  return next;
}

/** Finish main action then V3 Brennen tick for the acting player. */
export function finishMainActionWithTicks(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
  message?: string,
): GameState {
  let next = finishMainAction(state, message);
  if (next.pendingChoice) return next;
  return tickBrennenAfterMainAction(next, playerId, ruleset);
}

