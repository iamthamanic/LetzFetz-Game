/**
 * Confirm modal before spending shared Fetzgerät Ladung (pool activate).
 * Location: src/features/play/board/FetzChargeConfirmModal.tsx
 */
import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

export interface FetzChargeConfirmProps {
  open: boolean;
  partName: string;
  cost: number;
  chargeBefore: number;
  canAfford: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function FetzChargeConfirmModal({
  open,
  partName,
  cost,
  chargeBefore,
  canAfford,
  onConfirm,
  onCancel,
}: FetzChargeConfirmProps) {
  const remaining = Math.max(0, chargeBefore - cost);
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Ladung ausgeben?"
      size="sm"
      testId="fetz-charge-confirm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={!canAfford}
            data-testid="fetz-charge-confirm-ok"
          >
            Bestätigen
          </Button>
        </div>
      }
    >
      <p className="text-sm text-stone-200">
        <span className="font-semibold text-amber-200">{partName}</span> aktivieren
        kostet <span className="font-semibold">{cost}</span> Ladung.
      </p>
      <p className="mt-2 text-sm text-stone-400">
        Pool jetzt: {chargeBefore} → danach: {canAfford ? remaining : '—'}
      </p>
      {!canAfford && (
        <p className="mt-2 text-sm font-medium text-rose-300" role="alert">
          Nicht genug Ladung für diese Aktivierung.
        </p>
      )}
    </Modal>
  );
}
