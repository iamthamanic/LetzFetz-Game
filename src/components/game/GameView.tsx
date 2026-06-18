/**
 * Main playable game view — solo vs heuristic bot.
 * Location: src/components/game/GameView.tsx
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BASE_PACK,
  createGame,
  applyAction,
  getLegalActions,
  findElementDef,
  runBotTurn,
  rollD6,
  type GameState,
  type GameAction,
  type PlayerId,
} from '../../game';
import { GameSetup } from './GameSetup';
import { PhaseBar } from './PhaseBar';
import { GameCard } from './GameCard';
import { GameCharacterCard } from './GameCharacterCard';
import { characterDefToForgeProps, ultimateDefToForgeProps, arenaDefToForgeProps } from '../cards/characterCardProps';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { Badge } from '../ui/Badge';
import { ScrollText, Heart, Skull, Crown } from 'lucide-react';

const HUMAN: PlayerId = 'p1';
const BOT: PlayerId = 'p2';
const pack = BASE_PACK;

function characterName(id: string): string {
  return pack.characters.find((c) => c.id === id)?.name ?? id;
}

function characterDef(id: string) {
  return pack.characters.find((c) => c.id === id);
}

function ultimateDefForCharacter(id: string) {
  return pack.ultimates.find((u) => u.characterId === id);
}

function arenaName(id: string): string {
  return pack.arenas.find((a) => a.id === id)?.name ?? id;
}

function arenaDef(id: string) {
  return pack.arenas.find((a) => a.id === id);
}

export function GameView() {
  const [state, setState] = useState<GameState | null>(null);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const botRunning = useRef(false);

  const dispatch = useCallback((action: GameAction, playerId: PlayerId = HUMAN) => {
    setState((prev) => {
      if (!prev) return prev;
      try {
        const next = applyAction(prev, action, playerId, { pack, playerId });
        if (action.type === 'PLAY_ATTACK' || action.type === 'PLAY_BLOCK' || action.type === 'CHALLENGE') {
          setLastRoll(action.diceRoll ?? null);
        }
        return next;
      } catch (e) {
        console.error(e);
        return prev;
      }
    });
  }, []);

  useEffect(() => {
    if (!state || state.winner || botRunning.current) return;

    const needsBot =
      (state.activePlayer === BOT && !state.combat) ||
      (state.combat?.defenderId === BOT);

    if (!needsBot) return;

    botRunning.current = true;
    const timer = setTimeout(() => {
      setState((prev) => {
        if (!prev) return prev;
        let next = prev;
        if (prev.combat?.defenderId === BOT) {
          const action = runBotTurn(prev, pack, 1);
          next = action;
        } else if (prev.activePlayer === BOT) {
          next = runBotTurn(prev, pack);
        }
        botRunning.current = false;
        return next;
      });
    }, 600);

    return () => {
      clearTimeout(timer);
      botRunning.current = false;
    };
  }, [state]);

  if (!state) {
    return (
      <GameSetup
        onStart={(characterId) => {
          setState(
            createGame({
              pack,
              p1CharacterId: characterId,
              p2CharacterId: 'schluckspecht',
              startingPlayer: HUMAN,
              seed: Date.now(),
            }),
          );
        }}
      />
    );
  }

  const humanActions = getLegalActions(state, { pack, playerId: HUMAN });
  const isHumanTurn = state.activePlayer === HUMAN && !state.winner;
  const isHumanDefender = state.combat?.defenderId === HUMAN;

  const playAttack = (instanceId: string) => {
    const roll = rollD6();
    setLastRoll(roll);
    dispatch({ type: 'PLAY_ATTACK', cardInstanceId: instanceId, diceRoll: roll }, HUMAN);
  };

  const playChallenge = (attackInstanceId: string, targetBoundInstanceId: string) => {
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
  };

  const playBlock = (instanceId: string) => {
    const roll = rollD6();
    setLastRoll(roll);
    dispatch({ type: 'PLAY_BLOCK', cardInstanceId: instanceId, diceRoll: roll }, HUMAN);
  };

  const humanChar = characterDef(state.players[HUMAN].characterId);
  const botChar = characterDef(state.players[BOT].characterId);
  const arena = arenaDef(state.arena.arenaId);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-stone-950 text-stone-100">
      {/* Top bar */}
      <div className="flex-none border-b border-stone-800 bg-stone-900/80 px-4 py-2">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <PhaseBar current={state.phase} />
            <Badge variant="accent">Runde {state.turnNumber}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {arena && <span className="text-xs text-stone-400">🏟️ {arenaName(state.arena.arenaId)}</span>}
            <Button variant="secondary" size="sm" icon={<ScrollText className="h-4 w-4" />} onClick={() => setLogOpen(!logOpen)}>
              {logOpen ? 'Log ausblenden' : 'Log anzeigen'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Main board */}
        <div className="flex flex-1 flex-col">
          {/* Opponent */}
          <div className="flex-none border-b border-stone-800 bg-stone-900/30 p-3">
            <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {botChar && <GameCharacterCard {...characterDefToForgeProps(botChar)} size="sm" />}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-200">🤖 {characterName(state.players[BOT].characterId)}</span>
                    {state.activePlayer === BOT && !state.winner && <Badge variant="warning">Am Zug</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-red-400">
                    <Heart className="h-4 w-4" />
                    <span className="text-2xl font-bold">{state.players[BOT].hp}</span>
                  </div>
                  <div className="text-xs text-stone-500">Deck {state.piles.deck.length} · Hand {state.players[BOT].hand.length}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {state.players[BOT].bound.map((b) => {
                  const def = findElementDef(pack, b.defId);
                  return def ? <GameCard key={b.instanceId} def={def} exhausted={b.exhausted} /> : null;
                })}
                {state.players[BOT].bound.length === 0 && <span className="text-xs text-stone-600">Keine gebundenen Karten</span>}
              </div>
            </div>
          </div>

          {/* Center */}
          <div className="flex flex-1 items-center justify-center gap-4 p-4">
            {state.winner ? (
              <Panel className="max-w-sm text-center space-y-4">
                <div className="text-4xl">{state.winner === HUMAN ? '🎉' : '😵'}</div>
                <h2 className="text-xl font-bold text-stone-100">
                  {state.winner === HUMAN ? 'Du gewinnst!' : 'Bot gewinnt!'}
                </h2>
                <Button variant="accent" onClick={() => setState(null)} className="w-full">
                  Neue Partie
                </Button>
              </Panel>
            ) : isHumanDefender ? (
              <Panel
                title={state.combat!.mode === 'challenge' ? '🛡️ Herausforderung blocken' : '🛡️ Angriff blocken'}
                className="max-w-xl"
              >
                <p className="mb-3 text-sm text-stone-300">
                  {state.combat!.mode === 'challenge' ? 'Herausforderungswert' : 'Angriffswert'}:{' '}
                  <span className="font-bold text-stone-100">{state.combat!.attackValue}</span>
                </p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {humanActions
                    .filter((a) => a.type === 'PLAY_BLOCK')
                    .map((a) => {
                      if (a.type !== 'PLAY_BLOCK') return null;
                      const card = state.players[HUMAN].hand.find((c) => c.instanceId === a.cardInstanceId);
                      const def = card ? findElementDef(pack, card.defId) : undefined;
                      return def ? (
                        <GameCard key={a.cardInstanceId} def={def} onClick={() => playBlock(a.cardInstanceId)} />
                      ) : null;
                    })}
                </div>
                <Button variant="secondary" onClick={() => dispatch({ type: 'PASS_BLOCK' }, HUMAN)}>
                  Nicht blocken
                </Button>
              </Panel>
            ) : arena ? (
              <GameCharacterCard {...arenaDefToForgeProps(arena)} size="lg" />
            ) : null}
          </div>

          {/* Human */}
          <div className="flex-none border-t border-stone-800 bg-stone-900/30 p-3">
            <div className="mx-auto flex max-w-6xl flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {humanChar && <GameCharacterCard {...characterDefToForgeProps(humanChar)} size="sm" />}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-200">Du — {characterName(state.players[HUMAN].characterId)}</span>
                      {state.activePlayer === HUMAN && !state.winner && <Badge variant="success">Am Zug</Badge>}
                      {state.players[HUMAN].ultimateAvailable && <Badge variant="warning">Ulti bereit</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Heart className="h-4 w-4" />
                      <span className="text-2xl font-bold">{state.players[HUMAN].hp}</span>
                    </div>
                    <div className="text-xs text-stone-500">Deck {state.piles.deck.length} · Ablage {state.piles.discard.length}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {state.players[HUMAN].bound.map((b) => {
                    const def = findElementDef(pack, b.defId);
                    const canActivate =
                      isHumanTurn &&
                      state.phase === 'action' &&
                      !b.exhausted &&
                      state.players[HUMAN].hand.length > 0;
                    return def ? (
                      <div key={b.instanceId} className="flex flex-col items-center gap-1">
                        <GameCard def={def} exhausted={b.exhausted} />
                        {canActivate && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-[10px] px-2 py-1"
                            onClick={() => {
                              const discard = state.players[HUMAN].hand[0];
                              dispatch(
                                {
                                  type: 'ACTIVATE_BOUND',
                                  boundInstanceId: b.instanceId,
                                  discardHandInstanceId: discard.instanceId,
                                },
                                HUMAN,
                              );
                            }}
                          >
                            Aktivieren
                          </Button>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {state.players[HUMAN].hand.map((card) => {
                  const def = findElementDef(pack, card.defId);
                  if (!def) {
                    const glitch = pack.glitches.find((g) => g.id === card.defId);
                    return (
                      <div
                        key={card.instanceId}
                        className="flex h-24 w-16 flex-none items-center justify-center rounded-lg border border-amber-600/50 bg-stone-900 text-center text-[10px] text-amber-200"
                      >
                        {glitch?.name ?? 'Glitch'}
                      </div>
                    );
                  }
                  const canAttack =
                    isHumanTurn &&
                    state.phase === 'action' &&
                    def.cardType === 'attack' &&
                    humanActions.some((a) => a.type === 'PLAY_ATTACK' && a.cardInstanceId === card.instanceId);
                  const canBoost =
                    isHumanTurn &&
                    state.phase === 'action' &&
                    def.cardType === 'boost' &&
                    humanActions.some((a) => a.type === 'PLAY_BOOST' && a.cardInstanceId === card.instanceId);
                  const canBind =
                    isHumanTurn &&
                    state.phase === 'bind' &&
                    humanActions.some((a) => a.type === 'BIND_CARD' && a.cardInstanceId === card.instanceId);
                  return (
                    <GameCard
                      key={card.instanceId}
                      def={def}
                      onClick={
                        canAttack
                          ? () => playAttack(card.instanceId)
                          : canBoost
                            ? () => dispatch({ type: 'PLAY_BOOST', cardInstanceId: card.instanceId }, HUMAN)
                            : canBind
                              ? () => dispatch({ type: 'BIND_CARD', cardInstanceId: card.instanceId }, HUMAN)
                              : undefined
                      }
                    />
                  );
                })}
              </div>

              {isHumanTurn && !isHumanDefender && !state.winner && (
                <div className="flex flex-wrap items-center gap-2">
                  {state.phase === 'start' && (
                    <Button onClick={() => dispatch({ type: 'ADVANCE_PHASE' }, HUMAN)}>Zug starten</Button>
                  )}
                  {state.phase === 'draw' && (
                    <Button onClick={() => dispatch({ type: 'ADVANCE_PHASE' }, HUMAN)}>Karte ziehen</Button>
                  )}
                  {state.phase === 'bind' && (
                    <Button variant="secondary" onClick={() => dispatch({ type: 'SKIP_BIND' }, HUMAN)}>
                      Nicht binden
                    </Button>
                  )}
                  {state.phase === 'action' && (
                    <>
                      {state.players[HUMAN].ultimateAvailable &&
                        humanActions.some((a) => a.type === 'PLAY_ULTIMATE') && (
                          <Button variant="accent" onClick={() => dispatch({ type: 'PLAY_ULTIMATE' }, HUMAN)}>
                            Ultimativkarte spielen
                          </Button>
                        )}
                      <Button variant="secondary" onClick={() => dispatch({ type: 'END_TURN' }, HUMAN)}>
                        Hauptaktion auslassen
                      </Button>
                      {state.players[HUMAN].hand.length > 0 && (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            const discard = state.players[HUMAN].hand[0];
                            dispatch(
                              { type: 'DISCARD_DRAW', discardHandInstanceId: discard.instanceId },
                              HUMAN,
                            );
                          }}
                        >
                          1 abwerfen, 2 ziehen
                        </Button>
                      )}
                    </>
                  )}
                  {state.phase === 'end' && (
                    <Button onClick={() => dispatch({ type: 'ADVANCE_PHASE' }, HUMAN)}>Zug beenden</Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event log side panel */}
        {logOpen && (
          <div className="w-72 flex-none border-l border-stone-800 bg-stone-900/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Ereignisse</span>
              {lastRoll !== null && <Badge variant="info">W6 = {lastRoll}</Badge>}
            </div>
            <div className="space-y-2 overflow-y-auto text-xs">
              <div className="rounded border border-stone-800 bg-stone-900 p-2 text-stone-300">
                {state.lastEvent || 'Partie gestartet.'}
              </div>
              <div className="rounded border border-stone-800 bg-stone-900 p-2 text-stone-400">
                Arena: {arena?.name ?? state.arena.arenaId}
                <br />
                Mutation: {state.arena.mutation ?? '—'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
