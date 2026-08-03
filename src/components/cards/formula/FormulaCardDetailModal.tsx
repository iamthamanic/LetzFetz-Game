/**
 * Material-style detail modal for Formel-Bausteine and Ausrüstung.
 * Location: src/components/cards/formula/FormulaCardDetailModal.tsx
 */
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { CardNamePlate } from '../../ui/CardNamePlate';
import { CardDividerBar } from '../grungeCardParts';
import { LetzFetzCard } from '../LetzFetzCard';
import { EffectTextWithMarks } from '../EffectTextWithMarks';
import { CARD_ELEMENT_DE, type CardElement } from '../cardTypes';
import { ELEMENT_LABELS_DE } from '../../ui/ElementIcon';
import { FORMULA_SLOT_LABEL_DE } from './formulaSlotMeta';
import { FormulaTypeBadges } from './FormulaTypeBadges';
import type { EquipmentDisplayCard, FormulaDisplayCard } from './formulaDisplayCard';
import type { Element } from '../../../game/types/elements';

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

export type FormulaDetailSubject =
  | { kind: 'formula'; card: FormulaDisplayCard }
  | { kind: 'equipment'; card: EquipmentDisplayCard };

export interface FormulaCardDetailPrimaryAction {
  label: string;
  onClick: () => void;
  /** Defaults to `formula-card-play-confirm`. */
  testId?: string;
}

interface FormulaCardDetailModalProps {
  subject: FormulaDetailSubject;
  onClose: () => void;
  /** Optional header CTA (e.g. Bau-Phase „Karte spielen“). */
  primaryAction?: FormulaCardDetailPrimaryAction;
}

export function FormulaCardDetailModal({
  subject,
  onClose,
  primaryAction,
}: FormulaCardDetailModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const name = subject.card.name;
  const effectText = subject.card.effectText;
  const imageUrl = subject.card.imageUrl;
  const cardId = subject.card.id;

  const isFormula = subject.kind === 'formula';
  const formula = isFormula ? subject.card : null;
  const cardElement: CardElement =
    formula?.element != null ? ELEMENT_TO_CARD[formula.element] : 'Neutral';
  const elementLabel = formula?.element
    ? ELEMENT_LABELS_DE[formula.element]
    : CARD_ELEMENT_DE.Neutral;
  const modeLabel = formula?.activationMode
    ? ACTIVATION_MODE_DE[formula.activationMode] ?? formula.activationMode
    : null;
  const roleLabel = formula ? FORMULA_SLOT_LABEL_DE[formula.role] : 'Ausrüstung';

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-3 sm:p-5"
      data-testid="formula-card-detail-root"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${name} Details`}
        data-testid="formula-card-detail"
        className="relative flex max-h-[90vh] w-fit max-w-[min(96vw,56rem)] flex-col overflow-hidden rounded-xl border border-stone-500/60 bg-stone-950/98 p-2 shadow-2xl backdrop-blur-md sm:p-2.5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex shrink-0 items-center justify-between gap-2 border-b border-stone-700/60 px-1 pb-2 sm:px-2">
          <span className="font-brand min-w-0 truncate text-sm uppercase tracking-wide text-stone-200">
            {name}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            {primaryAction ? (
              <Button
                variant="accent"
                size="sm"
                onClick={primaryAction.onClick}
                className="formula-play-confirm-pulse font-brand uppercase leading-none tracking-wide"
                data-testid={primaryAction.testId ?? 'formula-card-play-confirm'}
              >
                {primaryAction.label}
              </Button>
            ) : null}
            <Button
              variant="danger"
              size="sm"
              icon={<X className="h-4 w-4" />}
              onClick={onClose}
              className="font-brand uppercase leading-none tracking-wide"
              aria-label="Details schließen"
              data-testid="formula-card-detail-close"
            >
              Schließen
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
          <div className="flex flex-nowrap flex-row items-stretch justify-center gap-2 pb-1 sm:gap-2.5">
            <div
              className="flex h-96 w-64 shrink-0 flex-col"
              data-testid="formula-card-detail-front"
            >
              <LetzFetzCard
                id={cardId}
                name={name}
                type={isFormula ? 'Formula' : 'Item'}
                element={cardElement}
                stats_json={formula ? { resistance: formula.stability } : undefined}
                effects={[`Effekt: ${effectText}`]}
                image_asset={imageUrl}
                role={roleLabel}
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
                  {effectText.trim() ? (
                    <EffectTextWithMarks text={effectText} />
                  ) : (
                    'Kein Effekttext hinterlegt.'
                  )}
                </p>
              </ParchmentPanel>
            </div>

            <div className="flex h-96 w-72 min-w-0 shrink-0 flex-col">
              <ParchmentPanel title="Details" testId="formula-card-detail-info">
                <DetailRow label="Kartenart">
                  {isFormula ? (
                    <FormulaTypeBadges roleLabel={roleLabel} />
                  ) : (
                    'Gegenstand'
                  )}
                </DetailRow>
                {!isFormula ? <DetailRow label="Rolle">{roleLabel}</DetailRow> : null}
                {isFormula ? <DetailRow label="Element">{elementLabel}</DetailRow> : null}
                {formula ? <DetailRow label="Stabilität">{formula.stability}</DetailRow> : null}
                {modeLabel ? <DetailRow label="Modus">{modeLabel}</DetailRow> : null}
                <DetailRow label="ID">
                  <span className="break-all font-mono text-[11px]">{cardId}</span>
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
