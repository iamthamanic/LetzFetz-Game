/**
 * V3 reaction pick modal — active player chooses one reaction.
 * Location: src/features/play/board/ReactionPickModal.tsx
 */
import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

export interface ReactionOptionView {
  reactionId: string;
  markId: string;
  labelDe: string;
}

interface ReactionPickModalProps {
  open: boolean;
  options: ReactionOptionView[];
  onPick: (reactionId: string) => void;
}

export function ReactionPickModal({ open, options, onPick }: ReactionPickModalProps) {
  return (
    <Modal
      open={open}
      onClose={() => {
        /* mandatory choice — no dismiss via backdrop/Escape for gameplay */
      }}
      title="Reaktion wählen"
      size="sm"
      testId="reaction-pick-modal"
    >
      <p className="mb-3 text-sm text-stone-300">
        Mehrere Marken passen. Wähle genau eine Reaktion.
      </p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <Button
            key={opt.reactionId}
            variant="primary"
            className="w-full justify-center"
            onClick={() => onPick(opt.reactionId)}
            data-testid={`reaction-pick-${opt.reactionId}`}
          >
            {opt.labelDe}
          </Button>
        ))}
      </div>
    </Modal>
  );
}
