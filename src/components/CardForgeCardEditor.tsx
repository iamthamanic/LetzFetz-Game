/**
 * Card Forge editor — kind-specific fields for V1 rulebook cards.
 * Location: src/components/CardForgeCardEditor.tsx
 */
import React from 'react';
import { X, Save, Trash2, Upload, StickyNote, Lock, Loader2 } from 'lucide-react';
import { Card } from './Card';
import { CardNotes } from './CardNotes';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Panel } from './ui/Panel';
import { CARD_CATEGORIES } from '../services/cardForge/categories';
import type { ForgeCardData, ForgeElement } from '../services/cardForge/types';

const ELEMENTS: ForgeElement[] = ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Shadow', 'Neutral', 'Frei'];

interface CardForgeCardEditorProps {
  selectedCard: ForgeCardData;
  isCreating: boolean;
  saving: boolean;
  uploading: boolean;
  uploadProgress: string;
  onFieldChange: (field: string, value: unknown) => void;
  onStatsChange: (stat: string, value: number) => void;
  onEffectChange: (index: number, value: string) => void;
  onAddEffect: () => void;
  onRemoveEffect: (index: number) => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  onImageSelect: (file: File) => void;
  onNotesModalOpen: () => void;
  notesModalOpen: boolean;
  onNotesModalClose: () => void;
  onNotesSave: (notes: string) => void;
}

export function CardForgeCardEditor({
  selectedCard,
  isCreating,
  saving,
  uploading,
  uploadProgress,
  onFieldChange,
  onStatsChange,
  onEffectChange,
  onAddEffect,
  onRemoveEffect,
  onSave,
  onDelete,
  onClose,
  onImageSelect,
  onNotesModalOpen,
  notesModalOpen,
  onNotesModalClose,
  onNotesSave,
}: CardForgeCardEditorProps) {
  const isPackCard = selectedCard.fromPack === true;
  const readOnly = isPackCard;

  const kindOptions = CARD_CATEGORIES.map((c) => ({ value: c.id, label: c.label }));
  const elementOptions = ELEMENTS.map((el) => ({ value: el, label: el }));
  const typeOptions = [
    { value: 'attack', label: 'Angriff' },
    { value: 'block', label: 'Block' },
    { value: 'boost', label: 'Boost' },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden bg-stone-950">
        <div className="flex-none border-b border-stone-800 bg-stone-900/80 px-6 py-3"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3">
              {isPackCard && <Badge variant="warning">BASE PACK</Badge>}
              {isCreating && <Badge variant="success">NEU</Badge>}
              <h2 className="text-lg font-bold text-stone-100">
                {isCreating ? 'Neue Custom-Karte' : selectedCard.name || 'Unbenannte Karte'}
              </h2>
            </div>
            <Button variant="ghost" size="sm" icon={<X className="h-5 w-5" />} onClick={onClose} />
          </div>
        </div>

        {isPackCard && (
          <div className="flex-none border-b border-amber-900/30 bg-amber-950/20 px-6 py-2">
            <div className="mx-auto flex max-w-6xl items-center gap-2 text-xs text-amber-300">
              <Lock className="h-3 w-3" />
              Base-Pack V1 — Texte sind fest. Bild & Notizen können überschrieben werden.
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            <Panel className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="Name"
                  value={selectedCard.name}
                  disabled={readOnly}
                  onChange={(e) => onFieldChange('name', e.target.value)}
                />
                <Select
                  label="Kartenart"
                  options={kindOptions}
                  value={selectedCard.type}
                  disabled={readOnly}
                  onChange={(e) => onFieldChange('type', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Select
                  label="Element"
                  options={elementOptions}
                  value={selectedCard.element}
                  disabled={readOnly}
                  onChange={(e) => onFieldChange('element', e.target.value)}
                />
                {selectedCard.type === 'Character' && (
                  <Input
                    label="Startleben"
                    type="number"
                    min={1}
                    value={selectedCard.stats_json?.hp ?? 20}
                    disabled={readOnly}
                    onChange={(e) => onStatsChange('hp', parseInt(e.target.value) || 20)}
                  />
                )}
              </div>

              {selectedCard.type === 'Element' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input
                    label="Wert / Widerstand"
                    type="number"
                    min={0}
                    value={selectedCard.stats_json?.value ?? ''}
                    disabled={readOnly}
                    onChange={(e) => onStatsChange('value', parseInt(e.target.value) || 0)}
                  />
                  <Select
                    label="Typ"
                    options={typeOptions}
                    value={selectedCard.stats_json?.cardType ?? 'attack'}
                    disabled={readOnly}
                    onChange={(e) =>
                      onFieldChange('stats_json', {
                        ...selectedCard.stats_json,
                        cardType: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {selectedCard.type === 'Character' ? 'Passiv, Ulti & Strategie' : 'Effekte & Regeltext'}
                  </span>
                  {!readOnly && (
                    <Button variant="secondary" size="sm" onClick={onAddEffect}>
                      + Effekt
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {(selectedCard.effects || []).map((effect, index) => (
                    <div key={index} className="flex gap-2">
                      {readOnly ? (
                        <div className="flex-1 rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-300">
                          {effect}
                        </div>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={effect}
                            onChange={(e) => onEffectChange(index, e.target.value)}
                            className="min-w-0 flex-1 rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-100 outline-none transition-colors focus:border-purple-500"
                          />
                          {(selectedCard.effects || []).length > 1 && (
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<X className="h-4 w-4" />}
                              onClick={() => onRemoveEffect(index)}
                              className="px-2"
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Input
                label="Kartenbild URL"
                value={selectedCard.image_asset}
                onChange={(e) => onFieldChange('image_asset', e.target.value)}
                placeholder="https://…"
              />

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageSelect(file);
                    e.target.value = '';
                  }}
                  className="hidden"
                  disabled={uploading}
                />
                <label htmlFor="image-upload" className="contents">
                  <span
                    className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      uploading
                        ? 'border-stone-700 bg-stone-800 text-stone-500'
                        : 'border-stone-700 bg-stone-900 text-stone-300 hover:border-purple-500 hover:text-stone-100'
                    }`}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? 'Upload läuft…' : 'Bild hochladen'}
                  </span>
                </label>
                {uploadProgress && <span className="text-xs text-emerald-400">{uploadProgress}</span>}
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={<StickyNote className="h-4 w-4" />}
                onClick={onNotesModalOpen}
                className="w-full"
              >
                Notizen {selectedCard.notes?.trim() ? '📝' : ''}
              </Button>

              <div className="flex gap-3 pt-2">
                <Button
                  variant={isPackCard ? 'success' : 'success'}
                  size="md"
                  icon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  onClick={onSave}
                  disabled={saving || (!isPackCard && !selectedCard.name)}
                  className="flex-1"
                >
                  {saving ? 'Speichern…' : isPackCard ? 'Bild & Notizen speichern' : 'Karte speichern'}
                </Button>
                {!isCreating && !isPackCard && (
                  <Button
                    variant="danger"
                    size="md"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={onDelete}
                  >
                    Löschen
                  </Button>
                )}
              </div>
            </Panel>

            <div className="flex flex-col items-center">
              <span className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Vorschau</span>
              <Card
                id={selectedCard.id}
                name={selectedCard.name}
                type={selectedCard.type}
                element={selectedCard.element}
                elements={selectedCard.elements}
                elementDisplay={selectedCard.elementDisplay}
                stats_json={selectedCard.stats_json}
                effects={selectedCard.effects}
                image_asset={selectedCard.image_asset}
                preview={true}
              />
            </div>
          </div>
        </div>
      </div>

      <CardNotes
        isOpen={notesModalOpen}
        onClose={onNotesModalClose}
        cardName={selectedCard.name || 'Unbenannte Karte'}
        cardId={selectedCard.id}
        initialNotes={selectedCard.notes || ''}
        onSave={onNotesSave}
      />
    </>
  );
}
