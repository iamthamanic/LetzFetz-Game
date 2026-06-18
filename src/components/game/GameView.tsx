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
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';

const HUMAN: PlayerId = 'p1';
const BOT: PlayerId = 'p2';
const pack = BASE_PACK;

function characterName(id: string): string {
  return pack.characters.find((c) => c.id === id)?.name ?? id;
}

function arenaName(id: string): string {
  return pack.arenas.find((a) => a.id === id)?.name ?? id;
}

export function GameView() {
  const [state, setState] = useState<GameState | null>(null);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
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

  return (
    <div className="h-full flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Opponent zone */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-purple-400 text-sm">🤖 Gegner — {characterName(state.players[BOT].characterId)}</span>
            <div className="text-3xl font-bold text-red-400">{state.players[BOT].hp} Leben</div>
          </div>
          <div className="text-right text-sm text-gray-400">
            <div>Deck: {state.piles.deck.length}</div>
            <div>Hand: {state.players[BOT].hand.length} 🂠</div>
          </div>
        </div>
        <div className="flex gap-2 min-h-[7rem]">
          {state.players[BOT].bound.map((b) => {
            const def = findElementDef(pack, b.defId);
            const challengeActions = humanActions.filter(
              (a): a is Extract<GameAction, { type: 'CHALLENGE' }> =>
                a.type === 'CHALLENGE' && a.targetBoundInstanceId === b.instanceId,
            );
            return def ? (
              <div key={b.instanceId} className="flex flex-col items-center gap-1">
                <GameCard def={def} exhausted={b.exhausted} />
                {isHumanTurn &&
                  state.phase === 'action' &&
                  !state.winner &&
                  challengeActions.length > 0 && (
                    <Button
                      variant="ghost"
                      className="text-[10px] px-2 py-1"
                      onClick={() =>
                        playChallenge(
                          challengeActions[0].attackCardInstanceId,
                          b.instanceId,
                        )
                      }
                    >
                      Herausfordern
                    </Button>
                  )}
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Center */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4">
        <PhaseBar current={state.phase} />
        <Panel className="text-center max-w-md">
          <div className="text-xs text-purple-300 mb-1">🏟️ {arenaName(state.arena.arenaId)}</div>
          <div className="text-sm text-gray-300">Runde {state.turnNumber}</div>
          {state.lastEvent && <p className="text-sm text-white mt-2">{state.lastEvent}</p>}
          {lastRoll !== null && <p className="text-xs text-purple-400 mt-1">Letzter Wurf: W6 = {lastRoll}</p>}
        </Panel>

        {state.winner && (
          <Panel className="text-center">
            <p className="text-xl">
              {state.winner === HUMAN ? '🎉 Du gewinnst!' : '😵 Bot gewinnt!'}
            </p>
            <Button className="mt-3" onClick={() => setState(null)}>
              Neue Partie
            </Button>
          </Panel>
        )}

        {isHumanDefender && !state.winner && (
          <Panel title={state.combat!.mode === 'challenge' ? '🛡️ Herausforderung blocken?' : '🛡️ Blocken?'}>
            <p className="text-sm text-gray-300 mb-3">
              {state.combat!.mode === 'challenge' ? 'Herausforderungswert' : 'Angriffswert'}:{' '}
              {state.combat!.attackValue}
            </p>
            <div className="flex gap-2 flex-wrap mb-3">
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
        )}
      </div>

      {/* Human zone */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-purple-400 text-sm">Du — {characterName(state.players[HUMAN].characterId)}</span>
            <div className="text-3xl font-bold text-green-400">{state.players[HUMAN].hp} Leben</div>
            {state.players[HUMAN].ultimateAvailable && (
              <div className="text-xs text-amber-400 mt-1">Ultimativkarte bereit</div>
            )}
          </div>
          {state.players[HUMAN].bound.length > 0 && (
            <div className="flex gap-2 flex-wrap">
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
                        variant="ghost"
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
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3">
          {state.players[HUMAN].hand.map((card) => {
            const def = findElementDef(pack, card.defId);
            if (!def) {
              const glitch = pack.glitches.find((g) => g.id === card.defId);
              return (
                <div
                  key={card.instanceId}
                  className="w-20 h-28 rounded-lg bg-gray-800 border border-amber-500 flex items-center justify-center text-[10px] p-1 text-center"
                >
                  {glitch?.name ?? 'Karte'}
                </div>
              );
            }
            const canAttack =
              isHumanTurn &&
              state.phase === 'action' &&
              def.cardType === 'attack' &&
              humanActions.some(
                (a) => a.type === 'PLAY_ATTACK' && a.cardInstanceId === card.instanceId,
              );
            const canBoost =
              isHumanTurn &&
              state.phase === 'action' &&
              def.cardType === 'boost' &&
              humanActions.some(
                (a) => a.type === 'PLAY_BOOST' && a.cardInstanceId === card.instanceId,
              );
            const canBind =
              isHumanTurn &&
              state.phase === 'bind' &&
              humanActions.some(
                (a) => a.type === 'BIND_CARD' && a.cardInstanceId === card.instanceId,
              );
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
          <div className="flex gap-2 flex-wrap">
            {state.phase === 'start' && (
              <Button onClick={() => dispatch({ type: 'ADVANCE_PHASE' }, HUMAN)}>Zug starten</Button>
            )}
            {state.phase === 'draw' && (
              <Button onClick={() => dispatch({ type: 'ADVANCE_PHASE' }, HUMAN)}>Karte ziehen</Button>
            )}
            {state.phase === 'bind' && (
              <>
                <Button variant="secondary" onClick={() => dispatch({ type: 'SKIP_BIND' }, HUMAN)}>
                  Nicht binden
                </Button>
              </>
            )}
            {state.phase === 'action' && (
              <>
                {state.players[HUMAN].ultimateAvailable &&
                  humanActions.some((a) => a.type === 'PLAY_ULTIMATE') && (
                    <Button
                      variant="primary"
                      onClick={() => dispatch({ type: 'PLAY_ULTIMATE' }, HUMAN)}
                    >
                      Ultimativkarte spielen
                    </Button>
                  )}
                <Button variant="secondary" onClick={() => dispatch({ type: 'END_TURN' }, HUMAN)}>
                  Hauptaktion auslassen
                </Button>
                {state.players[HUMAN].hand.length > 0 && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      dispatch(
                        {
                          type: 'DISCARD_DRAW',
                          discardInstanceId: state.players[HUMAN].hand[0].instanceId,
                        },
                        HUMAN,
                      )
                    }
                  >
                    1 abwerfen, 2 ziehen
                  </Button>
                )}
              </>
            )}
            {state.phase === 'end' && (
              <Button onClick={() => dispatch({ type: 'END_TURN' }, HUMAN)}>Endphase abschließen</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
