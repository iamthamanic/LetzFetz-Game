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
  /** When true, DE copy uses Formelphase wording (V5 or V6). */
  formulaBoard?: boolean;
  /** @deprecated use formulaBoard */
  v5Formula?: boolean;
  /** Override activate button label (e.g. Überformel). */
  activateLabel?: string;
  onStartBuild: () => void;
  onActivateFormula?: () => void;
  onSkip: () => void;
  onCancel: () => void;
  previewSlot?: React.ReactNode;
}

export function BuildPhaseBar({
  canBuild,
  canActivateFormula = false,
  buildModeActive,
  inputLocked = false,
  formulaBoard,
  v5Formula = false,
  activateLabel,
  onStartBuild,
  onActivateFormula,
  onSkip,
  onCancel,
  previewSlot,
}: BuildPhaseBarProps) {
  const formulaMode = formulaBoard ?? v5Formula;
  const buildDisabled = inputLocked || !canBuild || buildModeActive;
  const noBuildHint = formulaMode
    ? 'Keine Formelkarten auf der Hand — nur Skip oder Aktivieren.'
    : 'Keine baubaren Karten auf der Hand — nur Glitch-Karten oder nichts Baubares.';
  const startLabel = formulaMode ? 'Formel bauen' : 'Engine bauen';
  const startTitle = formulaMode
    ? 'Wähle eine Formelkarte zum Bauen / Ersetzen / Schnellmix'
    : 'Wähle eine Handkarte zum Bauen in die Engine';
  const skipLabel = formulaMode ? 'Skip Formelphase' : 'Skip Bau-Phase';
  const activateText = activateLabel ?? 'Formel aktivieren';
  const isOverformula = activateLabel === 'Überformel aktivieren';

  return (
    <div data-testid="build-phase-bar" className="flex flex-col gap-2">
      {previewSlot}
      <div className="flex flex-wrap items-center gap-2">
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
      {formulaMode && onActivateFormula ? (
        <Button
          variant="accent"
          size="sm"
          disabled={inputLocked || !canActivateFormula || buildModeActive}
          onClick={onActivateFormula}
          data-testid={
            isOverformula ? 'build-phase-activate-overformula' : 'build-phase-activate-formula'
          }
          title={
            canActivateFormula
              ? isOverformula
                ? 'Verstärkte Fusion bei voller Fetzladung — bestätigt im Dialog'
                : 'Aktiviert aufgerichtete, nicht gestörte Formelkomponenten'
              : 'Keine aktivierbaren Formelkomponenten'
          }
        >
          {activateText}
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
    </div>
  );
}
