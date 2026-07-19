/**
 * Info / Ulti text panels for character setup carousel (center slide).
 * Location: src/components/game/CharacterDetailPanel.tsx
 */
import React from 'react';
import type { CharacterCardDef, UltimateCardDef } from '../../game';
import { CardIllustrationLoop } from '../ui/CardIllustrationLoop';
import { CardNamePlate } from '../ui/CardNamePlate';
import { CardGrungeOverlay } from '../ui/CardGrungeOverlay';
import { ElementIcon, ELEMENT_LABELS_DE } from '../ui/ElementIcon';
import { characterUsesMysteryIcon } from '../../services/icons/elementIcons';
import { CardDividerBar } from '../cards/grungeCardParts';

export type CharacterDetailTab = 'info' | 'ulti';

interface CharacterDetailPanelProps {
  character: CharacterCardDef;
  tab: CharacterDetailTab;
  ultimate?: UltimateCardDef;
  /** Override frame sizing (e.g. library hover fill height). */
  className?: string;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="font-brand-on-parchment text-[10px] uppercase leading-none tracking-wide md:text-xs">
        {label}
      </p>
      <div className="text-on-parchment-muted text-xs leading-relaxed md:text-sm">{children}</div>
    </div>
  );
}

function CharacterElementsRow({ character }: { character: CharacterCardDef }) {
  if (characterUsesMysteryIcon(character.id)) {
    return (
      <div className="flex flex-wrap items-center gap-1.5 text-on-parchment">
        <ElementIcon element="mystery" size="sm" variant="grunge" />
        <span>Frei / Frei</span>
      </div>
    );
  }

  const [elA, elB] = character.elements;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-on-parchment">
      <span className="inline-flex items-center gap-1">
        <ElementIcon element={elA} size="sm" variant="grunge" />
        {ELEMENT_LABELS_DE[elA]}
      </span>
      <span aria-hidden className="opacity-70">
        /
      </span>
      <span className="inline-flex items-center gap-1">
        <ElementIcon element={elB} size="sm" variant="grunge" />
        {ELEMENT_LABELS_DE[elB]}
      </span>
    </div>
  );
}

export function CharacterDetailPanel({
  character,
  tab,
  ultimate,
  className = '',
}: CharacterDetailPanelProps) {
  const frameClass =
    className ||
    'character-card-frame relative flex aspect-[2/3] w-full max-w-[240px] flex-col overflow-hidden rounded-[2px] text-left shadow-xl ring-1 ring-inset ring-amber-950/25 sm:max-w-[260px] md:max-w-[280px] character-card-frame-highlighted ring-amber-700/30';

  if (tab === 'info') {
    return (
      <div
        className={frameClass}
        data-testid="character-detail-info"
        aria-label={`${character.name} — Info`}
      >
        <div className="parchment-bar-header parchment-bar-beige parchment-bar-noise relative z-10 shrink-0 border-b px-3 pb-2 pt-2">
          <div className="parchment-bar-stain" aria-hidden />
          <CardNamePlate cardId={character.id} name={character.name} size="md" />
          <CardDividerBar className="relative z-[1] mt-2" />
        </div>
        <div className="parchment-bar-body parchment-bar-beige parchment-bar-noise relative min-h-0 flex-1 overflow-y-auto px-3 py-3">
          <div className="parchment-bar-stain" aria-hidden />
          <div className="relative z-[1] space-y-3">
            <DetailRow label="Elemente">
              <CharacterElementsRow character={character} />
            </DetailRow>
            <DetailRow label="Rolle">{character.role}</DetailRow>
            <DetailRow label="Passiv">{character.passiveText}</DetailRow>
            <DetailRow label="Strategie">{character.strategyHint}</DetailRow>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={frameClass}
      data-testid="character-detail-ulti"
      aria-label={`${character.name} — Ulti`}
    >
      <div className="parchment-bar-header parchment-bar-beige parchment-bar-noise relative z-10 shrink-0 border-b px-3 pb-2 pt-2">
        <div className="parchment-bar-stain" aria-hidden />
        <p className="font-brand-on-parchment-muted relative z-[1] text-center text-[10px] uppercase leading-none tracking-wide md:text-xs">
          Ultimativ
        </p>
        <CardDividerBar className="relative z-[1] mt-2" />
      </div>

      {ultimate ? (
        <>
          <div className="relative min-h-0 flex-1 overflow-hidden bg-[#090807]">
            <CardGrungeOverlay
              filterId={`ulti-art-${ultimate.id.replace(/[^a-zA-Z0-9_-]/g, '')}`}
              mode="art-panel"
            />
            <CardIllustrationLoop
              cardId={ultimate.id}
              className="relative z-[1] h-full w-full object-cover object-center"
              testId={`character-detail-ulti-media-${ultimate.id}`}
            />
            <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#5a5048]/90 via-transparent to-brand-beige-shadow/15" />
          </div>

          <div className="parchment-bar-footer parchment-bar-beige parchment-bar-noise relative z-10 max-h-[42%] shrink-0 overflow-y-auto border-t px-2 pb-2 pt-1.5">
            <div className="parchment-bar-stain" aria-hidden />
            <CardDividerBar className="relative z-[1] mb-1" />
            <p className="font-brand-on-parchment relative z-[1] text-center text-xs uppercase leading-none tracking-wide md:text-sm">
              {ultimate.name}
            </p>
            <p className="text-on-parchment-muted relative z-[1] mx-auto mt-1.5 max-w-[95%] text-center text-[10px] leading-snug md:text-xs">
              {ultimate.effectText}
            </p>
          </div>
        </>
      ) : (
        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[#1a1612] px-3 py-3">
          <p className="text-center text-sm text-stone-500">Ulti nicht gefunden.</p>
        </div>
      )}
    </div>
  );
}
