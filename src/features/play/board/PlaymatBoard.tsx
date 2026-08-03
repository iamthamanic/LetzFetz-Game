/**
 * Duel board on full-bleed playmat — replaces vertical tableau + arena sidebar.
 * Location: src/features/play/board/PlaymatBoard.tsx
 */
import React, { useState } from 'react';
import type { ContentPack, GameAction, GameState, PlayerId } from '../../../game';
import { findElementDef, findEnginePartDef, isV2Pack, isV5FormulaEnabled, isV6FormulaEnabled } from '../../../game';
import { rulesetFromState } from '../../../game/engine/rulesetFromState';
import { partActivateCost, peekCharge } from '../../../game/engine/status';
import type { EngineRecipe } from '../../../game/types/engineVisual';
import type { GameViewModel } from './buildGameViewModel';
import type { PendingIntent } from './gameActionHelpers';
import type { PresentationStep } from '../presentation/types';
import { PlaymatCardFly, AttackCardFly, BuildCardFly, InstantGlitchReveal, DamageHitReveal, CombatResolveShow, DrawCardReveal, OpeningDealFly, isDamageHitStep } from '../presentation';
import {
  findActivateAction,
  findBuildReplaceAction,
  findDirectBuildAction,
  findDiscardDrawAction,
  findPlayGlitchAction,
  findPlayItemAction,
  findPoolActivateAction,
  formulaChallengeTargetIds,
} from './gameActionHelpers';
import { CharacterDock, CombatStage, DeckPile, DiscardPile } from './zones';
import { BoundCardRow } from './BoundCardRow';
import { FormulaRig } from './FormulaRig';
import { HandFan } from './HandFan';
import { ArenaPlaymat } from './ArenaPlaymat';
import { ArenaPlaymatBadge } from './ArenaPlaymatBadge';
import { Panel } from '../../../components/ui/Panel';
import { Button } from '../../../components/ui/Button';
import { DndPlaymat } from './DndPlaymat';
import { FetzChargeConfirmModal } from './FetzChargeConfirmModal';
import { BoardEngineLiveZone } from '../engine3d/BoardEngineLiveZone';
import { shouldShowBoardEngineLiveZone, shouldShowFormulaGestellCompose } from './boardEngineLive';

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
  flyingBuildCardIds?: string[];
  activateDiscardId?: string | null;
  hiddenAttackCardId?: string | null;
  activePresentationStep?: PresentationStep | null;
  humanPlayerId?: PlayerId;
  /** Primary Live-3D recipe for human Engine-Zone (null = empty placeholder). */
  liveEngineRecipe?: EngineRecipe | null;
  /** Incremented after auto snapshot warmup to refresh 2D thumbs. */
  liveSnapshotEpoch?: number;
  /** Bump board thumbs after auto snapshot warmup. */
  onLiveEngineSnapshotWarmed?: () => void;
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
  flyingBuildCardIds = [],
  activateDiscardId = null,
  hiddenAttackCardId = null,
  activePresentationStep = null,
  humanPlayerId = 'p1',
  liveEngineRecipe = null,
  liveSnapshotEpoch = 0,
  onLiveEngineSnapshotWarmed,
  onDispatch,
  onPlayAttack,
  onPlayChallenge: _onPlayChallenge,
  onPlayBlock,
  onPendingChange,
  onNewGame,
}: PlaymatBoardProps) {
  const humanId = view.human;
  const v5Formula = isV5FormulaEnabled(rulesetFromState(state));
  const formulaBoard =
    v5Formula || isV6FormulaEnabled(rulesetFromState(state));
  const [chargeConfirm, setChargeConfirm] = useState<{
    boundInstanceId: string;
    partName: string;
    cost: number;
  } | null>(null);
  const botId = view.bot;
  const damageFreezeHp =
    activePresentationStep && isDamageHitStep(activePresentationStep)
      ? {
          playerId: activePresentationStep.payload?.playerId as PlayerId | undefined,
          fromHp: activePresentationStep.payload?.fromHp as number | undefined,
        }
      : null;
  const dockHp = (playerId: PlayerId) =>
    damageFreezeHp?.playerId === playerId && damageFreezeHp.fromHp != null
      ? damageFreezeHp.fromHp
      : undefined;

  const clearPending = () => onPendingChange(null);

  const handleSelectAttack = (instanceId: string) => {
    onPendingChange({ type: 'attack', attackInstanceId: instanceId });
  };

  const handleBuildDirect = (handInstanceId: string) => {
    const action = findDirectBuildAction(view.legalActions, handInstanceId);
    if (action) {
      onDispatch(action);
      clearPending();
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
    if (pending?.type !== 'attack' || !slot.instanceId || !slot.isTargetable) return;
    onPendingChange({
      type: 'attack',
      attackInstanceId: pending.attackInstanceId,
      targetBoundInstanceId: slot.instanceId,
    });
  };

  const handleHumanSlotClick = (slot: (typeof view.humanBoundSlots)[0]) => {
    if (pending?.type !== 'build') return;
    if (!slot.instanceId) {
      const action = findDirectBuildAction(view.legalActions, pending.handInstanceId);
      if (action) {
        onDispatch(action);
        clearPending();
      }
      return;
    }
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

  const handlePlayItem = (handInstanceId: string) => {
    const action = findPlayItemAction(view.legalActions, handInstanceId);
    if (action) {
      onDispatch(action);
      clearPending();
    }
  };

  const handleFormulaChallengeClick = (instanceId: string) => {
    if (pending?.type !== 'attack') return;
    onPendingChange({
      type: 'attack',
      attackInstanceId: pending.attackInstanceId,
      targetBoundInstanceId: instanceId,
    });
  };

  const formulaChallengeIds =
    pending?.type === 'attack'
      ? formulaChallengeTargetIds(view.legalActions, pending.attackInstanceId)
      : [];

  const hasChallengeTargets = v5Formula
    ? formulaChallengeIds.length > 0
    : view.botBoundSlots.some((s) => s.isTargetable);
  const buildHasFreeSlot = view.humanBoundSlots.some((s) => !s.instanceId);

  const pendingHint = (() => {
    if (!pending) return null;
    switch (pending.type) {
      case 'attack':
        return hasChallengeTargets
          ? pending.targetBoundInstanceId
            ? 'Ziel gewählt — unten „Herausfordern“ oder „Direkt angreifen“.'
            : v5Formula
              ? 'Gegner-Formelkomponente antippen als Ziel, dann unten „Herausfordern“ — oder „Direkt angreifen“.'
              : 'Gegner-Engine antippen als Ziel, dann unten „Herausfordern“ — oder „Direkt angreifen“.'
          : 'Kein Herausforderungsziel — unten „Direkt angreifen“.';
      case 'build': {
        if (v5Formula) {
          return 'Formelkarte wird direkt gebaut oder ersetzt — kein Slot-Klick nötig.';
        }
        const hasFreeSlot = view.humanBoundSlots.some((s) => !s.instanceId);
        return hasFreeSlot
          ? 'Klicke auf einen freien Engine-Slot, um die Karte zu bauen.'
          : 'Wähle eine gebaute Karte, die durch die neue Karte ersetzt werden soll.';
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
  const reactionItemCards = view.isHumanDefender
    ? view.legalActions.filter((a) => a.type === 'PLAY_ITEM')
    : [];

  const topDiscard = state.piles.discard[state.piles.discard.length - 1];
  const topDiscardDef = topDiscard ? findElementDef(pack, topDiscard.defId) : undefined;

  // Hide hands until / during opening deal; only show fully after deal finishes.
  const humanHandVisible = !openingDealFinished
    ? (dealReveal?.[humanId] ?? 0)
    : undefined;
  const botHandVisible = !openingDealFinished
    ? (dealReveal?.[botId] ?? 0)
    : undefined;
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
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      data-testid="playmat-board"
      data-v5-formula={v5Formula ? 'true' : 'false'}
      data-formula-board={formulaBoard ? 'true' : 'false'}
    >
      {/* Mobile character badges — outside absolute playmat layer to avoid overlap */}
      <div className="flex flex-none items-stretch gap-2 border-b border-stone-800/80 bg-stone-950/90 px-2 py-1.5 sm:hidden">
        <CharacterDock
          state={state}
          pack={pack}
          playerId={botId}
          side="bot"
          variant="compact"
          handVisibleCount={botHandCount}
          displayHp={dockHp(botId)}
          className="min-w-0 flex-1"
        />
        <CharacterDock
          state={state}
          pack={pack}
          playerId={humanId}
          side="human"
          variant="compact"
          handVisibleCount={humanHandVisible}
          displayHp={dockHp(humanId)}
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

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
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

        <OpeningDealFly
          activeStep={activePresentationStep}
          humanPlayerId={humanPlayerId}
        />
        <PlaymatCardFly
          activeStep={activePresentationStep}
          humanPlayerId={humanPlayerId}
        />
        <DrawCardReveal
          activeStep={activePresentationStep}
          pack={pack}
          humanPlayerId={humanPlayerId}
        />
        <AttackCardFly
          activeStep={activePresentationStep}
          humanPlayerId={humanPlayerId}
        />
        <BuildCardFly
          activeStep={activePresentationStep}
          humanPlayerId={humanPlayerId}
        />
        <InstantGlitchReveal
          activeStep={activePresentationStep}
          humanPlayerId={humanPlayerId}
        />
        <DamageHitReveal
          activeStep={activePresentationStep}
          pack={pack}
          humanPlayerId={humanPlayerId}
        />
        <CombatResolveShow
          activeStep={activePresentationStep}
          pack={pack}
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

        {view.combat && !state.winner && (
          <CombatStage
            combat={view.combat}
            state={state}
            pack={pack}
            humanId={humanId}
            isHumanDefender={view.isHumanDefender}
            botThinking={botThinking}
            blockActions={blockCards}
            reactionItemActions={reactionItemCards}
            onPlayBlock={onPlayBlock}
            onPlayReactionItem={(instanceId) =>
              onDispatch({ type: 'PLAY_ITEM', cardInstanceId: instanceId })
            }
            onPassBlock={() => onDispatch({ type: 'PASS_BLOCK' })}
          />
        )}

        <div className="relative z-10 flex min-h-0 w-full flex-1">
          <aside
            data-testid="human-dock-sidebar"
            className="z-20 flex w-[4.85rem] shrink-0 flex-col justify-center gap-2 p-1 sm:w-36 sm:justify-end sm:gap-3 sm:p-2 sm:pb-3 md:w-44 lg:w-48"
          >
            <div
              data-testid="pile-column"
              className="flex w-full flex-col items-stretch gap-2 rounded-xl border border-stone-700/60 bg-stone-950/80 p-1 shadow-lg backdrop-blur-sm sm:p-1.5"
            >
              <DeckPile count={state.piles.deck.length} className="w-full" />
              <div className="border-t border-stone-700/50" aria-hidden />
              <DiscardPile
                count={state.piles.discard.length}
                topCard={topDiscardDef}
                className="w-full"
              />
            </div>
            <CharacterDock
              state={state}
              pack={pack}
              playerId={humanId}
              side="human"
              variant="full"
              handVisibleCount={humanHandVisible}
              displayHp={dockHp(humanId)}
              className="hidden h-44 w-full sm:flex md:h-52"
            />
          </aside>

          <div
            data-testid="duel-tableau"
            className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden px-2 py-2 sm:px-3 sm:py-3 md:px-4"
          >
          {view.arena && !state.winner && (
            <ArenaPlaymatBadge
              arena={view.arena}
              arenaState={state.arena}
              placement="inline"
              className="mb-1 max-w-xs sm:hidden"
            />
          )}

          <section className="flex flex-none flex-col gap-2">
            {shouldShowFormulaGestellCompose(formulaBoard) ? (
              <FormulaRig
                label="Gegner-Formel"
                formula={state.players[botId].formula}
                pack={pack}
                testId="opponent-formula-rig"
                targetableInstanceIds={formulaChallengeIds}
                selectedTargetId={
                  pending?.type === 'attack' ? pending.targetBoundInstanceId : null
                }
                onComponentClick={handleFormulaChallengeClick}
              />
            ) : (
              <BoundCardRow
                label="Gegner-Engine"
                slots={view.botBoundSlots}
                cardSize="opponentBound"
                snapBoundCardIds={snapBoundCardIds}
                flyingBuildCardIds={flyingBuildCardIds}
                align="start"
                ghostCharacterId={state.players[botId].characterId}
                showPhraseLabels={isV2Pack(pack)}
                onSlotClick={handleOpponentSlotClick}
              />
            )}
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

          <section className="flex min-w-0 flex-none flex-col gap-2 border-t border-stone-800/80 pt-3">
            {shouldShowFormulaGestellCompose(formulaBoard) ? (
              <FormulaRig
                label="Deine Formel"
                formula={state.players[humanId].formula}
                pack={pack}
                testId="human-formula-rig"
              />
            ) : (
              <BoundCardRow
                key={`human-engine-thumbs-${liveSnapshotEpoch}`}
                label="Deine Engine"
                slots={view.humanBoundSlots}
                cardSize="bound"
                snapBoundCardIds={snapBoundCardIds}
                flyingBuildCardIds={flyingBuildCardIds}
                buildPending={pending?.type === 'build'}
                buildHasFreeSlot={buildHasFreeSlot}
                align="start"
                ghostCharacterId={state.players[humanId].characterId}
                showPhraseLabels={isV2Pack(pack)}
                onActivateBound={handleStartActivate}
                onSlotClick={handleHumanSlotClick}
              />
            )}

            {shouldShowBoardEngineLiveZone(formulaBoard) ? (
              <BoardEngineLiveZone
                recipe={liveEngineRecipe}
                heading={liveEngineRecipe ? 'Fetzgerät Live-3D (Legacy)' : 'Live-3D (Legacy)'}
                onSnapshotWarmed={onLiveEngineSnapshotWarmed}
              />
            ) : null}
            {pending?.type === 'build' && (
              <div
                data-testid="build-target-pill"
                className="mx-auto w-fit rounded-full border border-purple-400/50 bg-purple-950/60 px-3 py-1 text-xs font-semibold text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
              >
                {buildHasFreeSlot ? 'Zielslot wählen — freier Slot' : 'Zielslot wählen — Karte ersetzen'}
              </div>
            )}

            <HandFan
              cards={view.handCards}
              pending={pending}
              visibleCount={humanHandVisible}
              dealRevealActive={!openingDealFinished}
              hiddenInstanceIds={humanHandHiddenIds}
              hasChallengeTargets={hasChallengeTargets}
              onSelectAttack={handleSelectAttack}
              onPlayBoost={(id) => {
                onDispatch({ type: 'PLAY_BOOST', cardInstanceId: id });
                onPendingChange(null);
              }}
              onBuildDirect={handleBuildDirect}
              onStartBuildReplace={handleStartBuildReplace}
              onPlayBlock={onPlayBlock}
              onDiscardDraw={handleDiscardDraw}
              onActivateDiscard={handleActivateDiscard}
              onPlayGlitch={handlePlayGlitch}
              onPlayItem={handlePlayItem}
            />

            {pending?.type === 'attack' && (
              <p className="text-center text-[11px] text-stone-400 sm:text-xs">
                {hasChallengeTargets
                  ? v5Formula
                    ? 'Herausfordern: Gegner-Formelkomponente anklicken. Direktangriff trifft die LP des Gegners.'
                    : 'Herausfordern: Gegner-Engine-Slot anklicken. Direktangriff trifft die LP des Gegners.'
                  : 'Kein Herausforderungsziel — nur Direktangriff möglich.'}
              </p>
            )}
          </section>
          </div>

          <aside
            data-testid="bot-dock-sidebar"
            className="hidden shrink-0 flex-col justify-start gap-2 p-2 pt-3 sm:flex sm:w-36 md:w-44 lg:w-48"
          >
            <CharacterDock
              state={state}
              pack={pack}
              playerId={botId}
              side="bot"
              variant="full"
              handVisibleCount={botHandCount}
              displayHp={dockHp(botId)}
              className="h-52 w-full md:h-60"
            />
            {view.arena && !state.winner && (
              <ArenaPlaymatBadge
                arena={view.arena}
                arenaState={state.arena}
                placement="sidebar"
              />
            )}
          </aside>
        </div>
      </div>
      {!v5Formula && chargeConfirm && (
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
    </DndPlaymat>
  );
}
