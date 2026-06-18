import React from 'react';
import { Card } from './Card';
import { ArenaInfoPanel } from './ArenaInfoPanel';

interface PlacedCard {
  cardData: any;
  position: { x: number; y: number };
  zIndex: number;
  id: string;
}

interface ArenaTableProps {
  tableRef: React.RefObject<HTMLDivElement | null>;
  placedCards: PlacedCard[];
  zoomLevel: number;
  panOffset: { x: number; y: number };
  draggedPlacedCard: { index: number; offsetX: number; offsetY: number } | null;
  showArenaInfo: boolean;
  activeArenaBiom: any;
  activeArenaMutation: any;
  arenaInfoExpanded: boolean;
  arenaInfoPosition: { x: number; y: number };
  diceHistory: any[];
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
  activeArenaBiom,
  activeArenaMutation,
  arenaInfoExpanded,
  arenaInfoPosition,
  diceHistory,
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
      className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, rgb(17, 24, 39), rgb(3, 7, 18), rgb(0, 0, 0)), radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1), transparent 50%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgb(3, 7, 18)',
      }}
    >
      {/* Zoomable Inner Canvas */}
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
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Drop Zone Hint */}
        {placedCards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
            <div className="text-center">
              <div className="text-6xl mb-4">🎴</div>
              <p className="text-xl">Drag cards from the deck to place them on the table</p>
              <p className="text-sm mt-2">Drag cards to move them • Right-click to remove</p>
            </div>
          </div>
        )}

        {/* Arena Info Panel */}
        {showArenaInfo && (activeArenaBiom || activeArenaMutation) && (
          <div
            className="absolute pointer-events-auto cursor-move"
            style={{
              left: `${arenaInfoPosition.x}px`,
              top: `${arenaInfoPosition.y}px`,
              zIndex: 50,
            }}
            onMouseDown={onArenaPanelMouseDown}
          >
            <ArenaInfoPanel
              arenaName={diceHistory[0]?.arenaName || 'Arena'}
              biom={activeArenaBiom}
              mutation={activeArenaMutation}
              isExpanded={arenaInfoExpanded}
              onToggle={onToggleArenaInfo}
              onClose={onCloseArenaInfo}
            />
          </div>
        )}

        {/* Placed Cards */}
        {placedCards.map((placedCard, index) => {
          if (!placedCard.position || typeof placedCard.position.x !== 'number' || typeof placedCard.position.y !== 'number') {
            console.warn('Skipping card with invalid position:', placedCard);
            return null;
          }

          return (
            <div
              key={placedCard.id}
              className="absolute cursor-move select-none touch-none"
              style={{
                left: `${placedCard.position.x}px`,
                top: `${placedCard.position.y}px`,
                zIndex: placedCard.zIndex || 1,
                willChange: draggedPlacedCard?.index === index ? 'transform' : 'auto',
                transition: draggedPlacedCard?.index === index ? 'none' : 'transform 0.1s ease-out',
              }}
              onMouseDown={(e) => onPlacedCardMouseDown(e, index)}
            >
              <Card
                {...placedCard.cardData}
                preview={false}
                scale={0.6}
                onRemove={() => onRemoveCard(index)}
                onNotesChange={(notes: string) => onCardNotesChange(placedCard.cardData.id, notes)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
