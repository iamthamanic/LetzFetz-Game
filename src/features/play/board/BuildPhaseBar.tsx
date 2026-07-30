/**
 * Build / Formelphase footer — start build/formula mode, activate, or skip.
 * Location: src/features/play/board/BuildPhaseBar.tsx
 */
import React from 'react';
import { Button } from '../../../components/ui/Button';

interface BuildPhaseBarProps {
  canBuild: boolean;
  canActivateFormula?: boolean;
  buildModeActive: boolean;
  inputLocked?: boolean;
  /** When true, DE copy uses Formelphase wording. */
  v5Formula?: boolean;
  onStartBuild: () => void;
  onActivateFormula?: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

export function BuildPhaseBar({
  canBuild,
  canActivateFormula = false,
  buildModeActive,
  inputLocked = false,
  v5Formula = false,
  onStartBuild,
  onActivateFormula,
  onSkip,
  onCancel,
}: BuildPhaseBarProps) {
  const buildDisabled = inputLocked || !canBuild || buildModeActive;
  const noBuildHint = v5Formula
    ? 'Keine Formelkarten auf der Hand — nur Skip oder Aktivieren.'
    : 'Keine baubaren Karten auf der Hand — nur Glitch-Karten oder nichts Baubares.';
  const startLabel = v5Formula ? 'Formel bauen' : 'Engine bauen';
  const startTitle = v5Formula
    ? 'Wähle eine Formelkarte zum Bauen / Ersetzen / Schnellmix'
    : 'Wähle eine Handkarte zum Bauen in die Engine';
  const skipLabel = v5Formula ? 'Skip Formelphase' : 'Skip Bau-Phase';

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
        <span className="inline-flex" title={!canBuild ? noBuildHint : undefined}>
          <Button
            variant="primary"
            size="sm"
            disabled={buildDisabled}
            onClick={onStartBuild}
            data-testid="build-phase-start"
            aria-disabled={buildDisabled}
            title={!canBuild ? noBuildHint : startTitle}
          >
            {startLabel}
          </Button>
        </span>
      )}
      {v5Formula && onActivateFormula ? (
        <Button
          variant="accent"
          size="sm"
          disabled={inputLocked || !canActivateFormula || buildModeActive}
          onClick={onActivateFormula}
          data-testid="build-phase-activate-formula"
          title={
            canActivateFormula
              ? 'Aktiviert aufgerichtete, nicht gestörte Formelkomponenten'
              : 'Keine aktivierbaren Formelkomponenten'
          }
        >
          Formel aktivieren
        </Button>
      ) : null}
      <Button
        variant="secondary"
        size="sm"
        disabled={inputLocked || buildModeActive}
        onClick={onSkip}
        data-testid="build-phase-skip"
      >
        {skipLabel}
      </Button>
    </div>
  );
}
