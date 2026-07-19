/**
 * In-match card face — delegates to LetzFetzCard grunge frame.
 * Location: src/components/game/BoardCard.tsx
 */
import React from 'react';
import type { ElementCardDef, GlitchCardDef } from '../../game/types';
import { LetzFetzCard, type LetzFetzCardSize } from '../cards/LetzFetzCard';
import { elementDefToForgeProps } from '../cards/cardDisplayModel';
import { resolveCardArtPath } from '../../services/cardArt/manifest';
import { CardEffectTooltip } from './CardEffectTooltip';

export type BoardCardSize = 'hand' | 'bound' | 'opponentBound' | 'combat' | 'showcase';

const LETZ_SIZE: Record<BoardCardSize, LetzFetzCardSize> = {
  hand: 'md',
  bound: 'md',
  opponentBound: 'sm',
  combat: 'lg',
  /** Full lg face — draw / center reveals */
  showcase: 'lg',
};

const SIZE_OVERRIDES: Partial<Record<BoardCardSize, string>> = {
  bound: 'w-24 h-36 sm:w-28 sm:h-40',
  opponentBound: 'w-20 h-28 sm:w-24 sm:h-36',
  /** Combat overlays — large but fits viewport with value stacks */
  combat: 'w-40 h-60 sm:w-48 sm:h-72 md:w-52 md:h-80',
};

function ringClass(
  selected: boolean,
  targetable: boolean,
  playable: boolean,
  size: BoardCardSize,
): string {
  if (selected) return 'ring-2 ring-purple-400 ring-offset-1 ring-offset-stone-950';
  if (targetable) return 'ring-2 ring-amber-400 ring-offset-1 ring-offset-stone-950';
  if (playable) {
    if (size === 'hand') {
      return 'ring-2 ring-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.35)] ring-offset-1 ring-offset-stone-950';
    }
    return 'ring-2 ring-emerald-500/80 ring-offset-1 ring-offset-stone-950';
  }
  return '';
}

function handMotionClass(size: BoardCardSize, playable: boolean, dimmed: boolean): string {
  if (size !== 'hand') return '';
  if (playable) return 'transition-transform hover:z-10 hover:scale-105';
  if (dimmed) return '';
  return '';
}

export interface BoardCardProps {
  def?: ElementCardDef;
  glitchDef?: GlitchCardDef | null;
  defId?: string;
  name?: string;
  size?: BoardCardSize;
  faceDown?: boolean;
  selected?: boolean;
  playable?: boolean;
  dimmed?: boolean;
  exhausted?: boolean;
  targetable?: boolean;
  disabled?: boolean;
  dataInteraction?: string;
  /** Extra line in the hover tooltip (e.g. attack targeting hint). */
  tooltipHint?: string;
  /** Set false to disable the effect tooltip. */
  showEffectTooltip?: boolean;
  onClick?: () => void;
}

export function BoardCard({
  def,
  glitchDef,
  defId,
  name,
  size = 'hand',
  faceDown = false,
  selected = false,
  playable = false,
  dimmed = false,
  exhausted = false,
  targetable = false,
  disabled = false,
  dataInteraction,
  tooltipHint,
  showEffectTooltip = true,
  onClick,
}: BoardCardProps) {
  const letzSize = LETZ_SIZE[size];
  const sizeOverride = SIZE_OVERRIDES[size] ?? '';
  const cardDisabled = onClick !== undefined ? disabled : undefined;

  const wrapTooltip = (node: React.ReactNode) => {
    if (!showEffectTooltip || faceDown) return node;
    if (!def && !glitchDef) return node;
    return (
      <CardEffectTooltip def={def} glitchDef={glitchDef} hint={tooltipHint}>
        {node}
      </CardEffectTooltip>
    );
  };

  if (faceDown) {
    return (
      <LetzFetzCard
        id="face-down"
        name=""
        type="Element"
        element="Neutral"
        size={letzSize}
        faceDown
        className={`flex-none ${sizeOverride}`}
      />
    );
  }

  if (!def) {
    const artPath = resolveCardArtPath(defId ?? name ?? 'glitch');
    const glitchLabel = glitchDef?.name ?? name ?? 'Glitch';
    const glitchEffects = glitchDef
      ? [`Timing: ${glitchDef.timing}`, `Effekt: ${glitchDef.effectText}`]
      : [name ?? 'Unbekannter Glitch'];

    return wrapTooltip(
      <LetzFetzCard
        id={defId ?? glitchDef?.id ?? name ?? 'glitch'}
        name={glitchLabel}
        type="Glitch"
        element="Neutral"
        size={letzSize}
        effects={glitchEffects}
        image_asset={artPath || undefined}
        data-interaction={dataInteraction}
        className={`flex-none ${sizeOverride} ${ringClass(selected, targetable, playable, size)} ${handMotionClass(size, playable, dimmed)} ${dimmed ? 'opacity-55 saturate-75' : ''}`}
        onClick={onClick}
        disabled={cardDisabled}
      />,
    );
  }

  const props = elementDefToForgeProps(def);
  const effectFocus =
    size === 'bound' || size === 'opponentBound' ? ('bound' as const) : ('instant' as const);

  return wrapTooltip(
    <LetzFetzCard
      {...props}
      id={props.id ?? def.id}
      name={props.name ?? def.name}
      type="Element"
      element={props.element ?? 'Neutral'}
      size={letzSize}
      selected={selected}
      exhausted={exhausted}
      effectFocus={effectFocus}
      onClick={onClick}
      disabled={cardDisabled}
      data-interaction={dataInteraction}
      className={`flex-none ${sizeOverride} ${ringClass(selected, targetable, playable || targetable, size)} ${handMotionClass(size, playable || targetable, dimmed && !playable)} ${dimmed && !playable ? 'opacity-55 saturate-75' : ''}`}
    />,
  );
}
