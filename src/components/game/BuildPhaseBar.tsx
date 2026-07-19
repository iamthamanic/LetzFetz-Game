/**
 * Build-phase footer — start engine build mode or skip the phase.
 * Location: src/components/game/BuildPhaseBar.tsx
 */
import React from 'react';
import { Button } from '../ui/Button';

interface BuildPhaseBarProps {
  canBuild: boolean;
  buildModeActive: boolean;
  inputLocked?: boolean;
  onStartBuild: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

const NO_BUILD_HINT =
  'Keine baubaren Karten auf der Hand — nur Glitch-Karten oder nichts Baubares.';

export function BuildPhaseBar({
  canBuild,
  buildModeActive,
  inputLocked = false,
  onStartBuild,
  onSkip,
  onCancel,
}: BuildPhaseBarProps) {
  const buildDisabled = inputLocked || !canBuild || buildModeActive;

  return (
    <div data-testid="build-phase-bar" className="flex flex-wrap items-center gap-2">
      {buildModeActive ? (
        <Button
          variant="secondary"
          size="sm"
          disabled={inputLocked}
          onClick={onCancel}
          data-testid="build-phase-cancel"
        >
          Auswahl abbrechen
        </Button>
      ) : (
        <span
          className="inline-flex"
          title={!canBuild ? NO_BUILD_HINT : undefined}
        >
          <Button
            variant="primary"
            size="sm"
            disabled={buildDisabled}
            onClick={onStartBuild}
            data-testid="build-phase-start"
            aria-disabled={buildDisabled}
            title={!canBuild ? NO_BUILD_HINT : 'Wähle eine Handkarte zum Bauen in die Engine'}
          >
            Engine bauen
          </Button>
        </span>
      )}
      <Button
        variant="secondary"
        size="sm"
        disabled={inputLocked || buildModeActive}
        onClick={onSkip}
        data-testid="build-phase-skip"
      >
        Skip Bau-Phase
      </Button>
    </div>
  );
}
