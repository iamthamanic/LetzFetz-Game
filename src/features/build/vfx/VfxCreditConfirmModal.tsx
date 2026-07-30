/**
 * German credit confirmation before Meshy API spend.
 * Location: src/features/build/vfx/VfxCreditConfirmModal.tsx
 */
import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { MESHY_PREVIEW_CREDITS_ESTIMATE } from './workerClient';

interface VfxCreditConfirmModalProps {
  open: boolean;
  credits: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function VfxCreditConfirmModal({
  open,
  credits,
  onConfirm,
  onCancel,
}: VfxCreditConfirmModalProps) {
  const estimate = credits > 0 ? credits : MESHY_PREVIEW_CREDITS_ESTIMATE;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Meshy-Credits bestätigen"
      size="sm"
      testId="vfx-credit-confirm-modal"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button variant="accent" onClick={onConfirm} data-testid="vfx-credit-confirm-btn">
            Bestätigen (~{estimate} Credits)
          </Button>
        </div>
      }
    >
      <p className="text-sm text-stone-300">
        Die Meshy-3D-Vorschau verbraucht ca.{' '}
        <span className="font-semibold text-amber-200">{estimate} Meshy-Credits</span>.
      </p>
      <p className="mt-2 text-xs text-stone-500">
        Der API-Schlüssel bleibt auf dem lokalen VFX-Worker — nicht im Browser.
      </p>
    </Modal>
  );
}
