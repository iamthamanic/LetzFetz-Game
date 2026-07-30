/**
 * Credit confirm before paid generate actions.
 * Location: src/features/build/development/CreditConfirmModal.tsx
 */
import React, { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { bridgePost } from './assetBridgeClient';

interface CreditConfirmModalProps {
  open: boolean;
  partId: string;
  generateKind: string;
  titleDe: string;
  onClose: () => void;
  onResult: (message: string, skillCommand: string | null) => void;
}

export function CreditConfirmModal({
  open,
  partId,
  generateKind,
  titleDe,
  onClose,
  onResult,
}: CreditConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [estimateText, setEstimateText] = useState('…');
  const [skillCommand, setSkillCommand] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setBlocked(false);
    void bridgePost('credits-estimate', { id: partId, generateKind }).then((r) => {
      setLoading(false);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      const est = r.data.estimate as { cost?: number; kind?: string } | undefined;
      const check = r.data.check as { ok?: boolean; errors?: string[] } | undefined;
      const cmd = typeof r.data.skillCommand === 'string' ? r.data.skillCommand : null;
      setSkillCommand(cmd);
      setEstimateText(
        est?.cost != null ? `~${est.cost} Credits (${est.kind ?? generateKind})` : 'unbekannt',
      );
      if (check && check.ok === false) {
        setBlocked(true);
        setError(
          Array.isArray(check.errors) && check.errors.length > 0
            ? check.errors.join(' · ')
            : 'Credit-Policy blockiert diese Aktion.',
        );
      }
    });
  }, [open, partId, generateKind]);

  const confirm = async () => {
    setLoading(true);
    const r = await bridgePost('generate', { id: partId, generateKind });
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    const msg =
      typeof r.data.messageDe === 'string'
        ? r.data.messageDe
        : 'Generate angefordert.';
    const cmd = typeof r.data.skillCommand === 'string' ? r.data.skillCommand : skillCommand;
    onResult(msg, cmd);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Credits — ${titleDe}`}
      size="md"
      testId="build-dev-credit-confirm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            type="button"
            disabled={loading || blocked}
            onClick={() => void confirm()}
            data-testid="build-dev-credit-confirm-go"
          >
            Weiter
          </Button>
        </div>
      }
    >
      <p className="text-sm text-stone-300">
        Geschätzte Kosten: <span className="font-semibold text-amber-100">{estimateText}</span>
      </p>
      <p className="mt-2 text-xs text-stone-500">
        Generate läuft über Meshy (Agent). Die Bridge prüft die Credit-Policy lokal und gibt den
        Skill-Befehl zurück.
      </p>
      {skillCommand ? (
        <pre className="mt-3 overflow-x-auto rounded border border-stone-700 bg-stone-950 p-2 text-[11px] text-stone-300">
          {skillCommand}
        </pre>
      ) : null}
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </Modal>
  );
}
