/**
 * Central combat stage on the playmat — attack card, values, block window.
 * Location: src/components/game/zones/CombatStage.tsx
 */
import React from 'react';
import type { CSSProperties } from 'react';
import type { ContentPack, GameAction, GameState, PlayerId } from '../../../game';
import { findElementDef } from '../../../game';
import type { PendingCombat } from '../../../game/types';
import { BoardCard } from '../BoardCard';
import { Button } from '../../ui/Button';
import { CombatDiceRoll } from '../CombatDiceRoll';
import {
  buildCombatStageSubtitle,
  buildCombatStageTitle,
  combatValueLabel,
  defenderPendingValue,
  defenderValueLabel,
} from '../combatStageCopy';

interface CombatStageProps {
  combat: PendingCombat;
  state: GameState;
  pack: ContentPack;
  humanId: PlayerId;
  isHumanDefender: boolean;
  botThinking: boolean;
  blockActions: GameAction[];
  style?: CSSProperties;
  onPlayBlock: (instanceId: string) => void;
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
  style,
  onPlayBlock,
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
  const subtitle = buildCombatStageSubtitle(isHumanDefender, botThinking);
  const attackLabel = combatValueLabel(combat);
  const blockLabel = defenderValueLabel(combat);
  const pendingBlock = defenderPendingValue(isHumanDefender, botThinking);

  return (
    <div
      data-testid="combat-stage"
      data-combat-mode={combat.mode}
      data-human-defender={isHumanDefender ? 'true' : 'false'}
      className="pointer-events-auto z-30 flex min-h-0 flex-col overflow-hidden rounded-xl border-2 border-amber-500/45 bg-stone-950/88 p-2 shadow-2xl shadow-amber-950/30 backdrop-blur-md"
      style={style}
      role="region"
      aria-label={title}
    >
      <div className="flex-none space-y-0.5 text-center">
        <h2 className="truncate text-xs font-bold text-amber-100 sm:text-sm">{title}</h2>
        <p className="text-[10px] text-stone-400 sm:text-xs">{subtitle}</p>
      </div>

      <div className="flex min-h-0 flex-1 items-stretch justify-center gap-1 py-1 sm:gap-2">
        {/* Attacker column */}
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
          {attackDef && (
            <div className="flex shrink-0 flex-col items-center gap-0.5">
              <BoardCard def={attackDef} size="opponentBound" />
              <span className="text-[9px] font-semibold uppercase tracking-wide text-red-300/90">
                Angriff
              </span>
            </div>
          )}
          <div className="flex shrink-0 flex-col items-center justify-center rounded-lg border border-red-500/40 bg-red-950/40 px-2 py-1">
            <span className="text-[9px] uppercase tracking-wide text-red-200/80">{attackLabel}</span>
            <span
              data-testid="combat-stage-attack-value"
              className="text-xl font-black tabular-nums text-red-300 sm:text-2xl"
            >
              {combat.attackValue}
            </span>
            <CombatDiceRoll roll={combat.attackRoll} />
          </div>
        </div>

        {/* VS + challenge target */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-0.5">
          <span
            data-testid="combat-stage-vs"
            className="text-base font-black text-amber-400/90 sm:text-lg"
            aria-hidden
          >
            VS
          </span>
          {targetDef && (
            <div className="flex flex-col items-center gap-0.5">
              <BoardCard def={targetDef} size="opponentBound" exhausted={targetBound?.exhausted} />
              <span className="text-[8px] font-semibold uppercase tracking-wide text-stone-400">
                Ziel
              </span>
            </div>
          )}
        </div>

        {/* Defender column */}
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
          <div
            data-testid="combat-stage-defender-value"
            className="flex shrink-0 flex-col items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-950/35 px-2 py-1"
          >
            <span className="text-[9px] uppercase tracking-wide text-cyan-200/80">{blockLabel}</span>
            <span className="text-xl font-black tabular-nums text-cyan-300 sm:text-2xl">
              {pendingBlock}
            </span>
            {botThinking && !isHumanDefender && (
              <span className="text-[9px] text-cyan-200/70">Würfel…</span>
            )}
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-wide text-cyan-300/80">
            Verteidigung
          </span>
        </div>
      </div>

      {isHumanDefender && (
        <div className="flex-none space-y-1.5 border-t border-stone-700/80 pt-1.5">
          <p className="text-center text-[10px] font-medium text-cyan-200/80">
            Block-Karten — höchster Wert zählt
          </p>
          <div
            data-testid="combat-stage-block-hand"
            className="flex flex-wrap items-end justify-center gap-1.5 sm:gap-2"
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
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs"
            onClick={onPassBlock}
          >
            Nicht blocken
          </Button>
        </div>
      )}
    </div>
  );
}
