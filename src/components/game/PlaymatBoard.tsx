/**
 * Duel board on full-bleed playmat — replaces vertical tableau + arena sidebar.
 * Location: src/components/game/PlaymatBoard.tsx
 */
import React, { useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react';
import type { ContentPack, GameAction, GameState, PlayerId } from '../../game';
import { findElementDef, isV2Pack } from '../../game';
import type { GameViewModel } from './buildGameViewModel';
import type { PendingIntent } from './gameActionHelpers';
import type { PresentationStep } from './presentation/types';
import { PlaymatCardFly, AttackCardFly } from './presentation';
import {
  findActivateAction,
  findBindReplaceAction,
  findDirectBindAction,
  findDiscardDrawAction,
} from './gameActionHelpers';
import { CharacterDock, CombatStage, DeckPile, DiscardPile, TargetingArrow } from './zones';
import type { TargetingArrowCoords } from './zones/TargetingArrow';
import { BoundCardRow } from './BoundCardRow';
import { HandFan } from './HandFan';
import { ActionBar } from './ActionBar';
import { ArenaPlaymat } from './ArenaPlaymat';
import { ArenaPlaymatBadge } from './ArenaPlaymatBadge';
import { getPlaymatLayoutForArena, playmatZonePercentStyle } from './playmat';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { DndPlaymat } from './DndPlaymat';

interface PlaymatBoardProps {
  state: GameState;
  pack: ContentPack;
  view: GameViewModel;
  pending: PendingIntent | null;
  actionError: string | null;
  lastRoll: number | null;
  botThinking: boolean;
  openingDealActive?: boolean;
  openingDealFinished?: boolean;
  dealReveal?: Record<PlayerId, number>;
  heldBackHandCards?: Partial<Record<PlayerId, string>>;
  snapBoundCardIds?: string[];
  activateDiscardId?: string | null;
  hiddenAttackCardId?: string | null;
  activePresentationStep?: PresentationStep | null;
  humanPlayerId?: PlayerId;
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
  openingDealActive = false,
  openingDealFinished = false,
  dealReveal,
  heldBackHandCards,
  snapBoundCardIds = [],
  activateDiscardId = null,
  hiddenAttackCardId = null,
  activePresentationStep = null,
  humanPlayerId = 'p1',
  onDispatch,
  onPlayAttack,
  onPlayChallenge,
  onPlayBlock,
  onPendingChange,
  onNewGame,
}: PlaymatBoardProps) {
  const humanId = view.human;
  const botId = view.bot;

  const playmatRef = useRef<HTMLDivElement>(null);
  const [rootRect, setRootRect] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [arrowCoords, setArrowCoords] = useState<TargetingArrowCoords | null>(null);

  const updateMeasurements = useCallback(() => {
    const root = playmatRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    setRootRect({ width: rect.width, height: rect.height });

    if (pending?.type !== 'attack') {
      setArrowCoords(null);
      return;
    }

    const selectedCard = root.querySelector('[data-selected-attack="true"]') as HTMLElement | null;
    if (!selectedCard) {
      setArrowCoords(null);
      return;
    }
    const sourceRect = selectedCard.getBoundingClientRect();
    const source = {
      x: sourceRect.left + sourceRect.width / 2 - rect.left,
      y: sourceRect.bottom - rect.top,
    };

    const targetableSlot = root.querySelector('[data-targetable="true"]') as HTMLElement | null;
    let target: { x: number; y: number } | null = null;
    if (targetableSlot) {
      const targetRect = targetableSlot.getBoundingClientRect();
      target = {
        x: targetRect.left + targetRect.width / 2 - rect.left,
        y: targetRect.top + targetRect.height / 2 - rect.top,
      };
    } else {
      const dock = root.querySelector('[data-character-dock="bot"]') as HTMLElement | null;
      if (dock) {
        const dockRect = dock.getBoundingClientRect();
        target = {
          x: dockRect.left + dockRect.width / 2 - rect.left,
          y: dockRect.top + dockRect.height / 2 - rect.top,
        };
      }
    }

    setArrowCoords(target ? { source, target } : null);
  }, [pending?.type]);

  useLayoutEffect(() => {
    updateMeasurements();
    const onResize = () => updateMeasurements();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateMeasurements]);

  useLayoutEffect(() => {
    updateMeasurements();
  }, [pending, updateMeasurements]);

  const clearPending = () => onPendingChange(null);

  const handleSelectAttack = (instanceId: string) => {
    onPendingChange({ type: 'attack', attackInstanceId: instanceId });
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
    if (pending?.type !== 'bind') return;
    if (!slot.instanceId) {
      const action = findDirectBindAction(view.legalActions, pending.handInstanceId);
      if (action) {
        onDispatch(action);
        clearPending();
      }
      return;
    }
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

  const hasChallengeTargets = view.botBoundSlots.some((s) => s.isTargetable);
  const bindHasFreeSlot = view.humanBoundSlots.some((s) => !s.instanceId);

  const pendingHint = (() => {
    if (!pending) return null;
    switch (pending.type) {
      case 'attack':
        return hasChallengeTargets
          ? 'Wähle eine gegnerische Engine-Karte zum Herausfordern — oder „Direkt angreifen“.'
          : 'Kein Herausforderungsziel — nutze „Direkt angreifen“.';
      case 'bind': {
        const hasFreeSlot = view.humanBoundSlots.some((s) => !s.instanceId);
        return hasFreeSlot
          ? 'Klicke auf einen freien Engine-Slot, um die Karte zu binden.'
          : 'Wähle eine gebundene Karte, die durch die neue Karte ersetzt werden soll.';
      }
      case 'activate':
        return 'Wähle eine Handkarte zum Abwerfen für die Aktivierung.';
      default:
        return null;
    }
  })();

  const blockCards = view.isHumanDefender
    ? view.legalActions.filter((a) => a.type === 'PLAY_BLOCK')
    : [];

  const playmatLayout = useMemo(
    () => getPlaymatLayoutForArena(view.arena?.id ?? 'arena-spaeti'),
    [view.arena?.id],
  );
  const deckZone = playmatLayout.zones.find((z) => z.id === 'deck');
  const discardZone = playmatLayout.zones.find((z) => z.id === 'discard');
  const playerCharZone = playmatLayout.zones.find((z) => z.id === 'player-character');
  const opponentCharZone = playmatLayout.zones.find((z) => z.id === 'opponent-character');
  const combatZone = playmatLayout.zones.find((z) => z.id === 'combat');
  const topDiscard = state.piles.discard[state.piles.discard.length - 1];
  const topDiscardDef = topDiscard ? findElementDef(pack, topDiscard.defId) : undefined;

  const humanHandVisible = openingDealActive && dealReveal ? dealReveal[humanId] : undefined;
  const botHandVisible = openingDealActive && dealReveal ? dealReveal[botId] : undefined;
  const humanHeldBackId = heldBackHandCards?.[humanId];
  const botHeldBackId = heldBackHandCards?.[botId];
  const humanHandHidden = [
    ...(humanHeldBackId ? [humanHeldBackId] : []),
    ...(hiddenAttackCardId ? [hiddenAttackCardId] : []),
  ];
  const humanHandHiddenIds = humanHandHidden.length > 0 ? humanHandHidden : undefined;
  const botHandCount =
    botHandVisible ??
    (botHeldBackId ? state.players[botId].hand.length - 1 : undefined);

  return (
    <DndPlaymat state={state} pack={pack} view={view} humanId={humanId} onDispatch={onDispatch}>
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Mobile character badges — outside absolute playmat layer to avoid overlap */}
      <div className="flex flex-none items-stretch gap-2 border-b border-stone-800/80 bg-stone-950/90 px-2 py-1.5 sm:hidden">
        <CharacterDock
          state={state}
          pack={pack}
          playerId={botId}
          side="bot"
          variant="compact"
          handVisibleCount={botHandCount}
          className="min-w-0 flex-1"
        />
        <CharacterDock
          state={state}
          pack={pack}
          playerId={humanId}
          side="human"
          variant="compact"
          handVisibleCount={humanHandVisible}
          className="min-w-0 flex-1"
        />
      </div>
      {(pendingHint || actionError) && (
        <div className="relative z-30 flex-none border-b border-stone-700 bg-stone-900/90 px-3 py-2 sm:px-4">
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
        ref={playmatRef}
        data-testid="playmat-board"
        className="relative flex min-h-0 flex-1 overflow-hidden"
      >
        {openingDealActive && (
          <div data-testid="opening-deal-in-progress" className="sr-only" aria-live="polite">
            Eröffnungskarten werden verteilt
          </div>
        )}
        {openingDealFinished && (
          <div data-testid="opening-deal-done" className="sr-only" aria-hidden>
            Eröffnungsdeal abgeschlossen
          </div>
        )}

        {view.arena && !state.winner && <ArenaPlaymat arenaId={view.arena.id} />}
        {view.arena && !state.winner && (
          <ArenaPlaymatBadge arena={view.arena} arenaState={state.arena} />
        )}

        {deckZone && (
          <DeckPile
            count={state.piles.deck.length}
            style={playmatZonePercentStyle(deckZone, playmatLayout.viewBox)}
          />
        )}
        {discardZone && (
          <DiscardPile
            count={state.piles.discard.length}
            topCard={topDiscardDef}
            style={playmatZonePercentStyle(discardZone, playmatLayout.viewBox)}
          />
        )}

        {opponentCharZone && (
          <CharacterDock
            state={state}
            pack={pack}
            playerId={botId}
            side="bot"
            variant="full"
            handVisibleCount={botHandCount}
            style={playmatZonePercentStyle(opponentCharZone, playmatLayout.viewBox)}
            className="hidden sm:flex"
          />
        )}
        {playerCharZone && (
          <CharacterDock
            state={state}
            pack={pack}
            playerId={humanId}
            side="human"
            variant="full"
            handVisibleCount={humanHandVisible}
            style={playmatZonePercentStyle(playerCharZone, playmatLayout.viewBox)}
            className="hidden sm:flex"
          />
        )}

        <PlaymatCardFly
          activeStep={activePresentationStep}
          humanPlayerId={humanPlayerId}
        />
        <AttackCardFly
          activeStep={activePresentationStep}
          humanPlayerId={humanPlayerId}
        />

        {activateDiscardId && !state.winner && (
          <div
            data-testid="activate-discard-fly"
            className="pointer-events-none absolute z-40 activate-discard-fly"
            style={{
              left: '50%',
              bottom: '15%',
              '--to-x': '0px',
              '--to-y': '-60vh',
            } as React.CSSProperties}
          >
            <div className="w-20 h-28 rounded-lg border-2 border-stone-600 bg-stone-900/80 shadow-2xl opacity-80" />
          </div>
        )}

        {pending?.type === 'attack' && !state.winner && arrowCoords && rootRect.width > 0 && (
          <TargetingArrow
            rootRect={rootRect}
            coords={arrowCoords}
            hasChallengeTargets={view.botBoundSlots.some((s) => s.isTargetable)}
            opponentSlots={view.botBoundSlots}
          />
        )}

        {combatZone && view.combat && !state.winner && (
          <CombatStage
            combat={view.combat}
            state={state}
            pack={pack}
            humanId={humanId}
            isHumanDefender={view.isHumanDefender}
            botThinking={botThinking}
            blockActions={blockCards}
            style={playmatZonePercentStyle(combatZone, playmatLayout.viewBox)}
            onPlayBlock={onPlayBlock}
            onPassBlock={() => onDispatch({ type: 'PASS_BLOCK' })}
          />
        )}

        <div
          data-testid="duel-tableau"
          className="relative z-10 mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden px-2 py-2 sm:px-4 sm:py-3"
        >
          <section className="flex flex-none flex-col gap-2">
            <BoundCardRow
              label="Gegner-Engine"
              slots={view.botBoundSlots}
              cardSize="opponentBound"
              snapBoundCardIds={snapBoundCardIds}
              showPhraseLabels={isV2Pack(pack)}
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
            ) : view.combat ? (
              <p className="sr-only" aria-live="polite">
                Kampf aktiv — siehe Kampfzone auf dem Playmat
              </p>
            ) : null}
          </section>

          <section className="flex flex-none flex-col gap-2 border-t border-stone-800/80 pt-3">
            <BoundCardRow
              label="Deine Engine"
              slots={view.humanBoundSlots}
              cardSize="bound"
              snapBoundCardIds={snapBoundCardIds}
              bindPending={pending?.type === 'bind'}
              bindHasFreeSlot={bindHasFreeSlot}
              showPhraseLabels={isV2Pack(pack)}
              onActivateBound={handleStartActivate}
              onSlotClick={handleHumanSlotClick}
            />

            {pending?.type === 'bind' && (
              <div
                data-testid="bind-target-pill"
                className="mx-auto w-fit rounded-full border border-purple-400/50 bg-purple-950/60 px-3 py-1 text-xs font-semibold text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
              >
                {bindHasFreeSlot ? 'Zielslot wählen — freier Slot' : 'Zielslot wählen — Karte ersetzen'}
              </div>
            )}

            <HandFan
              cards={view.handCards}
              pending={pending}
              visibleCount={humanHandVisible}
              hiddenInstanceIds={humanHandHiddenIds}
              hasChallengeTargets={hasChallengeTargets}
              onSelectAttack={handleSelectAttack}
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
              <div className="flex flex-col gap-2">
                {pending.type === 'attack' && (
                  <p className="text-center text-[11px] text-stone-400 sm:text-xs">
                    {hasChallengeTargets
                      ? 'Herausfordern: Gegner-Engine-Slot anklicken. Direktangriff trifft die LP des Gegners.'
                      : 'Kein Herausforderungsziel — nur Direktangriff möglich.'}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {pending.type === 'attack' && (
                    <Button
                      variant="primary"
                      title="Greift die Lebenspunkte des Gegners direkt an"
                      onClick={() => onPlayAttack(pending.attackInstanceId)}
                    >
                      Direkt angreifen
                    </Button>
                  )}
                  <Button variant="secondary" onClick={clearPending}>
                    Auswahl abbrechen
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
    </DndPlaymat>
  );
}
