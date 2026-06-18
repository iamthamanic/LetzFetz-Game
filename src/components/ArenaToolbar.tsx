/**
 * Arena sandbox toolbar — zoom, dice, arena selection.
 * Location: src/components/ArenaToolbar.tsx
 */
import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Dices } from 'lucide-react';
import { DiceRoller } from './DiceRoller';
import { Button } from './ui/Button';
import { Panel } from './ui/Panel';

interface ArenaToolbarProps {
  sidebarOpen: boolean;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  tableRef: React.RefObject<HTMLDivElement | null>;
  onZoomChange: (zoom: number, pan: { x: number; y: number }) => void;
  onResetView: () => void;
  onOpenArenaModal: () => void;
  onDiceRoll: (result: any) => void;
}

export function ArenaToolbar({
  zoomLevel,
  panOffset,
  tableRef,
  onZoomChange,
  onResetView,
  onOpenArenaModal,
  onDiceRoll,
}: ArenaToolbarProps) {
  const handleZoom = (delta: number) => {
    const newZoom = Math.min(Math.max(0.25, zoomLevel + delta), 3);
    if (tableRef.current) {
      const centerX = tableRef.current.clientWidth / 2;
      const centerY = tableRef.current.clientHeight / 2;
      const zoomRatio = newZoom / zoomLevel;
      onZoomChange(newZoom, {
        x: centerX - (centerX - panOffset.x) * zoomRatio,
        y: centerY - (centerY - panOffset.y) * zoomRatio,
      });
    }
  };

  return (
    <div className="flex-none border-b border-stone-800 bg-stone-900/80 px-4 py-2">
      <Panel className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Sandbox Arena</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-950 px-2 py-1">
            <Button
              variant="ghost"
              size="sm"
              icon={<ZoomOut className="h-4 w-4" />}
              onClick={() => handleZoom(-0.25)}
              className="px-2"
              title="Zoom Out"
            />
            <span className="min-w-[3rem] text-center text-xs font-medium text-stone-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              icon={<ZoomIn className="h-4 w-4" />}
              onClick={() => handleZoom(0.25)}
              className="px-2"
              title="Zoom In"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<Maximize2 className="h-4 w-4" />}
              onClick={onResetView}
              className="px-2"
              title="Reset View"
            />
          </div>

          <DiceRoller onRoll={onDiceRoll} />

          <Button variant="accent" size="sm" icon={<Dices className="h-4 w-4" />} onClick={onOpenArenaModal}>
            Arena wählen
          </Button>
        </div>
      </Panel>
    </div>
  );
}
