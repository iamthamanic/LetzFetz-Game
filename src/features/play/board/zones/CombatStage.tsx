/**
 * Central combat stage on the playmat — block window (cards only, no dice yet).
 * Location: src/features/play/board/zones/CombatStage.tsx
 */
import React from 'react';
import type { ContentPack, GameAction, GameState, PlayerId } from '../../../../game';
import { findElementDef, findItemDef } from '../../../../game';
import type { PendingCombat } from '../../../../game/types';
import { BoardCard } from '../BoardCard';
import { Button } from '../../../../components/ui/Button';
import {
  buildCombatStageAttackTypeLine,
  buildCombatStageImpulseLine,
  buildCombatStageSubtitle,
  buildCombatStageTitle,
} from '../combatStageCopy';

interface CombatStageProps {
  combat: PendingCombat;
  state: GameState;
  pack: ContentPack;
  humanId: PlayerId;
  isHumanDefender: boolean;
  botThinking: boolean;
  blockActions: GameAction[];
  reactionItemActions?: GameAction[];
  onPlayBlock: (instanceId: string) => void;
  onPlayReactionItem?: (instanceId: string) => void;
  onPassBlock: () => void;
}

export function CombatStage({
  combat,
  state,
  pack,
  humanId,
  isHumanDefender,
  botThinking,
  blockActions,
  reactionItemActions = [],
  onPlayBlock,
  onPlayReactionItem,
  onPassBlock,
}: CombatStageProps) {
  const attackDef = findElementDef(pack, combat.attackCardDefId);
  const defenderId = combat.defenderId;
  const targetBound =
    combat.mode === 'challenge' && combat.targetBoundInstanceId
      ? state.players[defenderId].bound.find(
          (b) => b.instanceId === combat.targetBoundInstanceId,
        )
      : undefined;
  const targetDef = targetBound ? findElementDef(pack, targetBound.defId) : undefined;

  const title = buildCombatStageTitle(combat, isHumanDefender);
  const subtitle = buildCombatStageSubtitle(isHumanDefender, botThinking, attackDef);
  const attackTypeLine = buildCombatStageAttackTypeLine(attackDef);
  const impulseLine = buildCombatStageImpulseLine(attackDef);
  const canBlock = blockActions.some((a) => a.type === 'PLAY_BLOCK');
  const reactionItems = reactionItemActions.filter(
    (a) => a.type === 'PLAY_ITEM' || a.type === 'ACTIVATE_EQUIPMENT',
  );

  return (
    <div
      data-testid="combat-stage-overlay"
      className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center bg-black/55 p-3 sm:p-5"
    >
      <div
        data-testid="combat-stage"
        data-combat-mode={combat.mode}
        data-human-defender={isHumanDefender ? 'true' : 'false'}
        className="pointer-events-auto flex max-h-[min(94vh,58rem)] w-[min(96vw,64rem)] flex-col overflow-y-auto overflow-x-visible rounded-2xl border-2 border-amber-500/55 bg-stone-950/95 p-4 shadow-2xl shadow-amber-950/40 backdrop-blur-md sm:p-6 md:p-8"
        role="region"
        aria-label={title}
      >
        <div className="flex-none space-y-1 text-center">
          <h2 className="text-lg font-bold text-amber-100 sm:text-xl">{title}</h2>
          <p className="text-sm text-stone-400">{subtitle}</p>
          {attackTypeLine && (
            <p
              data-testid="combat-stage-attack-type"
              className="text-xs font-semibold uppercase tracking-wide text-amber-300/90"
            >
              {attackTypeLine}
            </p>
          )}
        </div>

        <div className="flex min-h-0 flex-1 items-stretch justify-center gap-3 py-4 sm:gap-6 sm:py-5">
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3">
            {attackDef && (
              <div
                data-testid="combat-stage-attack-card"
                className="flex shrink-0 flex-col items-center gap-1.5"
              >
                <BoardCard def={attackDef} size="combat" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-red-300/90">
                  Angriff
                </span>
                {impulseLine && (
                  <span
                    data-testid="combat-stage-impulse"
                    className="max-w-[11rem] text-center text-[10px] font-semibold leading-snug text-amber-200/90 sm:max-w-[14rem] sm:text-[11px]"
                  >
                    {impulseLine}
                  </span>
                )}
              </div>
            )}
            <span data-testid="combat-stage-attack-value" className="sr-only">
              Angriffskarte gespielt — Würfel nach Block-Entscheidung
            </span>
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center gap-2 px-2">
            <div data-testid="combat-stage-vs" className="match-intro-vs" aria-hidden>
              <span className="match-intro-vs-text uppercase leading-none tracking-[0.2em]">
                VS
              </span>
            </div>
            {targetDef && (
              <div className="flex flex-col items-center gap-1">
                <BoardCard def={targetDef} size="bound" exhausted={targetBound?.exhausted} />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                  Ziel
                </span>
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3">
            <div
              data-testid="combat-stage-defender-value"
              className="flex h-44 w-28 shrink-0 flex-col items-center justify-center rounded-md border border-dashed border-cyan-600/55 bg-cyan-950/30 px-3 text-center sm:h-56 sm:w-36"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/90">
                Verteidigung
              </span>
              <span className="mt-3 text-2xl font-black tabular-nums text-cyan-200/80 sm:text-3xl">
                {isHumanDefender ? '?' : botThinking ? '…' : '—'}
              </span>
              <span className="mt-2 text-[10px] leading-snug text-cyan-200/70">
                {isHumanDefender
                  ? 'Karte wählen oder passen'
                  : botThinking
                    ? 'Gegner entscheidet…'
                    : 'Warte…'}
              </span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300/80">
              Verteidigung
            </span>
          </div>
        </div>

        {isHumanDefender && (
          <div className="flex-none space-y-3 border-t border-stone-700/80 pt-3">
            {reactionItems.length > 0 && onPlayReactionItem && (
              <div data-testid="combat-stage-reaction-items" className="space-y-2">
                <p className="text-center text-sm font-medium text-violet-200/90">
                  Reaktions-Gegenstände
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {reactionItems.map((action) => {
                    if (action.type === 'PLAY_ITEM') {
                      const card = state.players[humanId].hand.find(
                        (c) => c.instanceId === action.cardInstanceId,
                      );
                      const item = card ? findItemDef(pack, card.defId) : undefined;
                      if (!item) return null;
                      return (
                        <Button
                          key={action.cardInstanceId}
                          variant="secondary"
                          size="sm"
                          className="text-sm"
                          data-testid={`combat-reaction-item-${item.id}`}
                          onClick={() => onPlayReactionItem(action.cardInstanceId)}
                        >
                          {item.name} (−1 Angriff)
                        </Button>
                      );
                    }
                    if (action.type === 'ACTIVATE_EQUIPMENT') {
                      const eq = state.players[humanId].equipment?.find(
                        (c) => c.instanceId === action.equipmentInstanceId,
                      );
                      const item = eq ? findItemDef(pack, eq.defId) : undefined;
                      if (!item) return null;
                      const label =
                        action.diceMod === 1
                          ? `${item.name} (−1 Angriff)`
                          : action.diceMod === -1
                            ? `${item.name} (+1 Angriff)`
                            : `${item.name} (−1 Angriff)`;
                      return (
                        <Button
                          key={`${action.equipmentInstanceId}-${action.diceMod ?? 'x'}`}
                          variant="secondary"
                          size="sm"
                          className="text-sm"
                          data-testid={`combat-reaction-equip-${item.id}`}
                          onClick={() => onPlayReactionItem(action.equipmentInstanceId)}
                        >
                          {label}
                        </Button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
            <p className="text-center text-sm font-medium text-cyan-200/90">
              {canBlock
                ? 'Block-Karten — höchster Wert zählt (Würfel erst danach)'
                : 'Keine Block-Karte auf der Hand'}
            </p>
            {canBlock && (
              <div
                data-testid="combat-stage-block-hand"
                className="flex flex-wrap items-end justify-center gap-3"
              >
                {blockActions.map((action) => {
                  if (action.type !== 'PLAY_BLOCK') return null;
                  const card = state.players[humanId].hand.find(
                    (c) => c.instanceId === action.cardInstanceId,
                  );
                  const def = card ? findElementDef(pack, card.defId) : undefined;
                  return def ? (
                    <BoardCard
                      key={action.cardInstanceId}
                      def={def}
                      size="bound"
                      playable
                      onClick={() => onPlayBlock(action.cardInstanceId)}
                    />
                  ) : null;
                })}
              </div>
            )}
            <Button variant="secondary" size="sm" className="w-full text-sm" onClick={onPassBlock}>
              Nicht blocken
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
