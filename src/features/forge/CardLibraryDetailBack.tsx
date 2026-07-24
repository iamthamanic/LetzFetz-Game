/**
 * Parchment "back" face for Card Library hover — full card info (Character Info/Ulti style).
 * Location: src/features/forge/CardLibraryDetailBack.tsx
 */
import React from 'react';
import { categoryLabel } from './model/categories';
import type { ForgeCardData } from './model/types';
import { forgeCharacterDefFromCard } from './model/characterFromForgeCard';
import { CARD_ELEMENT_DE } from '../../components/cards/cardTypes';
import { getUltimateForCharacter } from '../../game/packs/characterSetup';
import { CardNamePlate } from '../../components/ui/CardNamePlate';
import { CardDividerBar } from '../../components/cards/grungeCardParts';
import { ElementIcon, ELEMENT_LABELS_DE } from '../../components/ui/ElementIcon';
import { characterUsesMysteryIcon } from '../../services/icons/elementIcons';
import { CardIllustrationLoop } from '../../components/ui/CardIllustrationLoop';
import { CardGrungeOverlay } from '../../components/ui/CardGrungeOverlay';

const CARD_TYPE_DE: Record<string, string> = {
  attack: 'Angriff',
  block: 'Block',
  boost: 'Boost',
};

/** Meta lines already shown as DetailRows — hide from Effekte list. */
const EFFECT_META_PREFIXES = [
  'Element:',
  'Typ:',
  'Wert:',
  'Widerstand:',
  'Rolle:',
  'Kartenart:',
];

function stripEffectPrefix(line: string, prefix: string): string | null {
  if (!line.startsWith(prefix)) return null;
  return line.slice(prefix.length).trim();
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  if (children == null || children === '') return null;
  return (
    <div className="space-y-1.5">
      <p className="font-brand-on-parchment text-[10px] uppercase leading-none tracking-wide md:text-xs">
        {label}
      </p>
      <div className="text-on-parchment-muted text-xs leading-snug md:text-[13px]">{children}</div>
    </div>
  );
}

interface CardLibraryDetailBackProps {
  card: ForgeCardData;
  /** When true, skip Ulti text (shown as separate panel beside). */
  omitUltimate?: boolean;
  /** Fill parent height instead of fixed 2:3 card aspect. */
  fillHeight?: boolean;
}

export function CardLibraryDetailBack({
  card,
  omitUltimate = false,
  fillHeight = false,
}: CardLibraryDetailBackProps) {
  const characterDef =
    card.type === 'Character'
      ? forgeCharacterDefFromCard({
          id: card.id,
          name: card.name,
          type: card.type,
          elements: card.elements,
          effects: card.effects,
        })
      : null;
  const ultimate =
    !omitUltimate && characterDef ? getUltimateForCharacter(characterDef) : undefined;
  const cardTypeLabel = card.stats_json?.cardType
    ? CARD_TYPE_DE[card.stats_json.cardType] ?? card.stats_json.cardType
    : null;

  const elementLabel =
    card.elementDisplay || CARD_ELEMENT_DE[card.element] || card.element;

  const instantLines: string[] = [];
  const boundLines: string[] = [];
  const otherEffectLines: string[] = [];
  for (const raw of card.effects || []) {
    const line = raw.trim();
    if (!line) continue;
    if (EFFECT_META_PREFIXES.some((p) => line.startsWith(p))) continue;
    const instant = stripEffectPrefix(line, 'Sofort:');
    if (instant) {
      instantLines.push(instant);
      continue;
    }
    const bound =
      stripEffectPrefix(line, 'Gebaut:') ||
      stripEffectPrefix(line, 'Gebunden:') ||
      stripEffectPrefix(line, 'Grundeffekt:') ||
      stripEffectPrefix(line, 'Sonderregel:') ||
      stripEffectPrefix(line, 'Trigger:');
    if (bound && (line.startsWith('Gebaut:') || line.startsWith('Gebunden:'))) {
      boundLines.push(bound);
      continue;
    }
    if (line.startsWith('Grundeffekt:') || line.startsWith('Sonderregel:') || line.startsWith('Trigger:')) {
      otherEffectLines.push(line);
      continue;
    }
    if (line.startsWith('Varianten')) {
      otherEffectLines.push(line);
      continue;
    }
    const effect = stripEffectPrefix(line, 'Effekt:') || stripEffectPrefix(line, 'Passiv:');
    if (effect) {
      otherEffectLines.push(line.startsWith('Passiv:') ? `Passiv: ${effect}` : effect);
      continue;
    }
    otherEffectLines.push(line);
  }

  const frameClass = fillHeight
    ? 'character-card-frame relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2px] text-left shadow-xl ring-1 ring-inset ring-amber-950/25 character-card-frame-highlighted ring-amber-700/30'
    : 'character-card-frame relative flex aspect-[2/3] w-full max-w-[220px] flex-col overflow-hidden rounded-[2px] text-left shadow-xl ring-1 ring-inset ring-amber-950/25 sm:max-w-[240px] character-card-frame-highlighted ring-amber-700/30';

  return (
    <div
      className={frameClass}
      data-testid="card-library-detail-back"
      aria-label={`${card.name || 'Unbenannt'} — Rückseite`}
    >
      <div className="parchment-bar-header parchment-bar-beige parchment-bar-noise relative z-10 shrink-0 border-b px-3 pb-2 pt-2.5">
        <div className="parchment-bar-stain" aria-hidden />
        <CardNamePlate cardId={card.id} name={card.name || 'Unbenannt'} size="md" />
        <CardDividerBar className="relative z-[1] mt-2" />
      </div>

      <div className="parchment-bar-body parchment-bar-beige parchment-bar-noise relative min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <div className="parchment-bar-stain" aria-hidden />
        <div className="relative z-[1] space-y-3.5">
          <DetailRow label="Kartenart">{categoryLabel(card.type)}</DetailRow>

          {characterDef ? (
            <>
              <DetailRow label="Elemente">
                {characterUsesMysteryIcon(characterDef.id) ? (
                  <span className="inline-flex items-center gap-1.5 text-on-parchment">
                    <ElementIcon element="mystery" size="sm" variant="grunge" />
                    Frei / Frei
                  </span>
                ) : (
                  <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-on-parchment">
                    <span className="inline-flex items-center gap-1">
                      <ElementIcon element={characterDef.elements[0]} size="sm" variant="grunge" />
                      {ELEMENT_LABELS_DE[characterDef.elements[0]]}
                    </span>
                    <span aria-hidden className="opacity-70">
                      /
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ElementIcon element={characterDef.elements[1]} size="sm" variant="grunge" />
                      {ELEMENT_LABELS_DE[characterDef.elements[1]]}
                    </span>
                  </span>
                )}
              </DetailRow>
              <DetailRow label="Rolle">{characterDef.role}</DetailRow>
              <DetailRow label="Passiv">{characterDef.passiveText}</DetailRow>
              <DetailRow label="Strategie">{characterDef.strategyHint}</DetailRow>
              {!omitUltimate && ultimate ? (
                <DetailRow label="Ultimativ">
                  <span className="font-brand-on-parchment block text-xs uppercase tracking-wide">
                    {ultimate.name}
                  </span>
                  <span className="mt-1 block">{ultimate.effectText}</span>
                </DetailRow>
              ) : null}
            </>
          ) : (
            <>
              <DetailRow label="Element">{elementLabel}</DetailRow>
              {cardTypeLabel ? <DetailRow label="Typ">{cardTypeLabel}</DetailRow> : null}
              {card.stats_json?.value != null ? (
                <DetailRow label="Wert">{card.stats_json.value}</DetailRow>
              ) : null}
              {card.stats_json?.hp != null ? (
                <DetailRow label="Startleben">{card.stats_json.hp}</DetailRow>
              ) : null}
              {card.stats_json?.resistance != null ? (
                <DetailRow label="Resistenz">{card.stats_json.resistance}</DetailRow>
              ) : null}
              {instantLines.map((text, i) => (
                <DetailRow key={`${card.id}-sofort-${i}`} label="Sofort">
                  {text}
                </DetailRow>
              ))}
              {boundLines.map((text, i) => (
                <DetailRow key={`${card.id}-gebaut-${i}`} label="Gebaut">
                  {text}
                </DetailRow>
              ))}
              {otherEffectLines.length > 0 ? (
                <DetailRow label="Effekte">
                  <ul className="list-none space-y-1.5">
                    {otherEffectLines.map((line, i) => (
                      <li key={`${card.id}-fx-${i}`}>{line}</li>
                    ))}
                  </ul>
                </DetailRow>
              ) : null}
              {card.type === 'Ultimate' ? (
                <div className="relative mt-1 aspect-video overflow-hidden rounded-sm bg-[#090807]">
                  <CardGrungeOverlay
                    filterId={`lib-ulti-art-${card.id.replace(/[^a-zA-Z0-9_-]/g, '')}`}
                    mode="art-panel"
                  />
                  <CardIllustrationLoop
                    cardId={card.id}
                    className="relative z-[1] h-full w-full object-cover object-center"
                  />
                </div>
              ) : null}
            </>
          )}

          {card.notes ? <DetailRow label="Notizen">{card.notes}</DetailRow> : null}
        </div>
      </div>
    </div>
  );
}
