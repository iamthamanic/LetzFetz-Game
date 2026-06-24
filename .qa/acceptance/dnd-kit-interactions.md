# Acceptance: DnD-Kit Drag Interactions for Bind and Challenge (#17)

## Issue
Add dnd-kit drag interactions for bind and challenge.

## Acceptance criteria
- [x] Bind per Drag funktional
- [x] Challenge Drag Pfad (attack card → opponent slot)
- [x] Engine rejects invalid (dnd-kit disabled for non-bind cards; droppable disabled for non-target slots)
- [x] Click interaction still works alongside DnD

## Implementation
- `src/components/game/DndPlaymat.tsx` — DndContext wrapper with:
  - `DraggableHandCard` — wraps bind-interaction hand cards with `useDraggable`
  - `DroppableSlot` — wraps engine slots with `useDroppable`, highlights on drag-over
  - Pointer + Touch sensors (distance/touch constraints for mobile)
  - Drag-end dispatches `BIND_CARD` (direct or replace) or `CHALLENGE`
- `PlaymatBoard.tsx` — wraps entire board in `<DndPlaymat>`
- `BoundCardRow.tsx` — each slot wrapped in `<DroppableSlot>`
- `HandFan.tsx` — bind cards wrapped in `<DraggableHandCard>`

## Tests
- 147 unit tests pass
- 5 E2E tests pass (existing click interaction still works)