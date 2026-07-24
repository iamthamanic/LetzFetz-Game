/**
 * Sandbox toolbar — zoom, dice, arena select, storage status, session reset.
 * Location: src/features/sandbox/ArenaToolbar.tsx
 */
import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Dices, RotateCcw } from 'lucide-react';
import { DiceRoller, type DiceRollResult } from './DiceRoller';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';
import type { SandboxStorageStatus } from './model/sandboxTypes';

const STATUS_LABEL: Record<SandboxStorageStatus, string> = {
  idle: 'Bereit',
  saving: 'Speichert …',
  saved: 'Gespeichert',
  error: 'Speichern fehlgeschlagen',
};

interface ArenaToolbarProps {
  zoomLevel: number;
  panOffset: { x: number; y: number };
  tableRef: React.RefObject<HTMLDivElement | null>;
  storageStatus: SandboxStorageStatus;
  onZoomChange: (zoom: number, pan: { x: number; y: number }) => void;
  onResetView: () => void;
  onOpenArenaModal: () => void;
  onDiceRoll: (result: DiceRollResult) => void;
  onResetSession: () => void;
}

export function ArenaToolbar({
  zoomLevel,
  panOffset,
  tableRef,
  storageStatus,
  onZoomChange,
  onResetView,
  onOpenArenaModal,
  onDiceRoll,
  onResetSession,
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

  const handleResetSession = () => {
    if (
      !window.confirm(
        'Aktuelle Sandbox-Session wirklich zurücksetzen? Alle platzierten Karten und lokalen Werte gehen verloren.',
      )
    ) {
      return;
    }
    onResetSession();
  };

  return (
    <div className="flex-none border-b border-stone-800 bg-stone-900/80 px-4 py-2">
      <Panel className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Sandbox Arena
          </span>
          <span
            data-testid="sandbox-storage-status"
            className={`truncate text-xs ${
              storageStatus === 'error'
                ? 'text-red-400'
                : storageStatus === 'saved'
                  ? 'text-emerald-400'
                  : 'text-amber-400/90'
            }`}
          >
            {STATUS_LABEL[storageStatus]}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
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

          <Button
            variant="accent"
            size="sm"
            icon={<Dices className="h-4 w-4" />}
            onClick={onOpenArenaModal}
          >
            Arena wählen
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={handleResetSession}
            data-testid="sandbox-reset-session"
          >
            Session zurücksetzen
          </Button>
        </div>
      </Panel>
    </div>
  );
}
