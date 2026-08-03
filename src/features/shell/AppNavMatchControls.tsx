/**
 * Match pause / restart / quit controls for the app nav history cluster.
 * Location: src/features/shell/AppNavMatchControls.tsx
 */
import React from 'react';
import { DoorOpen, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface AppNavMatchControlsProps {
  showMatchPause: boolean;
  matchActive: boolean;
  matchPaused: boolean;
  onToggleMatchPause?: () => void;
  onQuitMatch?: () => void;
  onRestartMatch?: () => void;
}

export function AppNavMatchControls({
  showMatchPause,
  matchActive,
  matchPaused,
  onToggleMatchPause,
  onQuitMatch,
  onRestartMatch,
}: AppNavMatchControlsProps) {
  return (
    <>
      {showMatchPause && onToggleMatchPause ? (
        <Button
          variant="ghost"
          size="sm"
          icon={matchPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          aria-label={matchPaused ? 'Weiter' : 'Pause'}
          title={
            matchActive
              ? matchPaused
                ? 'Weiter'
                : 'Pause'
              : 'Pause (erst während eines Matches)'
          }
          disabled={!matchActive}
          onClick={onToggleMatchPause}
          className={`shrink-0 px-2 hover:bg-stone-800 disabled:opacity-30 ${
            matchPaused
              ? 'text-amber-400 hover:text-amber-300'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          data-testid={matchPaused ? 'app-nav-resume' : 'app-nav-pause'}
        />
      ) : null}
      {matchActive && onRestartMatch ? (
        <Button
          variant="ghost"
          size="sm"
          icon={<RotateCcw className="h-4 w-4" />}
          aria-label="Partie von vorne starten"
          title="Von vorne"
          onClick={onRestartMatch}
          className="shrink-0 px-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
          data-testid="app-nav-restart-match"
        />
      ) : null}
      {matchActive && onQuitMatch ? (
        <Button
          variant="ghost"
          size="sm"
          icon={<DoorOpen className="h-4 w-4" />}
          aria-label="Spiel beenden"
          title="Beenden"
          onClick={onQuitMatch}
          className="shrink-0 px-2 text-stone-400 hover:bg-stone-800 hover:text-red-300"
          data-testid="app-nav-quit-match"
        />
      ) : null}
    </>
  );
}
