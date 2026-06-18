import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Dices } from 'lucide-react';
import { DiceRoller } from './DiceRoller';

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
    <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4 ml-auto">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
          <button
            onClick={() => handleZoom(-0.25)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white text-sm min-w-[3.5rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.25)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onResetView}
            className="text-gray-400 hover:text-white transition-colors ml-2"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <DiceRoller onRoll={onDiceRoll} />

        <button
          onClick={onOpenArenaModal}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Dices className="w-5 h-5" />
          Pick Arena
        </button>
      </div>
    </div>
  );
}
