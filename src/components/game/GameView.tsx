/**
 * Main playable game view — solo vs heuristic bot (orchestration only).
 * Location: src/components/game/GameView.tsx
 */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  BASE_PACK,
  createGame,
  applyAction,
  runBotTurn,
  rollD6,
  rulesetFromState,
  type GameState,
  type GameAction,
  type PlayerId,
  pickOpponentCharacter,
  createSeededRng,
} from '../../game';
import { GameSetup } from './GameSetup';
import { GrungeAppShell } from '../ui/GrungeAppShell';
import { PhaseCoachBanner } from './PhaseCoachBanner';
import { buildPhaseCoachHint } from './phaseCoachHint';
import { PlaymatBoard } from './PlaymatBoard';
import { MatchIntro } from './MatchIntro';
import { buildGameViewModel } from './buildGameViewModel';
import type { PendingIntent } from './gameActionHelpers';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ScrollText } from 'lucide-react';
import { isPlaytestMode } from '../../services/playtest/isPlaytestMode';
import { PlaytestCheatbox } from './PlaytestCheatbox';
import { playStinger, playStingerSequence, unlockAudio } from '../../services/audio/combatStingers';
import { usePresentationQueue } from './presentation';
import {
  buildOpeningDealSteps,
  fullDealRevealCounts,
  isOpeningDealStep,
  buildDrawCardStep,
  isDrawCardStep,
  findNewlyDrawnCard,
  buildBindSnapStep,
  isBindSnapStep,
  findNewlyBoundCardIds,
  BIND_SNAP_MS,
  buildActivateDiscardStep,
  isActivateDiscardStep,
  findActivatedDiscardCardId,
  ACTIVATE_DISCARD_MS,
} from './presentation';

const HUMAN: PlayerId = 'p1';
const BOT: PlayerId = 'p2';
const pack = BASE_PACK;

export function GameView() {
  const playtestMode = isPlaytestMode();
  const [state, setState] = useState<GameState | null>(null);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<PendingIntent | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [introOpen, setIntroOpen] = useState(false);
  const [botPaused, setBotPaused] = useState(false);
  const botRunning = useRef(false);
  const botPausedRef = useRef(false);
  const openingDealRunRef = useRef(false);
  const openingDealCompleteRef = useRef(false);
  const prevStateRef = useRef<GameState | null>(null);
  const stateRef = useRef<GameState | null>(null);
  const [dealReveal, setDealReveal] = useState<Record<PlayerId, number>>({ p1: 0, p2: 0 });
  const [heldBackHandCards, setHeldBackHandCards] = useState<Partial<Record<PlayerId, string>>>({});
  const [snapBoundCardIds, setSnapBoundCardIds] = useState<string[]>([]);
  const [activateDiscardId, setActivateDiscardId] = useState<string | null>(null);
  const [openingDealStarted, setOpeningDealStarted] = useState(false);
  const [openingDealFinished, setOpeningDealFinished] = useState(false);

  const presentation = usePresentationQueue({
    onStepComplete: (step) => {
      if (isOpeningDealStep(step)) {
        const playerId = step.payload?.playerId as PlayerId | undefined;
        if (!playerId) return;
        setDealReveal((prev) => ({ ...prev, [playerId]: prev[playerId] + 1 }));
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
      if (isBindSnapStep(step)) {
        const cardInstanceId = step.payload?.cardInstanceId as string | undefined;
        if (cardInstanceId) {
          const idToRemove = cardInstanceId;
          window.setTimeout(() => {
            setSnapBoundCardIds((prev) => prev.filter((id) => id !== idToRemove));
          }, BIND_SNAP_MS);
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
      if (isActivateDiscardStep(step)) {
        setActivateDiscardId(null);
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
    (playerId: PlayerId, cardInstanceId: string, locksInput: boolean) => {
      setHeldBackHandCards((prev) => ({ ...prev, [playerId]: cardInstanceId }));
      presentation.enqueue(buildDrawCardStep(playerId, cardInstanceId, { locksInput }));
    },
    [presentation.enqueue],
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    botPausedRef.current = botPaused;
  }, [botPaused]);

  useEffect(() => {
    if (introOpen || !state || openingDealRunRef.current) return;

    openingDealRunRef.current = true;
    setOpeningDealStarted(true);
    const steps = buildOpeningDealSteps(state);
    if (steps.length === 0) {
      openingDealCompleteRef.current = true;
      setDealReveal(fullDealRevealCounts(state));
      setOpeningDealFinished(true);
      return;
    }

    setDealReveal({ p1: 0, p2: 0 });
    setOpeningDealFinished(false);
    presentation.enqueue(steps);
  }, [introOpen, state, presentation.enqueue]);

  useEffect(() => {
    if (state?.winner) presentation.flush();
  }, [state?.winner, presentation.flush]);

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

    const humanBoundIds = findNewlyBoundCardIds(prev, state, HUMAN);
    const botBoundIds = findNewlyBoundCardIds(prev, state, BOT);
    const snapSteps = [
      ...humanBoundIds.map((id) => buildBindSnapStep(HUMAN, id)),
      ...botBoundIds.map((id) => buildBindSnapStep(BOT, id)),
    ];
    if (snapSteps.length > 0) {
      setSnapBoundCardIds([...humanBoundIds, ...botBoundIds]);
      presentation.enqueue(snapSteps);
    }

    const humanDiscardId = findActivatedDiscardCardId(prev, state, HUMAN);
    if (humanDiscardId) {
      setActivateDiscardId(humanDiscardId);
      presentation.enqueue(buildActivateDiscardStep(HUMAN, humanDiscardId));
    }
  }, [state, openingDealFinished, scheduleDrawPresentation]);

  const dispatch = useCallback((action: GameAction, playerId: PlayerId = HUMAN) => {
    setState((prev) => {
      if (!prev) return prev;
      try {
        const next = applyAction(prev, action, playerId, {
          pack,
          playerId,
          ruleset: rulesetFromState(prev),
        });
        if (
          action.type === 'PLAY_ATTACK' ||
          action.type === 'PLAY_BLOCK' ||
          action.type === 'CHALLENGE'
        ) {
          setLastRoll(action.diceRoll ?? null);
        }
        setActionError(null);
        return next;
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Aktion fehlgeschlagen.';
        setActionError(message);
        return prev;
      }
    });
  }, []);

  useEffect(() => {
    if (!state || state.winner || botRunning.current) return;
    if (presentation.isInputLocked) return;
    if (playtestMode && botPausedRef.current) return;

    const needsBot =
      (state.activePlayer === BOT && !state.combat) ||
      state.combat?.defenderId === BOT;

    if (!needsBot) return;

    botRunning.current = true;
    const timer = setTimeout(() => {
      setState((prev) => {
        if (!prev) return prev;
        let next = prev;
        if (prev.combat?.defenderId === BOT) {
          next = runBotTurn(prev, pack, 1);
        } else if (prev.activePlayer === BOT) {
          next = runBotTurn(prev, pack);
        }
        botRunning.current = false;
        return next;
      });
      setPendingIntent(null);
    }, 600);

    return () => {
      clearTimeout(timer);
      botRunning.current = false;
    };
  }, [state, playtestMode, presentation.isInputLocked]);

  useEffect(() => {
    setPendingIntent(null);
  }, [state?.phase, state?.activePlayer, state?.combat?.attackValue]);

  // Combat SFX stingers — fire on combat state transitions.
  const prevCombatRef = useRef<GameState['combat']>(null);
  const prevEventRef = useRef<string | null>(null);
  useEffect(() => {
    if (!state) return;

    const prevCombat = prevCombatRef.current;
    const combatStarted = !prevCombat && state.combat;
    if (combatStarted) {
      playStinger('play');
    }
    prevCombatRef.current = state.combat;

    const prevEvent = prevEventRef.current;
    if (state.lastEvent && state.lastEvent !== prevEvent) {
      if (state.lastEvent.includes('Block')) {
        if (state.lastEvent.includes('Schaden') || state.lastEvent.includes('zerstört')) {
          playStingerSequence(['block', 'damage'], 60);
        } else {
          playStinger('block');
        }
      }
    }
    prevEventRef.current = state.lastEvent;
  }, [state]);

  const view = useMemo(
    () => (state ? buildGameViewModel(state, pack, HUMAN, pendingIntent) : null),
    [state, pendingIntent],
  );

  const playAttack = useCallback(
    (instanceId: string) => {
      if (presentation.isInputLocked) return;
      const roll = rollD6();
      setLastRoll(roll);
      dispatch({ type: 'PLAY_ATTACK', cardInstanceId: instanceId, diceRoll: roll }, HUMAN);
      setPendingIntent(null);
    },
    [dispatch, presentation.isInputLocked],
  );

  const playChallenge = useCallback(
    (attackInstanceId: string, targetBoundInstanceId: string) => {
      if (presentation.isInputLocked) return;
      const roll = rollD6();
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
    [dispatch, presentation.isInputLocked],
  );

  const playBlock = useCallback(
    (instanceId: string) => {
      if (presentation.isInputLocked) return;
      const roll = rollD6();
      setLastRoll(roll);
      dispatch({ type: 'PLAY_BLOCK', cardInstanceId: instanceId, diceRoll: roll }, HUMAN);
      setPendingIntent(null);
    },
    [dispatch, presentation.isInputLocked],
  );

  const handleDispatch = useCallback(
    (action: GameAction) => {
      if (presentation.isInputLocked) return;

      setState((prev) => {
        if (!prev) return prev;
        try {
          const isHumanDrawPhase =
            action.type === 'ADVANCE_PHASE' &&
            prev.phase === 'draw' &&
            prev.activePlayer === HUMAN;

          const next = applyAction(prev, action, HUMAN, {
            pack,
            playerId: HUMAN,
            ruleset: rulesetFromState(prev),
          });

          if (isHumanDrawPhase) {
            const drawnId = findNewlyDrawnCard(prev, next, HUMAN);
            if (drawnId) {
              queueMicrotask(() => scheduleDrawPresentation(HUMAN, drawnId, true));
            }
          }

          setActionError(null);
          return next;
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Aktion fehlgeschlagen.';
          setActionError(message);
          return prev;
        }
      });
    },
    [presentation.isInputLocked, scheduleDrawPresentation],
  );

  const handleApplyPlaytestState = useCallback((next: GameState) => {
    if (playtestMode) setBotPaused(true);
    setPendingIntent(null);
    setActionError(null);
    setState(next);
  }, [playtestMode]);

  const botWouldAct = state
    ? (state.activePlayer === BOT && !state.winner) || state.combat?.defenderId === BOT
    : false;
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

  if (!state || !view) {
    return (
      <GrungeAppShell>
        <GameSetup
          onStart={({ humanCharacterId }) => {
            unlockAudio();
            setPendingIntent(null);
            setActionError(null);
            openingDealRunRef.current = false;
            openingDealCompleteRef.current = false;
            setOpeningDealStarted(false);
            setOpeningDealFinished(false);
            setDealReveal({ p1: 0, p2: 0 });
            setHeldBackHandCards({});
            prevStateRef.current = null;
            const seed = Date.now();
            const rng = createSeededRng(seed);
            const botCharacterId = pickOpponentCharacter(pack, humanCharacterId, rng);
            setState(
              createGame({
                pack,
                p1CharacterId: humanCharacterId,
                p2CharacterId: botCharacterId,
                startingPlayer: HUMAN,
                seed,
              }),
            );
            setIntroOpen(true);
          }}
        />
      </GrungeAppShell>
    );
  }

  return (
    <GrungeAppShell>
      <div className="flex h-full flex-col overflow-hidden bg-stone-950 text-stone-100">
      <header className="flex-none border-b border-stone-700 bg-stone-900/90 px-3 py-2 sm:px-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-4">
          <PhaseCoachBanner
            currentPhase={state.phase}
            phaseLabel={view.phaseLabel}
            hint={coachHint}
            turnNumber={state.turnNumber}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={<ScrollText className="h-4 w-4" />}
            onClick={() => setLogOpen(!logOpen)}
          >
            {logOpen ? 'Log aus' : 'Log'}
          </Button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <PlaymatBoard
          state={state}
          pack={pack}
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
          activateDiscardId={activateDiscardId}
          activePresentationStep={presentation.activeStep}
          humanPlayerId={HUMAN}
          onDispatch={handleDispatch}
          onPlayAttack={playAttack}
          onPlayChallenge={playChallenge}
          onPlayBlock={playBlock}
          onPendingChange={setPendingIntent}
          onNewGame={() => {
            presentation.flush();
            openingDealRunRef.current = false;
            openingDealCompleteRef.current = false;
            setOpeningDealStarted(false);
            setOpeningDealFinished(false);
            setDealReveal({ p1: 0, p2: 0 });
            setHeldBackHandCards({});
            prevStateRef.current = null;
            setPendingIntent(null);
            setActionError(null);
            setIntroOpen(false);
            setState(null);
          }}
        />

        {introOpen && (
          <MatchIntro
            pack={pack}
            humanCharacterId={state.players[HUMAN].characterId}
            botCharacterId={state.players[BOT].characterId}
            arenaId={state.arena.arenaId}
            arenaName={view.arena?.name}
            d6Variant={state.arena.d6Variant}
            onContinue={() => setIntroOpen(false)}
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
            pack={pack}
            state={state}
            botPaused={botPaused}
            onBotPausedChange={setBotPaused}
            onApplyState={handleApplyPlaytestState}
            onError={setActionError}
          />
        )}
      </div>
      </div>
    </GrungeAppShell>
  );
}
