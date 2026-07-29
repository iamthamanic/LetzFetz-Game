/**
 * Library preview for an Elementeffekt — description left, cover right.
 * Location: src/components/cards/ElementEffectPreviewModal.tsx
 */
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Element, PrimaryMarkId } from '../../game/types';
import { Button } from '../ui/Button';
import { ElementIcon } from '../ui/ElementIcon';
import { CardDividerBar } from './grungeCardParts';
import { CardNamePlate } from '../ui/CardNamePlate';
import { ElementEffectCard } from './ElementEffectCard';
import { getElementEffectCopy } from './elementEffectCopy';

interface ElementEffectPreviewModalProps {
  markId: PrimaryMarkId;
  element: Element;
  onClose: () => void;
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

export function ElementEffectPreviewModal({
  markId,
  element,
  onClose,
}: ElementEffectPreviewModalProps) {
  const copy = getElementEffectCopy(markId, element);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-3 sm:p-5"
      data-testid="element-effect-preview-root"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${copy.name} Vorschau`}
        data-testid="element-effect-preview"
        className="relative flex max-h-[90vh] w-fit max-w-[min(96vw,56rem)] flex-col overflow-hidden rounded-xl border border-stone-500/60 bg-stone-950/98 p-2 shadow-2xl backdrop-blur-md sm:p-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex shrink-0 items-center justify-between border-b border-stone-700/60 px-1 pb-2 sm:px-2">
          <span className="font-brand text-sm uppercase tracking-wide text-stone-200">
            {copy.name}
          </span>
          <Button
            variant="danger"
            size="sm"
            icon={<X className="h-4 w-4" />}
            onClick={onClose}
            className="font-brand uppercase leading-none tracking-wide"
            aria-label="Vorschau schließen"
          >
            Close
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
          <div className="flex flex-nowrap flex-row items-stretch justify-center gap-2 pb-1 sm:gap-2.5">
            <div
              className="character-card-frame relative flex h-96 w-72 shrink-0 flex-col overflow-hidden rounded-[2px] text-left shadow-xl ring-1 ring-inset ring-amber-950/25"
              data-testid="element-effect-preview-detail"
            >
              <div className="parchment-bar-beige parchment-bar-noise relative flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="parchment-bar-stain" aria-hidden />
                <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
                  <div>
                    <CardNamePlate cardId={`effect-${markId}`} name={copy.name} size="md" />
                    <CardDividerBar className="mt-2" />
                  </div>
                  <DetailRow label="Kartenart">Effekt</DetailRow>
                  <DetailRow label="Element">
                    <span className="inline-flex items-center gap-1.5">
                      <ElementIcon element={element} size="sm" />
                      <span className="text-on-parchment font-semibold">{copy.elementLabel}</span>
                    </span>
                  </DetailRow>
                  <DetailRow label="Stapelbar">
                    {copy.stackable
                      ? copy.maxStacks
                        ? `Ja · max. ${copy.maxStacks}`
                        : 'Ja'
                      : 'Nein'}
                  </DetailRow>
                  <DetailRow label="Wirkung">{copy.summary}</DetailRow>
                  {copy.details.length > 0 ? (
                    <DetailRow label="Hinweise">
                      <ul className="list-disc space-y-1 pl-4">
                        {copy.details.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </DetailRow>
                  ) : null}
                  {copy.tags.length > 0 ? (
                    <DetailRow label="Tags">{copy.tags.join(' · ')}</DetailRow>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex h-96 w-64 shrink-0 flex-col" data-testid="element-effect-preview-cover">
              <ElementEffectCard markId={markId} element={element} size="lg" className="!h-full !w-full !max-w-none" />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
