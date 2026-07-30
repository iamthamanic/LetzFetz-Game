/**
 * + New part wizard — Spec draft via Dev-Asset-Bridge.
 * Location: src/features/build/development/NewPartWizardModal.tsx
 */
import React, { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  ELEMENT_OPTIONS,
  SLOT_OPTIONS,
  bridgePost,
  slugifyPartId,
} from './assetBridgeClient';

interface NewPartWizardModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

export function NewPartWizardModal({ open, onClose, onCreated }: NewPartWizardModalProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [slot, setSlot] = useState('drive');
  const [element, setElement] = useState('shadow');
  const [dominant, setDominant] = useState('');
  const [secondary, setSecondary] = useState('');
  const [metaphor, setMetaphor] = useState('');
  const [silhouette, setSilhouette] = useState('');
  const [comedy, setComedy] = useState('');
  const [gameplay, setGameplay] = useState('');
  const [shapes, setShapes] = useState('Form A\nForm B\nForm C');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName('');
    setId('');
    setIdTouched(false);
    setSlot('drive');
    setElement('shadow');
    setDominant('');
    setSecondary('');
    setMetaphor('');
    setSilhouette('');
    setComedy('');
    setGameplay('');
    setShapes('Form A\nForm B\nForm C');
    setError(null);
    setBusy(false);
  }, [open]);

  useEffect(() => {
    if (!idTouched) setId(slugifyPartId(name));
  }, [name, idTouched]);

  const submit = async () => {
    setError(null);
    const largeShapes = shapes
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!name.trim() || !id.trim()) {
      setError('Name und ID sind Pflicht.');
      return;
    }
    if (largeShapes.length < 3 || largeShapes.length > 5) {
      setError('Großformen: 3–5 Zeilen.');
      return;
    }
    if (!dominant.trim() || !secondary.trim() || !metaphor.trim() || !silhouette.trim() || !comedy.trim()) {
      setError('Design-DNA-Felder ausfüllen.');
      return;
    }
    setBusy(true);
    const result = await bridgePost('create-spec', {
      id,
      spec: {
        id,
        name: name.trim(),
        slot,
        element,
        gameplayFunction: gameplay.trim() || `${name.trim()} — Spielwirkung TBD`,
        designDna: {
          dominantScrapObject: dominant.trim(),
          secondaryScrapObject: secondary.trim(),
          mechanicalMetaphor: metaphor.trim(),
          silhouetteArchetype: silhouette.trim(),
          comedyHook: comedy.trim(),
          largeShapes,
          secondaryDetails: [],
        },
      },
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onCreated(id);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Neues Teil"
      size="lg"
      testId="build-dev-new-wizard"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={busy}>
            Abbrechen
          </Button>
          <Button type="button" onClick={() => void submit()} disabled={busy} data-testid="build-dev-new-submit">
            {busy ? 'Speichern…' : 'Draft anlegen'}
          </Button>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Name (DE)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sogkammer"
          data-testid="build-dev-new-name"
        />
        <Input
          label="ID (slug)"
          value={id}
          onChange={(e) => {
            setIdTouched(true);
            setId(e.target.value);
          }}
          placeholder="shadow-suction-chamber"
          data-testid="build-dev-new-id"
        />
        <Select
          label="Slot"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          options={SLOT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
        <Select
          label="Element"
          value={element}
          onChange={(e) => setElement(e.target.value)}
          options={ELEMENT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
        <div className="sm:col-span-2">
          <Input
            label="Gameplay-Funktion"
            value={gameplay}
            onChange={(e) => setGameplay(e.target.value)}
            placeholder="Was macht das Teil im Spiel?"
          />
        </div>
        <Input
          label="Dominanter Schrott"
          value={dominant}
          onChange={(e) => setDominant(e.target.value)}
        />
        <Input
          label="Zweiter Schrott"
          value={secondary}
          onChange={(e) => setSecondary(e.target.value)}
        />
        <Input
          label="Mechanische Metapher"
          value={metaphor}
          onChange={(e) => setMetaphor(e.target.value)}
        />
        <Input
          label="Silhouetten-Archetyp"
          value={silhouette}
          onChange={(e) => setSilhouette(e.target.value)}
        />
        <div className="sm:col-span-2">
          <Input
            label="Comedy-Hook (genau einer)"
            value={comedy}
            onChange={(e) => setComedy(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Großformen (3–5, je Zeile)
          </label>
          <textarea
            className="min-h-[88px] w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-stone-100"
            value={shapes}
            onChange={(e) => setShapes(e.target.value)}
          />
        </div>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-rose-300" data-testid="build-dev-new-error">
          {error}
        </p>
      ) : null}
    </Modal>
  );
}
