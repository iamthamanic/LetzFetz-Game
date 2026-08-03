/**
 * Confirm before spending full Fetzladung on Überformel (generic copy).
 * Location: src/features/play/board/UeberformelConfirmModal.tsx
 */
import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import type { V6FormulaPreviewLines } from '../presentation/v6FormulaPlanPreview';
import { V6FormulaActivationPreview } from './V6FormulaActivationPreview';

export interface UeberformelConfirmProps {
  open: boolean;
  chargeBefore: number;
  preview: V6FormulaPreviewLines | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UeberformelConfirmModal({
  open,
  chargeBefore,
  preview,
  onConfirm,
  onCancel,
}: UeberformelConfirmProps) {
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
            onClick={onConfirm}
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
      <p className="mt-2 text-sm text-stone-400">
        Fester Slice-1-Bonus: +2 Primär. Keine charaktergebundene Ulti.
      </p>
      {preview ? (
        <div className="mt-3">
          <V6FormulaActivationPreview lines={preview} />
        </div>
      ) : null}
    </Modal>
  );
}
