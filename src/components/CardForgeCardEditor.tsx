/**
 * Card Forge editor — kind-specific fields for V1 rulebook cards.
 * Location: src/components/CardForgeCardEditor.tsx
 */
import React from 'react';
import { X, Save, Trash2, Upload, StickyNote, Lock } from 'lucide-react';
import { Card } from './Card';
import { CardNotes } from './CardNotes';
import { CARD_CATEGORIES } from '../services/cardForge/categories';
import type { ForgeCardData, ForgeElement } from '../services/cardForge/types';

const ELEMENTS: ForgeElement[] = [
  'Fire',
  'Water',
  'Earth',
  'Air',
  'Light',
  'Shadow',
  'Neutral',
  'Frei',
];

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

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-white">
                {isCreating ? 'Neue Custom-Karte' : selectedCard.name}
              </h2>
              {isPackCard && (
                <p className="text-sm text-amber-400 mt-1 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Base-Pack V1 — Texte sind fest. Bild & Notizen editierbar.
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isCreating && (
                <button
                  onClick={onSave}
                  disabled={saving || !selectedCard.name}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white rounded-lg"
                >
                  <Save className="w-5 h-5" />
                  Anlegen
                </button>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  value={selectedCard.name}
                  disabled={readOnly}
                  onChange={(e) => onFieldChange('name', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Kartenart</label>
                <select
                  value={selectedCard.type}
                  disabled={readOnly}
                  onChange={(e) => onFieldChange('type', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none disabled:opacity-60"
                >
                  {CARD_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Element</label>
                <select
                  value={selectedCard.element}
                  disabled={readOnly}
                  onChange={(e) => onFieldChange('element', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none disabled:opacity-60"
                >
                  {ELEMENTS.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCard.type === 'Character' && (
                <div>
                  <label className="block text-white mb-2">Startleben</label>
                  <input
                    type="number"
                    value={selectedCard.stats_json?.hp ?? 20}
                    disabled={readOnly}
                    onChange={(e) => onStatsChange('hp', parseInt(e.target.value) || 20)}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 disabled:opacity-60"
                  />
                </div>
              )}

              {selectedCard.type === 'Element' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white mb-2">Wert / Widerstand</label>
                    <input
                      type="number"
                      value={selectedCard.stats_json?.value ?? ''}
                      disabled={readOnly}
                      onChange={(e) => onStatsChange('value', parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Typ</label>
                    <select
                      value={selectedCard.stats_json?.cardType ?? 'attack'}
                      disabled={readOnly}
                      onChange={(e) =>
                        onFieldChange('stats_json', {
                          ...selectedCard.stats_json,
                          cardType: e.target.value,
                        })
                      }
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 disabled:opacity-60"
                    >
                      <option value="attack">Angriff</option>
                      <option value="block">Block</option>
                      <option value="boost">Boost</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-white">
                    {selectedCard.type === 'Character'
                      ? 'Passiv, Ulti & Strategie'
                      : 'Effekte & Regeltext'}
                  </label>
                  {!readOnly && (
                    <button
                      onClick={onAddEffect}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      + Effekt
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {(selectedCard.effects || []).map((effect, index) => (
                    <div key={index} className="flex gap-2">
                      {readOnly ? (
                        <p className="flex-1 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                          {effect}
                        </p>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={effect}
                            onChange={(e) => onEffectChange(index, e.target.value)}
                            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                          />
                          {(selectedCard.effects || []).length > 1 && (
                            <button
                              onClick={() => onRemoveEffect(index)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Kartenbild</label>
                <input
                  type="text"
                  value={selectedCard.image_asset}
                  onChange={(e) => onFieldChange('image_asset', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2"
                  placeholder="URL oder Upload…"
                />
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
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${
                    uploading
                      ? 'bg-gray-700 border-gray-600 text-gray-400'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Upload…' : 'Vom Computer hochladen'}
                </label>
                {uploadProgress && (
                  <div className="text-sm text-green-400 mt-2">{uploadProgress}</div>
                )}
              </div>

              <button
                onClick={onNotesModalOpen}
                className="w-full bg-amber-600/80 hover:bg-amber-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <StickyNote className="w-5 h-5" />
                Notizen {selectedCard.notes?.trim() ? '📝' : ''}
              </button>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onSave}
                  disabled={saving || (!isPackCard && !selectedCard.name)}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Speichern…' : isPackCard ? 'Bild & Notizen speichern' : 'Karte speichern'}
                </button>
                {!isCreating && !isPackCard && (
                  <button
                    onClick={onDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Löschen
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-white mb-4">Vorschau</label>
              <div className="flex justify-center">
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
