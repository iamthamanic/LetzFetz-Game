/**
 * Drag-and-drop wiring for bind and challenge using @dnd-kit.
 * Location: src/components/game/DndPlaymat.tsx
 *
 * Wraps the playmat board in a DndContext. Hand cards with `interaction === 'bind'`
 * become draggable; human engine slots become droppable targets. On drag-end,
 * the appropriate engine action (BIND_CARD or CHALLENGE) is dispatched.
 */
import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { ContentPack, GameAction, GameState, PlayerId } from '../../game';
import { findElementDef } from '../../game';
import type { GameViewModel, BoundSlotView } from './buildGameViewModel';
import type { HandCardView } from './buildGameViewModel';
import { BoardCard } from './BoardCard';
import {
  findDirectBindAction,
  findBindReplaceAction,
} from './gameActionHelpers';

interface DndPlaymatProps {
  state: GameState;
  pack: ContentPack;
  view: GameViewModel;
  humanId: PlayerId;
  onDispatch: (action: GameAction) => void;
  children: React.ReactNode;
}

interface DragData {
  type: 'bind';
  cardInstanceId: string;
}

export function DndPlaymat({
  state,
  pack,
  view,
  humanId,
  onDispatch,
  children,
}: DndPlaymatProps) {
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as DragData | undefined;
    if (data) setActiveDrag(data);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDrag(null);
      const { active, over } = event;
      if (!over) return;

      const dragData = active.data.current as DragData | undefined;
      if (!dragData) return;

      const dropId = over.id as string;
      if (dropId.startsWith('human-slot-')) {
        const slotIndex = parseInt(dropId.replace('human-slot-', ''), 10);
        const slot = view.humanBoundSlots[slotIndex];
        if (!slot) return;

        if (slot.instanceId) {
          const action = findBindReplaceAction(
            view.legalActions,
            dragData.cardInstanceId,
            slot.instanceId,
          );
          if (action) onDispatch(action);
        } else {
          const action = findDirectBindAction(
            view.legalActions,
            dragData.cardInstanceId,
          );
          if (action) onDispatch(action);
        }
      } else if (dropId.startsWith('opponent-slot-')) {
        const slotIndex = parseInt(dropId.replace('opponent-slot-', ''), 10);
        const slot = view.botBoundSlots[slotIndex];
        if (slot?.instanceId) {
          onDispatch({
            type: 'CHALLENGE',
            attackCardInstanceId: dragData.cardInstanceId,
            targetBoundInstanceId: slot.instanceId,
            diceRoll: Math.floor(Math.random() * 6) + 1,
          });
        }
      }
    },
    [view, onDispatch],
  );

  const activeCard = activeDrag
    ? state.players[humanId].hand.find((c) => c.instanceId === activeDrag.cardInstanceId)
    : null;
  const activeDef = activeCard ? findElementDef(pack, activeCard.defId) : undefined;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDrag(null)}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeDrag && activeDef ? (
          <BoardCard def={activeDef} size="hand" playable />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/** Draggable wrapper for hand cards that are bindable. */
export function DraggableHandCard({
  card,
  children,
}: {
  card: HandCardView;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `hand-${card.instanceId}`,
    data: { type: 'bind', cardInstanceId: card.instanceId } as DragData,
    disabled: !card.isPlayable || card.interaction !== 'bind',
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.3 : 1, touchAction: 'none' }}
      data-draggable={card.interaction === 'bind' && card.isPlayable ? 'true' : undefined}
    >
      {children}
    </div>
  );
}

/** Droppable wrapper for engine slots. */
export function DroppableSlot({
  slotId,
  side,
  slotIndex,
  isTarget,
  children,
}: {
  slotId: string;
  side: 'human' | 'opponent';
  slotIndex: number;
  isTarget: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${side === 'human' ? 'human-slot' : 'opponent-slot'}-${slotIndex}`,
    disabled: !isTarget,
  });

  return (
    <div
      ref={setNodeRef}
      data-drop-over={isOver ? 'true' : undefined}
      className={isOver ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-stone-950 rounded-xl' : ''}
    >
      {children}
    </div>
  );
}