/**
 * Derived UI state for the duel board — legal actions and slot views without duplicating rules.
 * Location: src/components/game/buildGameViewModel.ts
 */
import {
  findElementDef,
  getLegalActions,
  PHASE_LABELS,
  type ContentPack,
  type ElementCardDef,
  type GameAction,
  type GameState,
  type GlitchCardDef,
  type PendingCombat,
  type PlayerId,
} from '../../game';
import type { ArenaCardDef } from '../../game/types';
import type { PendingIntent } from './gameActionHelpers';
import {
  buildRequiresReplace,
  isBuildReplaceTarget,
  isChallengeTargetForAttack,
  isActivateDiscardOption,
} from './gameActionHelpers';

const MAX_BOUND_SLOTS = 4;

export interface BoundSlotView {
  slotIndex: number;
  instanceId: string | null;
  def: ElementCardDef | null;
  exhausted: boolean;
  isActivatable: boolean;
  isTargetable: boolean;
  /** Challenge target currently selected in the footer flow. */
  isChallengeSelected: boolean;
  isReplaceTarget: boolean;
}

export interface HandCardView {
  instanceId: string;
  defId: string;
  def: ElementCardDef | null;
  glitchName: string | null;
  glitchDef: GlitchCardDef | null;
  isPlayable: boolean;
  interaction: 'attack' | 'boost' | 'build' | 'block' | 'discard-draw' | 'activate-discard' | 'play-glitch' | null;
  buildNeedsReplace: boolean;
  isActivateDiscardOption: boolean;
}

export type MainActionVariant = 'primary' | 'secondary' | 'accent' | 'danger';

export interface MainActionView {
  id: string;
  label: string;
  variant: MainActionVariant;
  action: GameAction;
  enabled: boolean;
}

export interface GameViewModel {
  human: PlayerId;
  bot: PlayerId;
  phaseLabel: string;
  isHumanTurn: boolean;
  isHumanDefender: boolean;
  legalActions: GameAction[];
  humanBoundSlots: BoundSlotView[];
  botBoundSlots: BoundSlotView[];
  handCards: HandCardView[];
  availableMainActions: MainActionView[];
  arena: ArenaCardDef | null;
  combat: PendingCombat | null;
}

function arenaDef(pack: ContentPack, arenaId: string): ArenaCardDef | null {
  return pack.arenas.find((a) => a.id === arenaId) ?? null;
}

function buildBoundSlots(
  bound: GameState['players'][PlayerId]['bound'],
  pack: ContentPack,
  legalActions: GameAction[],
  options: {
    forHuman: boolean;
    isHumanTurn: boolean;
    phase: GameState['phase'];
    pending: PendingIntent | null;
  },
): BoundSlotView[] {
  const slots: BoundSlotView[] = [];

  for (let i = 0; i < MAX_BOUND_SLOTS; i++) {
    const card = bound[i] ?? null;
    const def = card ? findElementDef(pack, card.defId) : null;

    const isActivatable =
      options.forHuman &&
      card !== null &&
      legalActions.some(
        (a) => a.type === 'ACTIVATE_BOUND' && a.boundInstanceId === card.instanceId,
      );

    const isTargetable =
      !options.forHuman &&
      card !== null &&
      options.pending?.type === 'attack' &&
      isChallengeTargetForAttack(legalActions, options.pending.attackInstanceId, card.instanceId);

    const isChallengeSelected =
      isTargetable &&
      options.pending?.type === 'attack' &&
      options.pending.targetBoundInstanceId === card?.instanceId;

    const isReplaceTarget =
      options.forHuman &&
      card !== null &&
      options.pending?.type === 'build' &&
      isBuildReplaceTarget(legalActions, options.pending.handInstanceId, card.instanceId);

    slots.push({
      slotIndex: i,
      instanceId: card?.instanceId ?? null,
      def,
      exhausted: card?.exhausted ?? false,
      isActivatable,
      isTargetable,
      isChallengeSelected,
      isReplaceTarget,
    });
  }

  return slots;
}

function handInteraction(
  instanceId: string,
  legalActions: GameAction[],
): HandCardView['interaction'] {
  if (legalActions.some((a) => a.type === 'PLAY_ATTACK' && a.cardInstanceId === instanceId)) {
    return 'attack';
  }
  if (legalActions.some((a) => a.type === 'PLAY_BOOST' && a.cardInstanceId === instanceId)) {
    return 'boost';
  }
  if (legalActions.some((a) => a.type === 'BUILD_CARD' && a.cardInstanceId === instanceId)) {
    return 'build';
  }
  if (legalActions.some((a) => a.type === 'PLAY_BLOCK' && a.cardInstanceId === instanceId)) {
    return 'block';
  }
  // Prefer playing a glitch over the generic discard-to-draw free action.
  if (
    legalActions.some(
      (a) =>
        a.type === 'PLAY_GLITCH' &&
        a.glitchInstanceId === instanceId &&
        !a.discardHandInstanceId &&
        !a.targetBoundInstanceId,
    )
  ) {
    return 'play-glitch';
  }
  if (
    legalActions.some(
      (a) =>
        (a.type === 'DISCARD_DRAW' && a.discardInstanceId === instanceId) ||
        (a.type === 'RESOLVE_DRAW_DISCARD' && a.discardInstanceId === instanceId),
    )
  ) {
    return 'discard-draw';
  }
  return null;
}

function buildMainActions(
  state: GameState,
  legalActions: GameAction[],
  isHumanTurn: boolean,
  isHumanDefender: boolean,
): MainActionView[] {
  if (state.winner || !isHumanTurn || isHumanDefender) return [];

  const actions: MainActionView[] = [];

  if (state.phase === 'start' && legalActions.some((a) => a.type === 'ADVANCE_PHASE')) {
    actions.push({
      id: 'advance-start',
      label: 'Zug starten',
      variant: 'primary',
      action: { type: 'ADVANCE_PHASE' },
      enabled: true,
    });
  }

  if (state.phase === 'draw' && legalActions.some((a) => a.type === 'ADVANCE_PHASE')) {
    actions.push({
      id: 'draw',
      label: 'Karte ziehen',
      variant: 'primary',
      action: { type: 'ADVANCE_PHASE' },
      enabled: true,
    });
  }

  // Build phase → BuildPhaseBar in the footer.
  // Action-phase attack / ultimate / skip → ActionPhaseBar in the footer.

  if (state.phase === 'end' && legalActions.some((a) => a.type === 'END_TURN')) {
    actions.push({
      id: 'finish-turn',
      label: 'Zug beenden',
      variant: 'primary',
      action: { type: 'END_TURN' },
      enabled: true,
    });
  }

  return actions;
}

export function buildGameViewModel(
  state: GameState,
  pack: ContentPack,
  humanId: PlayerId,
  pending: PendingIntent | null = null,
): GameViewModel {
  const botId: PlayerId = humanId === 'p1' ? 'p2' : 'p1';
  const legalActions = getLegalActions(state, { pack, playerId: humanId });
  const isHumanTurn = state.activePlayer === humanId && !state.winner;
  const isHumanDefender = state.combat?.defenderId === humanId;

  const handCards: HandCardView[] = state.players[humanId].hand.map((card) => {
    const def = findElementDef(pack, card.defId);
    const glitch = def ? null : (pack.glitches.find((g) => g.id === card.defId) ?? null);
    const interaction = handInteraction(card.instanceId, legalActions);
    const buildNeedsReplace =
      interaction === 'build' && buildRequiresReplace(legalActions, card.instanceId);
    const activateDiscard =
      pending?.type === 'activate' &&
      isActivateDiscardOption(legalActions, pending.boundInstanceId, card.instanceId);

    // Build phase: hand cards only become playable after "Engine bauen".
    // Action phase: hand action cards only after "Aktion spielen" (action-select / attack).
    const buildModeOpen = pending?.type === 'build-select' || pending?.type === 'build';
    const actionModeOpen = pending?.type === 'action-select' || pending?.type === 'attack';
    const isActionHandPlay =
      interaction === 'attack' || interaction === 'boost' || interaction === 'play-glitch';

    let isPlayable = false;
    if (state.phase === 'build' && isHumanTurn) {
      isPlayable = buildModeOpen && interaction === 'build';
    } else if (state.phase === 'action' && isHumanTurn && !isHumanDefender) {
      isPlayable = actionModeOpen && isActionHandPlay;
    } else {
      isPlayable = Boolean(
        interaction !== null ||
          activateDiscard ||
          (pending?.type === 'activate' && activateDiscard),
      );
    }

    return {
      instanceId: card.instanceId,
      defId: card.defId,
      def,
      glitchName: glitch?.name ?? null,
      glitchDef: glitch,
      isPlayable,
      interaction: activateDiscard ? 'activate-discard' : interaction,
      buildNeedsReplace,
      isActivateDiscardOption: activateDiscard,
    };
  });

  return {
    human: humanId,
    bot: botId,
    phaseLabel: PHASE_LABELS[state.phase] ?? state.phase,
    isHumanTurn,
    isHumanDefender,
    legalActions,
    humanBoundSlots: buildBoundSlots(state.players[humanId].bound, pack, legalActions, {
      forHuman: true,
      isHumanTurn,
      phase: state.phase,
      pending,
    }),
    botBoundSlots: buildBoundSlots(state.players[botId].bound, pack, legalActions, {
      forHuman: false,
      isHumanTurn,
      phase: state.phase,
      pending,
    }),
    handCards,
    availableMainActions: buildMainActions(state, legalActions, isHumanTurn, isHumanDefender),
    arena: arenaDef(pack, state.arena.arenaId),
    combat: state.combat,
  };
}
