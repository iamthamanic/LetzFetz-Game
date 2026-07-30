/**
 * Combinate formula card detail modal — Material-style 3-panel preview.
 * Location: src/features/build/FormulaCardDetailModal.tsx
 */
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CardNamePlate } from '../../components/ui/CardNamePlate';
import { CardDividerBar } from '../../components/cards/grungeCardParts';
import { LetzFetzCard } from '../../components/cards/LetzFetzCard';
import { CARD_ELEMENT_DE, type CardElement } from '../../components/cards/cardTypes';
import { ELEMENT_LABELS_DE } from '../../components/ui/ElementIcon';
import { BUILD_SLOT_LABEL_DE } from './model/buildTypes';
import type { FormulaCatalogCard } from './model/combinateFormula';
import type { Element } from '../../game/types/elements';

const ACTIVATION_MODE_DE: Record<string, string> = {
  prep_attack: 'Angriff vorbereiten',
  prep_block: 'Block vorbereiten',
  prep_boost: 'Boost vorbereiten',
  instant: 'Sofort',
};

const ELEMENT_TO_CARD: Record<Element, CardElement> = {
  fire: 'Fire',
  water: 'Water',
  earth: 'Earth',
  air: 'Air',
  light: 'Light',
  shadow: 'Shadow',
};

const PANEL_FRAME =
  'character-card-frame relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2px] text-left shadow-xl ring-1 ring-inset ring-amber-950/25 character-card-frame-highlighted ring-amber-700/30';

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

function ParchmentPanel({
  title,
  children,
  testId,
}: {
  title: string;
  children: React.ReactNode;
  testId: string;
}) {
  return (
    <div className={PANEL_FRAME} data-testid={testId}>
      <div className="parchment-bar-header parchment-bar-beige parchment-bar-noise relative z-10 shrink-0 border-b px-3 pb-2 pt-2.5">
        <div className="parchment-bar-stain" aria-hidden />
        <CardNamePlate cardId={`${testId}-title`} name={title} size="md" />
        <CardDividerBar className="relative z-[1] mt-2" />
      </div>
      <div className="parchment-bar-body parchment-bar-beige parchment-bar-noise relative min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <div className="parchment-bar-stain" aria-hidden />
        <div className="relative z-[1] space-y-3.5">{children}</div>
      </div>
    </div>
  );
}

interface FormulaCardDetailModalProps {
  card: FormulaCatalogCard;
  onClose: () => void;
}

export function FormulaCardDetailModal({ card, onClose }: FormulaCardDetailModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const cardElement: CardElement = card.element ? ELEMENT_TO_CARD[card.element] : 'Neutral';
  const elementLabel = card.element
    ? ELEMENT_LABELS_DE[card.element]
    : CARD_ELEMENT_DE.Neutral;
  const modeLabel = card.activationMode
    ? ACTIVATION_MODE_DE[card.activationMode] ?? card.activationMode
    : null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-3 sm:p-5"
      data-testid="formula-card-detail-root"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${card.name} Details`}
        data-testid="formula-card-detail"
        className="relative flex max-h-[90vh] w-fit max-w-[min(96vw,56rem)] flex-col overflow-hidden rounded-xl border border-stone-500/60 bg-stone-950/98 p-2 shadow-2xl backdrop-blur-md sm:p-2.5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex shrink-0 items-center justify-between border-b border-stone-700/60 px-1 pb-2 sm:px-2">
          <span className="font-brand text-sm uppercase tracking-wide text-stone-200">
            {card.name}
          </span>
          <Button
            variant="danger"
            size="sm"
            icon={<X className="h-4 w-4" />}
            onClick={onClose}
            className="font-brand uppercase leading-none tracking-wide"
            aria-label="Details schließen"
            data-testid="formula-card-detail-close"
          >
            Close
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
          <div className="flex flex-nowrap flex-row items-stretch justify-center gap-2 pb-1 sm:gap-2.5">
            <div
              className="flex h-96 w-64 shrink-0 flex-col"
              data-testid="formula-card-detail-front"
            >
              <LetzFetzCard
                id={card.id}
                name={card.name}
                type="Formula"
                element={cardElement}
                stats_json={{ resistance: card.stability }}
                effects={[`Effekt: ${card.effectText}`]}
                image_asset={card.imageUrl}
                role={BUILD_SLOT_LABEL_DE[card.role]}
                size="lg"
                layout="portrait"
                hideHeader
                interactive={false}
                className="!h-full !w-full !max-w-none"
              />
            </div>

            <div className="flex h-96 w-64 min-w-0 shrink-0 flex-col">
              <ParchmentPanel title="Effekt" testId="formula-card-detail-effect">
                <p className="text-on-parchment text-sm leading-relaxed md:text-[15px]">
                  {card.effectText.trim() || 'Kein Effekttext hinterlegt.'}
                </p>
              </ParchmentPanel>
            </div>

            <div className="flex h-96 w-72 min-w-0 shrink-0 flex-col">
              <ParchmentPanel title="Details" testId="formula-card-detail-info">
                <DetailRow label="Kartenart">Formel</DetailRow>
                <DetailRow label="Rolle">{BUILD_SLOT_LABEL_DE[card.role]}</DetailRow>
                <DetailRow label="Element">{elementLabel}</DetailRow>
                <DetailRow label="Stabilität">{card.stability}</DetailRow>
                {modeLabel ? <DetailRow label="Modus">{modeLabel}</DetailRow> : null}
                <DetailRow label="ID">
                  <span className="break-all font-mono text-[11px]">{card.id}</span>
                </DetailRow>
              </ParchmentPanel>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
