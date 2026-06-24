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
  type GameState,
  type GameAction,
  type PlayerId,
  pickOpponentCharacter,
  createSeededRng,
} from '../../game';
import { GameSetup } from './GameSetup';
import { GrungeAppShell } from '../ui/GrungeAppShell';
import { PhaseBar } from './PhaseBar';
import { GameBoard } from './GameBoard';
import { MatchIntro } from './MatchIntro';
import { buildGameViewModel } from './buildGameViewModel';
import type { PendingIntent } from './gameActionHelpers';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ScrollText } from 'lucide-react';
import { isPlaytestMode } from '../../services/playtest/isPlaytestMode';
import { PlaytestCheatbox } from './PlaytestCheatbox';
import { usePresentationQueue } from './presentation';

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
  const presentation = usePresentationQueue();

  useEffect(() => {
    botPausedRef.current = botPaused;
  }, [botPaused]);

  useEffect(() => {
    if (state?.winner) presentation.flush();
  }, [state?.winner, presentation.flush]);

  const dispatch = useCallback((action: GameAction, playerId: PlayerId = HUMAN) => {
    setState((prev) => {
      if (!prev) return prev;
      try {
        const next = applyAction(prev, action, playerId, { pack, playerId });
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

  const view = useMemo(
    () => (state ? buildGameViewModel(state, pack, HUMAN, pendingIntent) : null),
    [state, pendingIntent],
  );

  const playAttack = useCallback(
    (instanceId: string) => {
      const roll = rollD6();
      setLastRoll(roll);
      dispatch({ type: 'PLAY_ATTACK', cardInstanceId: instanceId, diceRoll: roll }, HUMAN);
      setPendingIntent(null);
    },
    [dispatch],
  );

  const playChallenge = useCallback(
    (attackInstanceId: string, targetBoundInstanceId: string) => {
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
    [dispatch],
  );

  const playBlock = useCallback(
    (instanceId: string) => {
      const roll = rollD6();
      setLastRoll(roll);
      dispatch({ type: 'PLAY_BLOCK', cardInstanceId: instanceId, diceRoll: roll }, HUMAN);
      setPendingIntent(null);
    },
    [dispatch],
  );

  const handleDispatch = useCallback(
    (action: GameAction) => {
      if (presentation.isInputLocked) return;
      dispatch(action, HUMAN);
    },
    [dispatch, presentation.isInputLocked],
  );

  const handleApplyPlaytestState = useCallback((next: GameState) => {
    if (playtestMode) setBotPaused(true);
    setPendingIntent(null);
    setActionError(null);
    setState(next);
  }, [playtestMode]);

  if (!state || !view) {
    return (
      <GrungeAppShell>
        <GameSetup
          onStart={({ humanCharacterId }) => {
            setPendingIntent(null);
            setActionError(null);
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

  const botWouldAct =
    (state.activePlayer === BOT && !state.winner) || state.combat?.defenderId === BOT;
  const botThinking =
    botRunning.current ||
    (botWouldAct && !(playtestMode && botPaused));

  return (
    <GrungeAppShell>
      <div className="flex h-full flex-col overflow-hidden bg-stone-950 text-stone-100">
      <header className="flex-none border-b border-stone-700 bg-stone-900/90 px-4 py-2">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <PhaseBar current={state.phase} />
            <Badge variant="accent">Runde {state.turnNumber}</Badge>
            <span className="hidden text-xs text-stone-400 sm:inline">{view.phaseLabel}</span>
          </div>
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
        <GameBoard
          state={state}
          pack={pack}
          view={view}
          pending={pendingIntent}
          actionError={actionError}
          lastRoll={lastRoll}
          botThinking={botThinking}
          onDispatch={handleDispatch}
          onPlayAttack={playAttack}
          onPlayChallenge={playChallenge}
          onPlayBlock={playBlock}
          onPendingChange={setPendingIntent}
          onNewGame={() => {
            presentation.flush();
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
