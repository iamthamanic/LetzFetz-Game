/**
 * Sandbox card face — LetzFetzCard + local overlay notes (no Supabase).
 * Location: src/features/sandbox/SandboxCard.tsx
 */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LetzFetzCard } from '../../components/cards/LetzFetzCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CARD_KINDS, CARD_ELEMENTS, type CardElement, type CardKind } from '../../components/cards/cardTypes';
import type { SandboxCard as SandboxCardModel } from './model/sandboxTypes';

const FORGE_ELEMENTS: CardElement[] = CARD_ELEMENTS;

export function toCardKind(kind: string): CardKind {
  return CARD_KINDS.includes(kind as CardKind)
    ? (kind as CardKind)
    : 'Element';
}

export function toCardElement(element: string): CardElement {
  return FORGE_ELEMENTS.includes(element as CardElement)
    ? (element as CardElement)
    : 'Neutral';
}

interface SandboxCardProps {
  card: SandboxCardModel;
  scale?: number;
  onRemove?: () => void;
  onNotesChange?: (notes: string) => void;
}

export function SandboxCardFace({
  card,
  scale = 1,
  onRemove,
  onNotesChange,
}: SandboxCardProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [draftNotes, setDraftNotes] = useState(card.notes);
  const type = toCardKind(card.kind);
  const element = toCardElement(card.element);

  return (
    <div
      className="relative inline-block"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      {onRemove && (
        <>
          <button
            type="button"
            aria-label="Karte entfernen"
            onClick={onRemove}
            className="absolute -left-3 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white"
          >
            ✕
          </button>
          <button
            type="button"
            aria-label="Notizen bearbeiten"
            onClick={() => {
              setDraftNotes(card.notes);
              setNotesOpen(true);
            }}
            className="absolute left-5 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-stone-700 text-xs text-white"
          >
            📝
          </button>
        </>
      )}

      <LetzFetzCard
        id={card.id}
        name={card.name}
        type={type}
        element={element}
        effects={card.effects}
        image_asset={card.imageAsset}
        size="lg"
        layout="portrait"
        animateIllustration={type === 'Character'}
        interactive={false}
        draggable={false}
      />

      {notesOpen &&
        createPortal(
          <Modal
            open={notesOpen}
            onClose={() => setNotesOpen(false)}
            title={`Notizen: ${card.name}`}
            size="md"
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setNotesOpen(false)}>
                  Abbrechen
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onNotesChange?.(draftNotes);
                    setNotesOpen(false);
                  }}
                >
                  Speichern
                </Button>
              </div>
            }
          >
            <textarea
              className="min-h-[140px] w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              placeholder="Lokale Notizen…"
              aria-label="Kartennotizen"
            />
          </Modal>,
          document.body,
        )}
    </div>
  );
}
