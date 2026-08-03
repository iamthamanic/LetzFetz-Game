/**
 * Confirm before spending full Fetzladung on Überformel — choose bonus (#385).
 * Location: src/features/play/board/UeberformelConfirmModal.tsx
 */
import React, { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import type { V6FormulaPreviewLines } from '../presentation/v6FormulaPlanPreview';
import { V6FormulaActivationPreview } from './V6FormulaActivationPreview';
import type { V6OverformulaBonusChoice } from '../../../game/engine/v6/overformula';

export interface UeberformelConfirmProps {
  open: boolean;
  chargeBefore: number;
  /** Preview for currently selected bonus choice. */
  preview: V6FormulaPreviewLines | null;
  selectedChoice: V6OverformulaBonusChoice;
  onSelectChoice: (choice: V6OverformulaBonusChoice) => void;
  onConfirm: (choice: V6OverformulaBonusChoice) => void;
  onCancel: () => void;
}

export function UeberformelConfirmModal({
  open,
  chargeBefore,
  preview,
  selectedChoice,
  onSelectChoice,
  onConfirm,
  onCancel,
}: UeberformelConfirmProps) {
  const [localChoice, setLocalChoice] = useState<V6OverformulaBonusChoice>(selectedChoice);

  useEffect(() => {
    if (open) setLocalChoice(selectedChoice);
  }, [open, selectedChoice]);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Überformel aktivieren?"
      size="sm"
      testId="ueberformel-confirm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} data-testid="ueberformel-confirm-cancel">
            Abbrechen
          </Button>
          <Button
            variant="accent"
            onClick={() => onConfirm(localChoice)}
            data-testid="ueberformel-confirm-ok"
          >
            Überformel feuern
          </Button>
        </div>
      }
    >
      <p className="text-sm text-stone-200">
        Deine aktuelle Fusion wird als <span className="font-semibold text-amber-200">Überformel</span>{' '}
        verstärkt. Fetzladung ({chargeBefore}) wird danach auf 0 gesetzt.
      </p>
      <p className="mt-3 text-sm font-medium text-stone-300">Bonus wählen (XOR):</p>
      <div className="mt-2 flex flex-col gap-2">
        <Button
          variant={localChoice === 'primary' ? 'accent' : 'ghost'}
          onClick={() => {
            setLocalChoice('primary');
            onSelectChoice('primary');
          }}
          data-testid="ueberformel-choice-primary"
        >
          +2 Primär
        </Button>
        <Button
          variant={localChoice === 'intensity' ? 'accent' : 'ghost'}
          onClick={() => {
            setLocalChoice('intensity');
            onSelectChoice('intensity');
          }}
          data-testid="ueberformel-choice-intensity"
        >
          +1 Intensität
        </Button>
      </div>
      {preview ? (
        <div className="mt-3">
          <V6FormulaActivationPreview lines={preview} />
        </div>
      ) : null}
    </Modal>
  );
}
