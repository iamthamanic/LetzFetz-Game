/**
 * V5 character passive choice modal (Pillendoktora / Mysterium).
 * Location: src/features/play/board/PassiveChoiceModal.tsx
 */
import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

export interface PassiveChoiceOption {
  id: string;
  labelDe: string;
}

interface PassiveChoiceModalProps {
  open: boolean;
  title: string;
  description: string;
  options: PassiveChoiceOption[];
  onPick: (id: string) => void;
  testId?: string;
}

export function PassiveChoiceModal({
  open,
  title,
  description,
  options,
  onPick,
  testId = 'passive-choice-modal',
}: PassiveChoiceModalProps) {
  return (
    <Modal
      open={open}
      onClose={() => {
        /* mandatory choice */
      }}
      title={title}
      size="sm"
      testId={testId}
    >
      <p className="mb-3 text-sm text-stone-300">{description}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <Button
            key={opt.id}
            variant="primary"
            className="w-full justify-center"
            onClick={() => onPick(opt.id)}
            data-testid={`passive-choice-${opt.id}`}
          >
            {opt.labelDe}
          </Button>
        ))}
      </div>
    </Modal>
  );
}
