/**
 * Duel board layout — vertical tableau with arena card sidebar on the right.
 * Location: src/features/play/board/GameBoard.tsx
 */
import React, { useState } from 'react';
import type { ContentPack, GameAction, GameState } from '../../../game';
import { findElementDef, findEnginePartDef, isV2Pack } from '../../../game';
import { partActivateCost, peekCharge } from '../../../game/engine/status';
import type { GameViewModel } from './buildGameViewModel';
import type { PendingIntent } from './gameActionHelpers';
import {
  findActivateAction,
  findBuildReplaceAction,
  findDirectBuildAction,
  findDiscardDrawAction,
  findPlayGlitchAction,
  findPoolActivateAction,
  formulaChangeRequiresDiscard,
  hasChallengeForAttack,
} from './gameActionHelpers';
import { CharacterPlate } from './CharacterPlate';
import { BoundCardRow } from './BoundCardRow';
import { HandFan } from './HandFan';
import { ActionBar } from './ActionBar';
import { ArenaCenter } from '../setup/ArenaCenter';
import { ArenaBackdrop } from '../setup/ArenaBackdrop';
import { BoardCard } from './BoardCard';
import { Panel } from '../../../components/ui/Panel';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { FetzChargeConfirmModal } from './FetzChargeConfirmModal';

interface GameBoardProps {
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

export function GameBoard({
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
}: GameBoardProps) {
  const humanId = view.human;
  const botId = view.bot;

  const clearPending = () => onPendingChange(null);
  const [chargeConfirm, setChargeConfirm] = useState<{
    boundInstanceId: string;
    partName: string;
    cost: number;
  } | null>(null);

  const handleSelectAttack = (instanceId: string) => {
    if (hasChallengeForAttack(view.legalActions, instanceId)) {
      onPendingChange({ type: 'attack', attackInstanceId: instanceId });
    } else {
      onPlayAttack(instanceId);
      clearPending();
    }
  };

  const handleBuildDirect = (handInstanceId: string) => {
    const action = findDirectBuildAction(view.legalActions, handInstanceId);
    if (action) {
      onDispatch(action);
      clearPending();
      return;
    }
    if (formulaChangeRequiresDiscard(view.legalActions, handInstanceId)) {
      onPendingChange({ type: 'formula-paid-change', cardInstanceId: handInstanceId });
    }
  };

  const handleStartBuildReplace = (handInstanceId: string) => {
    onPendingChange({ type: 'build', handInstanceId });
  };

  const handleStartActivate = (boundInstanceId: string) => {
    const poolAction = findPoolActivateAction(view.legalActions, boundInstanceId);
    if (poolAction) {
      const bound = state.players[humanId].bound.find((b) => b.instanceId === boundInstanceId);
      const part = bound ? findEnginePartDef(pack, bound.defId) : null;
      const cost = part ? partActivateCost(part) : null;
      if (part && cost != null) {
        setChargeConfirm({
          boundInstanceId,
          partName: part.name,
          cost,
        });
        return;
      }
    }
    onPendingChange({ type: 'activate', boundInstanceId });
  };

  const handleConfirmChargeActivate = () => {
    if (!chargeConfirm) return;
    const action = findPoolActivateAction(view.legalActions, chargeConfirm.boundInstanceId);
    if (action) {
      onDispatch(action);
    }
    setChargeConfirm(null);
  };

  const handleOpponentSlotClick = (slot: (typeof view.botBoundSlots)[0]) => {
    if (pending?.type !== 'attack' || !slot.instanceId) return;
    onPlayChallenge(pending.attackInstanceId, slot.instanceId);
    clearPending();
  };

  const handleHumanSlotClick = (slot: (typeof view.humanBoundSlots)[0]) => {
    if (pending?.type !== 'build' || !slot.instanceId) return;
    const action = findBuildReplaceAction(
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

  const handlePlayGlitch = (handInstanceId: string) => {
    const action = findPlayGlitchAction(view.legalActions, handInstanceId);
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
      case 'build':
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
        <div className="flex-none border-b border-stone-700 bg-stone-900/90 px-4 py-2">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-2">
            {pendingHint && <p className="text-sm text-amber-200/90">{pendingHint}</p>}
            {actionError && (
              <p className="text-sm font-medium text-red-400" role="alert">
                {actionError}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {view.arena && !state.winner && <ArenaBackdrop arenaId={view.arena.id} />}

        <div className="relative z-10 flex min-h-0 w-full flex-1 overflow-hidden">
          <div
            data-testid="duel-tableau"
            className="mx-auto flex min-h-0 w-full max-w-[1180px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
          >
        {/* Opponent zone */}
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
            ghostCharacterId={state.players[botId].characterId}
            showPhraseLabels={isV2Pack(pack)}
            onSlotClick={handleOpponentSlotClick}
          />
        </section>

        {/* Center: combat or spacer */}
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
                Angriffskarte gespielt — Würfel erst nach deiner Block-Entscheidung.
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

        {/* Human zone */}
        <section className="flex flex-none flex-col gap-2 border-t border-stone-800/80 pt-3">
          <BoundCardRow
            label="Deine Engine"
            slots={view.humanBoundSlots}
            cardSize="bound"
            ghostCharacterId={state.players[humanId].characterId}
            showPhraseLabels={isV2Pack(pack)}
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
            onPlayBoost={(id) => onDispatch({ type: 'PLAY_BOOST', cardInstanceId: id })}
            onBuildDirect={handleBuildDirect}
            onStartBuildReplace={handleStartBuildReplace}
            onPlayBlock={onPlayBlock}
            onDiscardDraw={handleDiscardDraw}
            onActivateDiscard={handleActivateDiscard}
            onPlayGlitch={handlePlayGlitch}
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

          {view.arena && !state.winner && (
            <ArenaCenter arena={view.arena} arenaState={state.arena} />
          )}
        </div>
      </div>
      {chargeConfirm && (
        <FetzChargeConfirmModal
          open
          partName={chargeConfirm.partName}
          cost={chargeConfirm.cost}
          chargeBefore={peekCharge(state, humanId)}
          canAfford={peekCharge(state, humanId) >= chargeConfirm.cost}
          onConfirm={handleConfirmChargeActivate}
          onCancel={() => setChargeConfirm(null)}
        />
      )}
    </div>
  );
}
