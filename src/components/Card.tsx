/**
 * Card.tsx — drag/edit wrapper around the grunge LetzFetzCard frame.
 * Location: src/components/Card.tsx
 */
import React, { useState } from 'react';
import { LetzFetzCard } from './cards/LetzFetzCard';
import { forgeCharacterDefFromCard } from './cards/characterCardProps';
import { CardNotes } from './CardNotes';
import { CardEffectsModal } from './CardEffectsModal';
import type { ForgeCardKind } from '../services/cardForge/categories';
import type { ForgeElement } from '../services/cardForge/types';

interface CardProps {
  id: string;
  name: string;
  type: ForgeCardKind;
  element: ForgeElement;
  elements?: [ForgeElement, ForgeElement];
  elementDisplay?: string;
  stats_json?: { hp?: number; mana?: number; attack?: number; value?: number; cardType?: string };
  effects?: string[];
  effects_text?: string;
  image_asset?: string;
  trigger_dice_value?: number;
  preview?: boolean;
  scale?: number;
  onRemove?: () => void;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  onNotesChange?: (notes: string) => void;
}

export function Card({
  id,
  name,
  type,
  element,
  elements,
  elementDisplay,
  stats_json,
  effects,
  effects_text,
  image_asset,
  preview = false,
  scale = 1,
  onRemove,
  notes = '',
  created_at,
  updated_at,
  onNotesChange,
}: CardProps) {
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [effectsModalOpen, setEffectsModalOpen] = useState(false);
  const effectsList = effects && effects.length > 0 ? effects : effects_text ? [effects_text] : [];
  const characterDef =
    type === 'Character'
      ? forgeCharacterDefFromCard({
          id,
          name,
          type,
          elements,
          effects: effectsList,
        })
      : null;

  return (
    <div
      className="relative inline-block"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      {onRemove && (
        <>
          <ActionButton onClick={onRemove} icon="✕" variant="red" left={-12} />
          <ActionButton onClick={() => setNotesModalOpen(true)} icon="📝" variant="purple" left={20} />
        </>
      )}

      <LetzFetzCard
        id={id}
        name={name}
        type={type}
        element={element}
        elementDisplay={elementDisplay}
        stats_json={stats_json}
        effects={effects}
        effects_text={effects_text}
        image_asset={image_asset}
        gameElements={characterDef?.elements}
        role={characterDef?.role}
        size="lg"
        layout="portrait"
        animateIllustration={type === 'Character'}
        interactive={!preview}
        draggable={!preview}
        onEffectsClick={() => setEffectsModalOpen(true)}
      />

      {onRemove && (
        <CardNotes
          isOpen={notesModalOpen}
          onClose={() => setNotesModalOpen(false)}
          cardName={name}
          cardId={id}
          initialNotes={notes}
          onSave={(n) => onNotesChange?.(n)}
          createdAt={created_at}
          updatedAt={updated_at}
        />
      )}

      <CardEffectsModal
        isOpen={effectsModalOpen}
        onClose={() => setEffectsModalOpen(false)}
        name={name}
        type={type}
        effects={effectsList}
      />
    </div>
  );
}

function ActionButton({
  onClick,
  icon,
  variant,
  left,
}: {
  onClick: () => void;
  icon: string;
  variant: 'red' | 'purple';
  left: number;
}) {
  const bg = variant === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700';
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute -top-10 z-50 ${bg} text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors shadow-lg border-2 border-gray-900`}
      style={{ left: `${left}px` }}
    >
      {icon}
    </button>
  );
}
