/**
 * Sandbox table canvas — placed cards + arena info.
 * Location: src/features/sandbox/ArenaTable.tsx
 */
import React from 'react';
import { SandboxCardFace } from './SandboxCard';
import { ArenaInfoPanel } from './ArenaInfoPanel';
import type { SandboxArena, SandboxCard, SandboxPlacedCard } from './model/sandboxTypes';

export interface PlacedCardView {
  record: SandboxPlacedCard;
  card: SandboxCard;
}

interface ArenaTableProps {
  tableRef: React.RefObject<HTMLDivElement | null>;
  placedCards: PlacedCardView[];
  zoomLevel: number;
  panOffset: { x: number; y: number };
  draggedPlacedCard: { index: number; offsetX: number; offsetY: number } | null;
  showArenaInfo: boolean;
  activeArena: SandboxArena | null;
  arenaVariantText: string | null;
  arenaInfoExpanded: boolean;
  arenaInfoPosition: { x: number; y: number };
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onPlacedCardMouseDown: (e: React.MouseEvent, index: number) => void;
  onRemoveCard: (index: number) => void;
  onCardNotesChange: (cardId: string, notes: string) => void;
  onArenaPanelMouseDown: (e: React.MouseEvent) => void;
  onToggleArenaInfo: () => void;
  onCloseArenaInfo: () => void;
}

export function ArenaTable({
  tableRef,
  placedCards,
  zoomLevel,
  panOffset,
  draggedPlacedCard,
  showArenaInfo,
  activeArena,
  arenaVariantText,
  arenaInfoExpanded,
  arenaInfoPosition,
  onDragOver,
  onDrop,
  onWheel,
  onMouseDown,
  onPlacedCardMouseDown,
  onRemoveCard,
  onCardNotesChange,
  onArenaPanelMouseDown,
  onToggleArenaInfo,
  onCloseArenaInfo,
}: ArenaTableProps) {
  return (
    <div
      ref={tableRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      className="relative flex-1 cursor-grab overflow-hidden active:cursor-grabbing"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, rgb(28, 25, 23), rgb(12, 10, 9), rgb(0, 0, 0)), radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.08), transparent 50%), radial-gradient(circle at 80% 80%, rgba(120, 113, 108, 0.12), transparent 50%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgb(12, 10, 9)',
      }}
    >
      <div
        className="absolute"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: '0 0',
          width: '10000px',
          height: '10000px',
          transition: 'none',
          willChange: 'transform',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {placedCards.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-stone-600">
            <div className="text-center">
              <div className="mb-4 text-6xl">🎴</div>
              <p className="text-xl">Karten aus dem Deck auf den Tisch ziehen</p>
              <p className="mt-2 text-sm">Ziehen zum Verschieben • Entfernen über ✕</p>
            </div>
          </div>
        )}

        {showArenaInfo && activeArena && (
          <div
            className="pointer-events-auto absolute cursor-move"
            style={{
              left: `${arenaInfoPosition.x}px`,
              top: `${arenaInfoPosition.y}px`,
              zIndex: 50,
            }}
            onMouseDown={onArenaPanelMouseDown}
          >
            <ArenaInfoPanel
              arena={activeArena}
              variantText={arenaVariantText}
              isExpanded={arenaInfoExpanded}
              onToggle={onToggleArenaInfo}
              onClose={onCloseArenaInfo}
            />
          </div>
        )}

        {placedCards.map((placed, index) => (
          <div
            key={placed.record.instanceId}
            className="absolute cursor-move select-none touch-none"
            style={{
              left: `${placed.record.position.x}px`,
              top: `${placed.record.position.y}px`,
              zIndex: placed.record.zIndex || 1,
              willChange: draggedPlacedCard?.index === index ? 'transform' : 'auto',
              transition: draggedPlacedCard?.index === index ? 'none' : 'transform 0.1s ease-out',
            }}
            onMouseDown={(e) => onPlacedCardMouseDown(e, index)}
          >
            <SandboxCardFace
              card={placed.card}
              scale={0.6}
              onRemove={() => onRemoveCard(index)}
              onNotesChange={(notes) => onCardNotesChange(placed.card.id, notes)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
