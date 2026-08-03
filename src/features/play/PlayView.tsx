/**
 * Main playable game view — solo vs heuristic or LLM bot (orchestration only).
 * Location: src/features/play/PlayView.tsx
 */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  BASE_PACK,
  P100_RULESET,
  V3_RULESET,
  V5_PACK_RULESET,
  createGame,
  applyAction,
  chooseBotAction,
  botNeedsToAct,
  rollD6,
  rulesetFromState,
  isV5FormulaEnabled,
  isV6FormulaEnabled,
  planFormulaActivation,
  type GameState,
  type GameAction,
  type PlayerId,
  type ContentPack,
  pickOpponentCharacter,
  createSeededRng,
} from '../../game';
import { chooseLlmBotAction } from './services/bot/chooseLlmBotAction';
import { ReactionPickModal } from './board/ReactionPickModal';
import { PassiveChoiceModal } from './board/PassiveChoiceModal';
import { CombatFeedbackToasts } from './board/CombatFeedbackToasts';
import type { BotDecisionSource } from './services/bot/chooseLlmBotAction';
import {
  GameSetup,
  DEFAULT_SETUP_CHARACTER_ID,
  type GameSetupPhase,
} from './setup/GameSetup';
import { resolveGamePackChoice } from './setup/resolveGamePackChoice';
import { GrungeAppShell } from '../../components/ui/GrungeAppShell';
import { PhaseCoachBanner } from './board/PhaseCoachBanner';
import { PhaseCoachFooter, FOOTER_REVEAL_TOTAL_MS } from './board/PhaseCoachFooter';
import { TurnStartAnnounce } from './board/TurnStartAnnounce';
import { buildPhaseCoachHint } from './board/phaseCoachHint';
import { buildV3HookSurface } from './board/v3HookSurface';
import { ActionBar } from './board/ActionBar';
import { ActionPhaseBar, actionPhaseLegalFlags } from './board/ActionPhaseBar';
import { BuildPhaseBar } from './board/BuildPhaseBar';
import { V6FormulaActivationPreview } from './board/V6FormulaActivationPreview';
import { formatV6FormulaPlanPreview } from './presentation/v6FormulaPlanPreview';
import { PlaymatBoard } from './board/PlaymatBoard';
import { MatchIntro } from './setup/MatchIntro';
import { buildGameViewModel } from './board/buildGameViewModel';
import type { PendingIntent } from './board/gameActionHelpers';
import { formulaChallengeTargetIds } from './board/gameActionHelpers';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ScrollText } from 'lucide-react';
import { isPlaytestMode } from './services/playtest/isPlaytestMode';
import { PlaytestCheatbox } from './PlaytestCheatbox';
import {
  MVP_DEMO_RECIPE,
  hydrateEngineSnapshotCache,
  recipeHasRegistryAsset,
} from './engine3d';
import { boundToRecipe, validateRecipe } from '../../game/engine/engineRecipe';
import { audioManager } from '../../services/audio/audioManager';
import { isBattleMusicActive } from '../../services/audio/MusicBedSync';
import {
  playCombatAttack,
  playCombatBlock,
  playDiceRoll,
  playDiceSettle,
  playInvalidAction,
  playMatchOutcome,
  playPresentationStepStart,
} from './audio/playSfxBridge';
import { W6_DIE_ROLL_MS } from './board/W6Die3D';
import { usePresentationQueue } from './presentation';
import {
  buildOpeningDealSteps,
  fullDealRevealCounts,
  isOpeningDealStep,
  openingDealBeats,
  buildDrawCardStep,
  isDrawCardStep,
  findNewlyDrawnCard,
  buildBuildSnapStep,
  isBuildSnapStep,
  findNewlyBuiltCardIds,
  BUILD_SNAP_MS,
  BUILD_FLY_MS,
  buildActivateDiscardStep,
  isActivateDiscardStep,
  findActivatedDiscardCardId,
  ACTIVATE_DISCARD_MS,
  buildAttackCardFlyStep,
  isAttackCardFlyStep,
  findRemovedAttackCard,
  ATTACK_CARD_FLY_MS,
  buildInstantGlitchRevealSteps,
  buildDamageHitSteps,
  buildCombatResolveSnapshot,
  buildCombatResolveStep,
} from './presentation';
import { useAppHistory } from '../../services/history/AppHistoryContext';

const HUMAN: PlayerId = 'p1';
const BOT: PlayerId = 'p2';
const BOT_MODE_KEY = 'letzfetz-bot-mode';

type BotMode = 'heuristic' | 'llm';

function readBotMode(): BotMode {
  try {
    return localStorage.getItem(BOT_MODE_KEY) === 'llm' ? 'llm' : 'heuristic';
  } catch {
    return 'heuristic';
  }
}

interface PlayViewProps {
  /** True only when match is on the board after MatchIntro continues (Iron Surge). */
  onBattleMusicActiveChange?: (active: boolean) => void;
}

export function PlayView({ onBattleMusicActiveChange }: PlayViewProps) {
  const playtestMode = isPlaytestMode();
  const { push } = useAppHistory();
  const [matchPack, setMatchPack] = useState<ContentPack>(BASE_PACK);
  const [state, setState] = useState<GameState | null>(null);
  const [setupPhase, setSetupPhase] = useState<GameSetupPhase>('mode');
  const [setupSelectedId, setSetupSelectedId] = useState(DEFAULT_SETUP_CHARACTER_ID);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<PendingIntent | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [introOpen, setIntroOpen] = useState(false);
  const [botPaused, setBotPaused] = useState(false);
  /** Playtest: force MVP×3 Live-3D in board Engine-Zone. */
  const [enginePreviewMvp, setEnginePreviewMvp] = useState(false);
  /** Remount/refresh board thumbs after auto snapshot warmup. */
  const [engineSnapshotEpoch, setEngineSnapshotEpoch] = useState(0);
  const [botMode, setBotMode] = useState<BotMode>(readBotMode);
  const [botReason, setBotReason] = useState<string | null>(null);
  const [botSource, setBotSource] = useState<BotDecisionSource | null>(null);
  const botRunning = useRef(false);
  const botPausedRef = useRef(false);
  const botModeRef = useRef<BotMode>(botMode);
  const matchSeedRef = useRef(0);
  const openingDealRunRef = useRef(false);
  const openingDealCompleteRef = useRef(false);
  const prevStateRef = useRef<GameState | null>(null);
  const stateRef = useRef<GameState | null>(null);
  const [dealReveal, setDealReveal] = useState<Record<PlayerId, number>>({ p1: 0, p2: 0 });
  const [heldBackHandCards, setHeldBackHandCards] = useState<Partial<Record<PlayerId, string>>>({});
  const [snapBoundCardIds, setSnapBoundCardIds] = useState<string[]>([]);
  /** Bound cards still mid-flight (hidden in slot until impact). */
  const [flyingBuildCardIds, setFlyingBuildCardIds] = useState<string[]>([]);
  const [activateDiscardId, setActivateDiscardId] = useState<string | null>(null);
  const [hiddenAttackCardId, setHiddenAttackCardId] = useState<string | null>(null);
  const [openingDealStarted, setOpeningDealStarted] = useState(false);
  const [openingDealFinished, setOpeningDealFinished] = useState(false);
  /** After deal: show "Du beginnst" / "Gegner beginnt", then materialize footer. */
  const [turnStartAnnounceDone, setTurnStartAnnounceDone] = useState(false);
  const coachFooterReveal = turnStartAnnounceDone;

  const presentation = usePresentationQueue({
    onStepStart: (step) => {
      playPresentationStepStart(step);
    },
    onStepComplete: (step) => {
      if (isOpeningDealStep(step)) {
        const beats = openingDealBeats(step);
        if (beats.length === 0) return;
        setDealReveal((prev) => {
          const next = { ...prev };
          for (const beat of beats) {
            next[beat.playerId] = (next[beat.playerId] ?? 0) + 1;
          }
          return next;
        });
        return;
      }
      if (isDrawCardStep(step)) {
        const playerId = step.payload?.playerId as PlayerId | undefined;
        const cardInstanceId = step.payload?.cardInstanceId as string | undefined;
        if (!playerId || !cardInstanceId) return;
        setHeldBackHandCards((prev) => {
          if (prev[playerId] !== cardInstanceId) return prev;
          const next = { ...prev };
          delete next[playerId];
          return next;
        });
      }
      if (isBuildSnapStep(step)) {
        const cardInstanceId = step.payload?.cardInstanceId as string | undefined;
        if (cardInstanceId) {
          const idToRemove = cardInstanceId;
          window.setTimeout(() => {
            setFlyingBuildCardIds((prev) => prev.filter((id) => id !== idToRemove));
          }, BUILD_FLY_MS);
          window.setTimeout(() => {
            setSnapBoundCardIds((prev) => prev.filter((id) => id !== idToRemove));
          }, BUILD_SNAP_MS);
        }
      }
      if (isActivateDiscardStep(step)) {
        const cardInstanceId = step.payload?.cardInstanceId as string | undefined;
        if (cardInstanceId) {
          window.setTimeout(() => {
            setActivateDiscardId((prev) => (prev === cardInstanceId ? null : prev));
          }, ACTIVATE_DISCARD_MS);
        }
      }
      if (isAttackCardFlyStep(step)) {
        const cardInstanceId = step.payload?.cardInstanceId as string | undefined;
        if (cardInstanceId) {
          window.setTimeout(() => {
            setHiddenAttackCardId((prev) => (prev === cardInstanceId ? null : prev));
          }, ATTACK_CARD_FLY_MS);
        }
      }
    },
    onQueueIdle: () => {
      if (openingDealRunRef.current && !openingDealCompleteRef.current) {
        openingDealCompleteRef.current = true;
        const current = stateRef.current;
        if (current) setDealReveal(fullDealRevealCounts(current));
        setOpeningDealFinished(true);
      }
      setHeldBackHandCards({});
    },
  });

  const scheduleDrawPresentation = useCallback(
    (
      playerId: PlayerId,
      cardInstanceId: string,
      locksInput: boolean,
      cardDefId?: string,
    ) => {
      const current = stateRef.current;
      const drawn =
        cardDefId != null
          ? undefined
          : current?.players[playerId].hand.find((c) => c.instanceId === cardInstanceId);
      const resolvedDefId = cardDefId ?? drawn?.defId;
      const faceUp = locksInput && playerId === HUMAN && Boolean(resolvedDefId);
      setHeldBackHandCards((prev) => ({ ...prev, [playerId]: cardInstanceId }));
      presentation.enqueue(
        buildDrawCardStep(playerId, cardInstanceId, {
          locksInput,
          cardDefId: resolvedDefId,
          faceUp,
        }),
      );
    },
    [presentation.enqueue],
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let cancelled = false;
    void hydrateEngineSnapshotCache().then((count) => {
      if (!cancelled && count > 0) {
        setEngineSnapshotEpoch((n) => n + 1);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasGameState = state != null;
  useEffect(() => {
    onBattleMusicActiveChange?.(isBattleMusicActive(hasGameState, introOpen));
  }, [hasGameState, introOpen, onBattleMusicActiveChange]);

  useEffect(() => {
    return () => {
      onBattleMusicActiveChange?.(false);
    };
  }, [onBattleMusicActiveChange]);

  useEffect(() => {
    botPausedRef.current = botPaused;
  }, [botPaused]);

  useEffect(() => {
    botModeRef.current = botMode;
    try {
      localStorage.setItem(BOT_MODE_KEY, botMode);
    } catch {
      /* ignore */
    }
  }, [botMode]);

  useEffect(() => {
    if (introOpen || !state || openingDealRunRef.current) return;

    openingDealRunRef.current = true;
    setOpeningDealStarted(true);
    const steps = buildOpeningDealSteps(state);
    if (steps.length === 0) {
      openingDealCompleteRef.current = true;
      setDealReveal(fullDealRevealCounts(state));
      setOpeningDealFinished(true);
      setTurnStartAnnounceDone(false);
      return;
    }

    setDealReveal({ p1: 0, p2: 0 });
    setOpeningDealFinished(false);
    setTurnStartAnnounceDone(false);
    presentation.enqueue(steps);
  }, [introOpen, state, presentation.enqueue]);

  useEffect(() => {
    if (state?.winner) presentation.flush();
  }, [state?.winner, presentation.flush]);

  useEffect(() => {
    if (!state?.winner) return;
    playMatchOutcome(state.winner === HUMAN);
  }, [state?.winner]);

  useEffect(() => {
    if (!state || !openingDealFinished) {
      prevStateRef.current = state;
      return;
    }

    const prev = prevStateRef.current;
    prevStateRef.current = state;
    if (!prev) return;

    const botDrawnId = findNewlyDrawnCard(prev, state, BOT);
    if (botDrawnId) {
      scheduleDrawPresentation(BOT, botDrawnId, false);
    }

    const humanBoundIds = findNewlyBuiltCardIds(prev, state, HUMAN);
    const botBoundIds = findNewlyBuiltCardIds(prev, state, BOT);
    const toSnapStep = (playerId: PlayerId, id: string) => {
      const bound = state.players[playerId].bound;
      const slotIndex = bound.findIndex((b) => b.instanceId === id);
      const card = bound[slotIndex];
      return buildBuildSnapStep(playerId, id, card?.defId ?? '', Math.max(0, slotIndex));
    };
    const snapSteps = [
      ...humanBoundIds.map((id) => toSnapStep(HUMAN, id)),
      ...botBoundIds.map((id) => toSnapStep(BOT, id)),
    ];
    if (snapSteps.length > 0) {
      const allIds = [...humanBoundIds, ...botBoundIds];
      setSnapBoundCardIds(allIds);
      setFlyingBuildCardIds(allIds);
      presentation.enqueue(snapSteps);
    }

    const humanDiscardId = findActivatedDiscardCardId(prev, state, HUMAN);
    if (humanDiscardId) {
      setActivateDiscardId(humanDiscardId);
      presentation.enqueue(buildActivateDiscardStep(HUMAN, humanDiscardId));
    }

    if (state.instantReveals.length > 0) {
      presentation.enqueue(buildInstantGlitchRevealSteps(state.instantReveals));
    }

    const combatResolve = buildCombatResolveSnapshot(prev, state, matchPack);
    if (combatResolve) {
      presentation.enqueue(buildCombatResolveStep(combatResolve));
    }

    const damageSteps = buildDamageHitSteps(prev, state);
    if (damageSteps.length > 0) {
      presentation.enqueue(damageSteps);
    }

    if (!prev.combat && state.combat) {
      const removed = findRemovedAttackCard(prev, state);
      if (removed) {
        const { instanceId, defId, attackerId } = removed;
        let targetSlotIndex: number | undefined;
        if (state.combat.mode === 'challenge' && state.combat.targetBoundInstanceId) {
          targetSlotIndex = state.players[state.combat.defenderId].bound.findIndex(
            (b) => b.instanceId === state.combat!.targetBoundInstanceId,
          );
        }
        setHiddenAttackCardId(instanceId);
        presentation.enqueue(
          buildAttackCardFlyStep(
            attackerId,
            instanceId,
            defId,
            state.combat.mode === 'challenge' ? 'challenge' : 'direct',
            targetSlotIndex !== undefined && targetSlotIndex >= 0
              ? targetSlotIndex
              : undefined,
          ),
        );
      }
    }
  }, [state, openingDealFinished, scheduleDrawPresentation]);

  const resetPresentationVisuals = useCallback(() => {
    presentation.flush();
    setPendingIntent(null);
    setActionError(null);
    setHeldBackHandCards({});
    setSnapBoundCardIds([]);
    setFlyingBuildCardIds([]);
    setActivateDiscardId(null);
    setHiddenAttackCardId(null);
  }, [presentation]);

  const commitHumanState = useCallback(
    (before: GameState, after: GameState) => {
      push({
        undo: () => {
          botRunning.current = false;
          resetPresentationVisuals();
          setState(before);
        },
        redo: () => {
          botRunning.current = false;
          resetPresentationVisuals();
          setState(after);
        },
      });
    },
    [push, resetPresentationVisuals],
  );

  const dispatch = useCallback(
    (action: GameAction, playerId: PlayerId = HUMAN) => {
      setState((prev) => {
        if (!prev) return prev;
        try {
          const next = applyAction(prev, action, playerId, {
            pack: matchPack,
            playerId,
            ruleset: rulesetFromState(prev),
          });
          if (
            action.type === 'PLAY_ATTACK' ||
            action.type === 'PLAY_BLOCK' ||
            action.type === 'CHALLENGE'
          ) {
            setLastRoll(action.diceRoll ?? null);
            if (playerId === BOT) {
              playDiceRoll();
              window.setTimeout(() => playDiceSettle(), W6_DIE_ROLL_MS);
            }
          }
          setActionError(null);
          if (playerId === HUMAN) {
            const before = prev;
            const after = next;
            queueMicrotask(() => commitHumanState(before, after));
          }
          return next;
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Aktion fehlgeschlagen.';
          playInvalidAction();
          setActionError(message);
          return prev;
        }
      });
    },
    [commitHumanState, matchPack],
  );

  useEffect(() => {
    if (!state || state.winner || botRunning.current) return;
    // Wait for match intro + deal + start announce + footer spectacle before the bot moves.
    if (introOpen || !coachFooterReveal) return;
    if (presentation.isInputLocked) return;
    if (playtestMode && botPausedRef.current) return;
    if (!botNeedsToAct(state, BOT)) return;

    botRunning.current = true;
    let cancelled = false;

    const timer = setTimeout(() => {
      void (async () => {
        const snapshot = stateRef.current;
        if (!snapshot || cancelled) {
          botRunning.current = false;
          return;
        }
        try {
          const decision =
            botModeRef.current === 'llm'
              ? await chooseLlmBotAction(snapshot, matchPack)
              : {
                  action: chooseBotAction(snapshot, matchPack),
                  reason: 'Heuristik',
                  source: 'heuristic' as const,
                };
          if (cancelled) {
            botRunning.current = false;
            return;
          }
          if (!decision.action) {
            botRunning.current = false;
            return;
          }
          setBotReason(decision.reason);
          setBotSource(decision.source);
          setState((prev) => {
            if (!prev) {
              botRunning.current = false;
              return prev;
            }
            try {
              const next = applyAction(prev, decision.action!, BOT, {
                pack: matchPack,
                playerId: BOT,
                ruleset: rulesetFromState(prev),
              });
              botRunning.current = false;
              return next;
            } catch {
              botRunning.current = false;
              return prev;
            }
          });
          setPendingIntent(null);
        } catch {
          botRunning.current = false;
        }
      })();
    }, botModeRef.current === 'llm' ? 200 : Math.max(600, FOOTER_REVEAL_TOTAL_MS + 120));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      botRunning.current = false;
    };
  }, [
    state,
    introOpen,
    coachFooterReveal,
    playtestMode,
    presentation.isInputLocked,
    presentation.activeStep,
    matchPack,
  ]);

  useEffect(() => {
    setPendingIntent(null);
  }, [state?.phase, state?.activePlayer, state?.combat?.attackValue]);

  // Combat SFX — typed IDs via AudioManager (procedural until assets exist).
  const prevCombatRef = useRef<GameState['combat']>(null);
  const prevEventRef = useRef<string | null>(null);
  useEffect(() => {
    if (!state) return;

    const prevCombat = prevCombatRef.current;
    const combatStarted = !prevCombat && state.combat;
    if (combatStarted) {
      playCombatAttack();
    }
    prevCombatRef.current = state.combat;

    const prevEvent = prevEventRef.current;
    if (state.lastEvent && state.lastEvent !== prevEvent) {
      if (state.lastEvent.includes('Block')) {
        const withDamage =
          state.lastEvent.includes('Schaden') || state.lastEvent.includes('zerstört');
        playCombatBlock(withDamage);
      }
    }
    prevEventRef.current = state.lastEvent;
  }, [state]);

  const view = useMemo(
    () => (state ? buildGameViewModel(state, matchPack, HUMAN, pendingIntent) : null),
    [state, pendingIntent, matchPack],
  );

  const matchUsesV5Formula = state
    ? isV5FormulaEnabled(rulesetFromState(state))
    : false;
  const matchUsesFormulaBoard = state
    ? isV5FormulaEnabled(rulesetFromState(state)) ||
      isV6FormulaEnabled(rulesetFromState(state))
    : false;
  const humanBoundRecipe = state ? boundToRecipe(state.players[HUMAN].bound) : null;
  const boundEnginePreviewEligible = Boolean(
    !matchUsesFormulaBoard &&
      humanBoundRecipe &&
      validateRecipe(humanBoundRecipe).active &&
      recipeHasRegistryAsset(humanBoundRecipe),
  );
  /** Live-3D recipe for legacy Bound matches only (soft-retire under V5/V6). */
  const liveEngineRecipe =
    matchUsesFormulaBoard
      ? null
      : enginePreviewMvp
        ? MVP_DEMO_RECIPE
        : boundEnginePreviewEligible && humanBoundRecipe
          ? humanBoundRecipe
          : null;

  const announceDiceRoll = useCallback(() => {
    playDiceRoll();
    window.setTimeout(() => playDiceSettle(), W6_DIE_ROLL_MS);
  }, []);

  const playAttack = useCallback(
    (instanceId: string) => {
      if (presentation.isInputLocked) return;
      const roll = rollD6();
      announceDiceRoll();
      setLastRoll(roll);
      dispatch({ type: 'PLAY_ATTACK', cardInstanceId: instanceId, diceRoll: roll }, HUMAN);
      setPendingIntent(null);
    },
    [announceDiceRoll, dispatch, presentation.isInputLocked],
  );

  const playChallenge = useCallback(
    (attackInstanceId: string, targetBoundInstanceId: string) => {
      if (presentation.isInputLocked) return;
      const roll = rollD6();
      announceDiceRoll();
      setLastRoll(roll);
      dispatch(
        {
          type: 'CHALLENGE',
          attackCardInstanceId: attackInstanceId,
          targetBoundInstanceId,
          diceRoll: roll,
        },
        HUMAN,
      );
      setPendingIntent(null);
    },
    [announceDiceRoll, dispatch, presentation.isInputLocked],
  );

  const playBlock = useCallback(
    (instanceId: string) => {
      if (presentation.isInputLocked) return;
      const roll = rollD6();
      announceDiceRoll();
      setLastRoll(roll);
      dispatch({ type: 'PLAY_BLOCK', cardInstanceId: instanceId, diceRoll: roll }, HUMAN);
      setPendingIntent(null);
    },
    [announceDiceRoll, dispatch, presentation.isInputLocked],
  );

  const handleDispatch = useCallback(
    (action: GameAction) => {
      // Reaction pick must stay available even if presentation locks other inputs.
      if (presentation.isInputLocked && action.type !== 'PICK_REACTION') return;

      setState((prev) => {
        if (!prev) return prev;
        try {
          const isHumanDrawPhase =
            action.type === 'ADVANCE_PHASE' &&
            prev.phase === 'draw' &&
            prev.activePlayer === HUMAN;

          const next = applyAction(prev, action, HUMAN, {
            pack: matchPack,
            playerId: HUMAN,
            ruleset: rulesetFromState(prev),
          });
          // Keep ref in sync before microtasks — effects run only after paint.
          stateRef.current = next;

          if (isHumanDrawPhase) {
            const drawnId = findNewlyDrawnCard(prev, next, HUMAN);
            if (drawnId) {
              const defId = next.players[HUMAN].hand.find((c) => c.instanceId === drawnId)?.defId;
              queueMicrotask(() =>
                scheduleDrawPresentation(HUMAN, drawnId, true, defId),
              );
            }
          }

          setActionError(null);
          const before = prev;
          const after = next;
          queueMicrotask(() => commitHumanState(before, after));
          return next;
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Aktion fehlgeschlagen.';
          playInvalidAction();
          setActionError(message);
          return prev;
        }
      });
    },
    [presentation.isInputLocked, scheduleDrawPresentation, commitHumanState, matchPack],
  );

  const handleApplyPlaytestState = useCallback((next: GameState) => {
    if (playtestMode) setBotPaused(true);
    setPendingIntent(null);
    setActionError(null);
    setState(next);
  }, [playtestMode]);

  const botWouldAct = state ? botNeedsToAct(state, BOT) : false;
  const botThinking =
    botRunning.current || (botWouldAct && !(playtestMode && botPaused));

  const openingDealActive = openingDealStarted && !openingDealFinished;

  const coachHint = useMemo(() => {
    if (!state || !view) return '';
    return buildPhaseCoachHint({
      state,
      view,
      pending: pendingIntent,
      botThinking,
    });
  }, [state, view, pendingIntent, botThinking]);

  const v3HookChips = useMemo(() => {
    if (!state) return [];
    return buildV3HookSurface(state, matchPack, HUMAN);
  }, [state, matchPack]);

  if (!state || !view) {
    return (
      <GrungeAppShell>
        <GameSetup
          phase={setupPhase}
          selectedId={setupSelectedId}
          onPhaseChange={setSetupPhase}
          onSelectCharacter={setSetupSelectedId}
          onStart={({ humanCharacterId, packChoice }) => {
            audioManager.unlock();
            setPendingIntent(null);
            setActionError(null);
            openingDealRunRef.current = false;
            openingDealCompleteRef.current = false;
            setOpeningDealStarted(false);
            setOpeningDealFinished(false);
            setTurnStartAnnounceDone(false);
            setDealReveal({ p1: 0, p2: 0 });
            setHeldBackHandCards({});
            prevStateRef.current = null;
            const { pack: selectedPack, ruleset, playtestHpCap } = resolveGamePackChoice(packChoice);
            setMatchPack(selectedPack);
            const seed = Date.now();
            matchSeedRef.current = seed;
            const rng = createSeededRng(seed);
            const botCharacterId = pickOpponentCharacter(selectedPack, humanCharacterId, rng);
            const next = createGame({
              pack: selectedPack,
              p1CharacterId: humanCharacterId,
              p2CharacterId: botCharacterId,
              startingPlayer: HUMAN,
              ruleset,
              seed,
            });
            if (playtestHpCap !== undefined) {
              next.meta = { ...next.meta, playtestHpCap };
            }
            push({
              undo: () => {
                botRunning.current = false;
                resetPresentationVisuals();
                setIntroOpen(false);
                setState(null);
              },
              redo: () => {
                botRunning.current = false;
                resetPresentationVisuals();
                setState(next);
                setIntroOpen(true);
              },
            });
            setState(next);
            setIntroOpen(true);
          }}
        />
      </GrungeAppShell>
    );
  }

  return (
    <GrungeAppShell>
      <div className="flex h-full flex-col overflow-hidden bg-stone-950 text-stone-100">
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <PlaymatBoard
          state={state}
          pack={matchPack}
          view={view}
          pending={pendingIntent}
          actionError={actionError}
          lastRoll={lastRoll}
          botThinking={botThinking}
          openingDealActive={openingDealActive}
          openingDealFinished={openingDealFinished}
          dealReveal={dealReveal}
          heldBackHandCards={heldBackHandCards}
          snapBoundCardIds={snapBoundCardIds}
          flyingBuildCardIds={flyingBuildCardIds}
          activateDiscardId={activateDiscardId}
          hiddenAttackCardId={hiddenAttackCardId}
          activePresentationStep={presentation.activeStep}
          humanPlayerId={HUMAN}
          liveEngineRecipe={liveEngineRecipe}
          liveSnapshotEpoch={engineSnapshotEpoch}
          onLiveEngineSnapshotWarmed={() => {
            setEngineSnapshotEpoch((n) => n + 1);
          }}
          onDispatch={handleDispatch}
          onPlayAttack={playAttack}
          onPlayChallenge={playChallenge}
          onPlayBlock={playBlock}
          onPendingChange={setPendingIntent}
          onNewGame={() => {
            const prev = state;
            const wasIntro = introOpen;
            presentation.flush();
            openingDealRunRef.current = false;
            openingDealCompleteRef.current = false;
            setOpeningDealStarted(false);
            setOpeningDealFinished(false);
            setTurnStartAnnounceDone(false);
            setDealReveal({ p1: 0, p2: 0 });
            setHeldBackHandCards({});
            prevStateRef.current = null;
            setPendingIntent(null);
            setActionError(null);
            setIntroOpen(false);
            setState(null);
            push({
              undo: () => {
                botRunning.current = false;
                setState(prev);
                setIntroOpen(wasIntro);
              },
              redo: () => {
                botRunning.current = false;
                resetPresentationVisuals();
                setIntroOpen(false);
                setState(null);
              },
            });
          }}
        />

        {introOpen && (
          <MatchIntro
            pack={matchPack}
            humanCharacterId={state.players[HUMAN].characterId}
            botCharacterId={state.players[BOT].characterId}
            arenaId={state.arena.arenaId}
            arenaName={view.arena?.name}
            d6Variant={state.arena.d6Variant}
            onInitiativeResolved={(startingPlayer) => {
              // Rebuild match with decided starter before deal (intro still open).
              openingDealRunRef.current = false;
              openingDealCompleteRef.current = false;
              setOpeningDealStarted(false);
              setOpeningDealFinished(false);
              setTurnStartAnnounceDone(false);
              setDealReveal({ p1: 0, p2: 0 });
              setHeldBackHandCards({});
              prevStateRef.current = null;
              const seed = matchSeedRef.current || Date.now();
              const rebuilt = createGame({
                pack: matchPack,
                p1CharacterId: state.players[HUMAN].characterId,
                p2CharacterId: state.players[BOT].characterId,
                startingPlayer,
                seed,
                arenaId: state.arena.arenaId,
                d6Variant: state.arena.d6Variant,
                ruleset:
                  state.meta.v5FormulaEnabled === true
                    ? V5_PACK_RULESET
                    : state.meta.v3CombatEnabled === true
                      ? V3_RULESET
                      : matchPack.id === 'v2-p100'
                        ? P100_RULESET
                        : undefined,
              });
              if (state.meta.playtestHpCap !== undefined) {
                rebuilt.meta = { ...rebuilt.meta, playtestHpCap: state.meta.playtestHpCap };
              }
              setState(rebuilt);
            }}
            onContinue={() => {
              push({
                undo: () => setIntroOpen(true),
                redo: () => setIntroOpen(false),
              });
              setIntroOpen(false);
            }}
          />
        )}

        {logOpen && (
          <aside className="hidden w-64 flex-none overflow-y-auto border-l border-stone-700 bg-stone-900/80 p-3 lg:block xl:w-72">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Ereignisse
              </span>
              {lastRoll !== null && <Badge variant="info">W6 = {lastRoll}</Badge>}
            </div>
            <div className="space-y-2 text-xs">
              <div className="rounded border border-stone-700 bg-stone-900 p-2 text-stone-200">
                {state.lastEvent || 'Partie gestartet.'}
              </div>
              {view.arena && (
                <div className="rounded border border-stone-700 bg-stone-900 p-2 text-stone-400">
                  Arena: {view.arena.name}
                  <br />
                  Mutation: {state.arena.d6Variant ?? '—'}
                </div>
              )}
            </div>
          </aside>
        )}

        {playtestMode && (
          <PlaytestCheatbox
            pack={matchPack}
            state={state}
            botPaused={botPaused}
            onBotPausedChange={setBotPaused}
            onApplyState={handleApplyPlaytestState}
            onError={setActionError}
            enginePreviewMvp={enginePreviewMvp}
            onEnginePreviewMvpChange={(enabled) => {
              setEnginePreviewMvp(enabled);
            }}
            allowEnginePreviewMvp={!matchUsesV5Formula}
          />
        )}

        <TurnStartAnnounce
          active={openingDealFinished && !turnStartAnnounceDone}
          humanStarts={state.activePlayer === HUMAN}
          onComplete={() => setTurnStartAnnounceDone(true)}
        />
      </div>
      <PhaseCoachFooter
        reveal={coachFooterReveal}
        phases={
          <PhaseCoachBanner
            currentPhase={state.phase}
            phaseLabel={view.phaseLabel}
            hint={coachHint}
            turnNumber={state.turnNumber}
            activePlayerId={state.activePlayer}
            humanPlayerId={HUMAN}
            v3HookChips={v3HookChips}
          />
        }
        actions={
          state.phase === 'action' && view.isHumanTurn && !view.isHumanDefender ? (
            <ActionPhaseBar
              phase={state.phase}
              pending={pendingIntent}
              challengeTargetCount={
                isV5FormulaEnabled(rulesetFromState(state))
                  ? pendingIntent?.type === 'attack'
                    ? formulaChallengeTargetIds(
                        view.legalActions,
                        pendingIntent.attackInstanceId,
                      ).length
                    : 0
                  : view.botBoundSlots.filter((s) => s.isTargetable).length
              }
              {...actionPhaseLegalFlags(view.legalActions)}
              inputLocked={presentation.isInputLocked || !coachFooterReveal}
              v5Formula={isV5FormulaEnabled(rulesetFromState(state))}
              onStartAction={() => setPendingIntent({ type: 'action-select' })}
              onDirectAttack={() => {
                if (pendingIntent?.type !== 'attack') return;
                playAttack(pendingIntent.attackInstanceId);
              }}
              onChallenge={() => {
                if (pendingIntent?.type !== 'attack') return;
                const selected = pendingIntent.targetBoundInstanceId;
                const v5 = isV5FormulaEnabled(rulesetFromState(state));
                const formulaTargets = formulaChallengeTargetIds(
                  view.legalActions,
                  pendingIntent.attackInstanceId,
                );
                const onlyTarget = v5
                  ? formulaTargets
                  : view.botBoundSlots
                      .filter((s) => s.isTargetable)
                      .map((s) => s.instanceId)
                      .filter((id): id is string => Boolean(id));
                const targetId =
                  selected ?? (onlyTarget.length === 1 ? onlyTarget[0] : undefined);
                if (!targetId) return;
                playChallenge(pendingIntent.attackInstanceId, targetId);
              }}
              onCancel={() => setPendingIntent(null)}
              onUltimate={() => {
                handleDispatch({ type: 'PLAY_ULTIMATE' });
                setPendingIntent(null);
              }}
              onSkipMain={() => {
                handleDispatch({ type: 'END_TURN' });
                setPendingIntent(null);
              }}
            />
          ) : state.phase === 'build' && view.isHumanTurn ? (
            <BuildPhaseBar
              canBuild={view.legalActions.some(
                (a) =>
                  a.type === 'BUILD_CARD' ||
                  a.type === 'FORMULA_BUILD' ||
                  a.type === 'FORMULA_REPLACE' ||
                  a.type === 'FORMULA_SCHNELLMIX',
              )}
              canActivateFormula={view.legalActions.some(
                (a) => a.type === 'FORMULA_ACTIVATE',
              )}
              buildModeActive={
                pendingIntent?.type === 'build-select' || pendingIntent?.type === 'build'
              }
              inputLocked={presentation.isInputLocked || !coachFooterReveal}
              formulaBoard={
                isV5FormulaEnabled(rulesetFromState(state)) ||
                isV6FormulaEnabled(rulesetFromState(state))
              }
              previewSlot={(() => {
                if (!isV6FormulaEnabled(rulesetFromState(state))) return null;
                if (!view.legalActions.some((a) => a.type === 'FORMULA_ACTIVATE')) return null;
                try {
                  const plan = planFormulaActivation({
                    state,
                    pack: matchPack,
                    playerId: HUMAN,
                    ruleset: rulesetFromState(state),
                    rng: () => 0.5,
                    asOverformula: false,
                  });
                  return (
                    <V6FormulaActivationPreview lines={formatV6FormulaPlanPreview(plan)} />
                  );
                } catch {
                  return null;
                }
              })()}
              onStartBuild={() => setPendingIntent({ type: 'build-select' })}
              onActivateFormula={() => {
                handleDispatch({ type: 'FORMULA_ACTIVATE' });
                setPendingIntent(null);
              }}
              onSkip={() => {
                handleDispatch({ type: 'SKIP_BUILD' });
                setPendingIntent(null);
              }}
              onCancel={() => setPendingIntent(null)}
            />
          ) : (
            <>
              {pendingIntent && (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={presentation.isInputLocked || !coachFooterReveal}
                  onClick={() => setPendingIntent(null)}
                >
                  Auswahl abbrechen
                </Button>
              )}
              <ActionBar
                actions={view.availableMainActions}
                botThinking={botThinking && !view.isHumanTurn && !view.isHumanDefender}
                onAction={(action) => {
                  handleDispatch(action);
                  setPendingIntent(null);
                }}
              />
            </>
          )
        }
        tools={
          <>
            <label className="flex items-center gap-2 text-xs text-stone-400">
              <span className="hidden sm:inline">Gegner</span>
              <select
                className="rounded-md border border-stone-600 bg-stone-900 px-2.5 py-1.5 text-stone-100"
                value={botMode}
                onChange={(e) => setBotMode(e.target.value === 'llm' ? 'llm' : 'heuristic')}
                aria-label="Gegner-Bot Modus"
              >
                <option value="heuristic">Heuristik</option>
                <option value="llm">LLM (Ollama)</option>
              </select>
            </label>
            <Button
              variant="secondary"
              size="sm"
              icon={<ScrollText className="h-4 w-4" />}
              onClick={() => setLogOpen(!logOpen)}
            >
              {logOpen ? 'Log aus' : 'Log'}
            </Button>
          </>
        }
        status={
          botReason ? (
            <>
              <span className="font-semibold text-stone-300">
                Bot{botSource === 'llm' ? ' (LLM)' : botSource === 'heuristic' ? ' (Heuristik)' : ''}:
              </span>{' '}
              {botReason}
            </>
          ) : undefined
        }
      />
      {state?.pendingChoice?.type === 'pick-reaction' &&
        state.pendingChoice.chooserId === HUMAN && (
          <ReactionPickModal
            open
            options={state.pendingChoice.options}
            onPick={(reactionId) => {
              handleDispatch({ type: 'PICK_REACTION', reactionId });
            }}
          />
        )}
      {state?.pendingChoice?.type === 'pillendoktora-boost' &&
        state.pendingChoice.playerId === HUMAN && (
          <PassiveChoiceModal
            open
            title="Pillendoktora"
            description="Wähle den Boost-Effekt (einmal pro Zug)."
            testId="pillendoktora-choice-modal"
            options={[
              { id: 'draw-lose-hp', labelDe: '1 ziehen, −1 Leben' },
              { id: 'deal-1', labelDe: '1 Schaden' },
              { id: 'heal-1', labelDe: 'Heile 1' },
            ]}
            onPick={(id) => {
              handleDispatch({
                type: 'PICK_PILLENDOKTORA',
                option: id as 'draw-lose-hp' | 'deal-1' | 'heal-1',
              });
            }}
          />
        )}
      {state?.pendingChoice?.type === 'mysterium-element' &&
        state.pendingChoice.playerId === HUMAN && (
          <PassiveChoiceModal
            open
            title="Das Mysterium"
            description="Wähle ein Element für diese Aktion."
            testId="mysterium-choice-modal"
            options={[
              { id: 'fire', labelDe: 'Feuer' },
              { id: 'water', labelDe: 'Wasser' },
              { id: 'earth', labelDe: 'Erde' },
              { id: 'air', labelDe: 'Luft' },
              { id: 'shadow', labelDe: 'Schatten' },
              { id: 'light', labelDe: 'Licht' },
            ]}
            onPick={(id) => {
              handleDispatch({
                type: 'PICK_MYSTERIUM_ELEMENT',
                element: id as
                  | 'fire'
                  | 'water'
                  | 'earth'
                  | 'air'
                  | 'shadow'
                  | 'light',
              });
            }}
          />
        )}
      {state && <CombatFeedbackToasts lastEvent={state.lastEvent} />}
      </div>
    </GrungeAppShell>
  );
}
