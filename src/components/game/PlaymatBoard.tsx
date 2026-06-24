/**
 * Duel board on full-bleed playmat — replaces vertical tableau + arena sidebar.
 * Location: src/components/game/PlaymatBoard.tsx
 */
import React from 'react';
import type { ContentPack, GameAction, GameState } from '../../game';
import { findElementDef } from '../../game';
import type { GameViewModel } from './buildGameViewModel';
import type { PendingIntent } from './gameActionHelpers';
import {
  findActivateAction,
  findBindReplaceAction,
  findDirectBindAction,
  findDiscardDrawAction,
  hasChallengeForAttack,
} from './gameActionHelpers';
import { CharacterPlate } from './CharacterPlate';
import { BoundCardRow } from './BoundCardRow';
import { HandFan } from './HandFan';
import { ActionBar } from './ActionBar';
import { ArenaPlaymat } from './ArenaPlaymat';
import { ArenaPlaymatBadge } from './ArenaPlaymatBadge';
import { BoardCard } from './BoardCard';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface PlaymatBoardProps {
  state: GameState;
  pack: ContentPack;
  view: GameViewModel;
  pending: PendingIntent | null;
  actionError: string | null;
  lastRoll: number | null;
  botThinking: boolean;
  onDispatch: (action: GameAction) => void;
  onPlayAttack: (instanceId: string) => void;
  onPlayChallenge: (attackInstanceId: string, targetBoundInstanceId: string) => void;
  onPlayBlock: (instanceId: string) => void;
  onPendingChange: (pending: PendingIntent | null) => void;
  onNewGame: () => void;
}

export function PlaymatBoard({
  state,
  pack,
  view,
  pending,
  actionError,
  lastRoll,
  botThinking,
  onDispatch,
  onPlayAttack,
  onPlayChallenge,
  onPlayBlock,
  onPendingChange,
  onNewGame,
}: PlaymatBoardProps) {
  const humanId = view.human;
  const botId = view.bot;

  const clearPending = () => onPendingChange(null);

  const handleSelectAttack = (instanceId: string) => {
    if (hasChallengeForAttack(view.legalActions, instanceId)) {
      onPendingChange({ type: 'attack', attackInstanceId: instanceId });
    } else {
      onPlayAttack(instanceId);
      clearPending();
    }
  };

  const handleBindDirect = (handInstanceId: string) => {
    const action = findDirectBindAction(view.legalActions, handInstanceId);
    if (action) {
      onDispatch(action);
      clearPending();
    }
  };

  const handleStartBindReplace = (handInstanceId: string) => {
    onPendingChange({ type: 'bind', handInstanceId });
  };

  const handleStartActivate = (boundInstanceId: string) => {
    onPendingChange({ type: 'activate', boundInstanceId });
  };

  const handleOpponentSlotClick = (slot: (typeof view.botBoundSlots)[0]) => {
    if (pending?.type !== 'attack' || !slot.instanceId) return;
    onPlayChallenge(pending.attackInstanceId, slot.instanceId);
    clearPending();
  };

  const handleHumanSlotClick = (slot: (typeof view.humanBoundSlots)[0]) => {
    if (pending?.type !== 'bind' || !slot.instanceId) return;
    const action = findBindReplaceAction(
      view.legalActions,
      pending.handInstanceId,
      slot.instanceId,
    );
    if (action) {
      onDispatch(action);
      clearPending();
    }
  };

  const handleActivateDiscard = (handInstanceId: string) => {
    if (pending?.type !== 'activate') return;
    const action = findActivateAction(
      view.legalActions,
      pending.boundInstanceId,
      handInstanceId,
    );
    if (action) {
      onDispatch(action);
      clearPending();
    }
  };

  const handleDiscardDraw = (handInstanceId: string) => {
    const action = findDiscardDrawAction(view.legalActions, handInstanceId);
    if (action) {
      onDispatch(action);
      clearPending();
    }
  };

  const pendingHint = (() => {
    if (!pending) return null;
    switch (pending.type) {
      case 'attack':
        return 'Wähle eine gegnerische Engine-Karte zum Herausfordern — oder „Direkt angreifen“.';
      case 'bind':
        return 'Wähle eine deiner Engine-Karten, die ersetzt werden soll.';
      case 'activate':
        return 'Wähle eine Handkarte zum Abwerfen für die Aktivierung.';
      default:
        return null;
    }
  })();

  const blockCards = view.isHumanDefender
    ? view.legalActions.filter((a) => a.type === 'PLAY_BLOCK')
    : [];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {(pendingHint || actionError) && (
        <div className="relative z-30 flex-none border-b border-stone-700 bg-stone-900/90 px-4 py-2">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
            {pendingHint && <p className="text-sm text-amber-200/90">{pendingHint}</p>}
            {actionError && (
              <p className="text-sm font-medium text-red-400" role="alert">
                {actionError}
              </p>
            )}
          </div>
        </div>
      )}

      <div
        data-testid="playmat-board"
        className="relative flex min-h-0 flex-1 overflow-hidden"
      >
        {view.arena && !state.winner && <ArenaPlaymat arenaId={view.arena.id} />}
        {view.arena && !state.winner && (
          <ArenaPlaymatBadge arena={view.arena} arenaState={state.arena} />
        )}

        <div
          data-testid="duel-tableau"
          className="relative z-10 mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
        >
          <section className="flex flex-none flex-col gap-2">
            <CharacterPlate
              state={state}
              pack={pack}
              playerId={botId}
              side="bot"
              deckCount={state.piles.deck.length}
            />
            <BoundCardRow
              label="Gegner-Engine"
              slots={view.botBoundSlots}
              cardSize="opponentBound"
              onSlotClick={handleOpponentSlotClick}
            />
          </section>

          <section className="flex min-h-[100px] flex-1 items-center justify-center py-1">
            {state.winner ? (
              <Panel className="max-w-sm space-y-4 text-center">
                <div className="text-4xl">{state.winner === humanId ? '🎉' : '😵'}</div>
                <h2 className="text-xl font-bold text-stone-100">
                  {state.winner === humanId ? 'Du gewinnst!' : 'Bot gewinnt!'}
                </h2>
                <p className="text-sm text-stone-400">Runde {state.turnNumber}</p>
                <Button variant="accent" onClick={onNewGame} className="w-full">
                  Neue Partie
                </Button>
              </Panel>
            ) : view.isHumanDefender && view.combat ? (
              <Panel
                title={
                  view.combat.mode === 'challenge'
                    ? '🛡️ Herausforderung blocken'
                    : '🛡️ Angriff blocken'
                }
                className="w-full max-w-xl"
              >
                <p className="mb-3 text-sm text-stone-300">
                  {view.combat.mode === 'challenge' ? 'Herausforderungswert' : 'Angriffswert'}:{' '}
                  <span className="text-lg font-black text-red-300">{view.combat.attackValue}</span>
                  {lastRoll !== null && (
                    <Badge variant="info" className="ml-2">
                      W6 = {lastRoll}
                    </Badge>
                  )}
                </p>
                <div className="mb-3 flex flex-wrap justify-center gap-2">
                  {blockCards.map((a) => {
                    if (a.type !== 'PLAY_BLOCK') return null;
                    const card = state.players[humanId].hand.find(
                      (c) => c.instanceId === a.cardInstanceId,
                    );
                    const def = card ? findElementDef(pack, card.defId) : undefined;
                    return def ? (
                      <BoardCard
                        key={a.cardInstanceId}
                        def={def}
                        size="combat"
                        playable
                        onClick={() => onPlayBlock(a.cardInstanceId)}
                      />
                    ) : null;
                  })}
                </div>
                <Button variant="secondary" onClick={() => onDispatch({ type: 'PASS_BLOCK' })}>
                  Nicht blocken
                </Button>
              </Panel>
            ) : null}
          </section>

          <section className="flex flex-none flex-col gap-2 border-t border-stone-800/80 pt-3">
            <BoundCardRow
              label="Deine Engine"
              slots={view.humanBoundSlots}
              cardSize="bound"
              onActivateBound={handleStartActivate}
              onSlotClick={handleHumanSlotClick}
            />

            <CharacterPlate
              state={state}
              pack={pack}
              playerId={humanId}
              side="human"
              deckCount={state.piles.deck.length}
              discardCount={state.piles.discard.length}
            />

            <HandFan
              cards={view.handCards}
              pending={pending}
              onSelectAttack={handleSelectAttack}
              onPlayAttackDirect={onPlayAttack}
              onPlayBoost={(id) => onDispatch({ type: 'PLAY_BOOST', cardInstanceId: id })}
              onBindDirect={handleBindDirect}
              onStartBindReplace={handleStartBindReplace}
              onPlayBlock={onPlayBlock}
              onDiscardDraw={handleDiscardDraw}
              onActivateDiscard={handleActivateDiscard}
            />

            <ActionBar
              actions={view.availableMainActions}
              onAction={(action) => {
                onDispatch(action);
                clearPending();
              }}
              botThinking={botThinking && !view.isHumanTurn && !view.isHumanDefender}
            />

            {pending && (
              <div className="flex flex-wrap items-center gap-2">
                {pending.type === 'attack' && (
                  <Button variant="primary" onClick={() => onPlayAttack(pending.attackInstanceId)}>
                    Direkt angreifen
                  </Button>
                )}
                <Button variant="secondary" onClick={clearPending}>
                  Auswahl abbrechen
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
