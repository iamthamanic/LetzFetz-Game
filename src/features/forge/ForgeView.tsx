/**
 * Cards tab — library inventory of all cards; editor opens on select.
 * Location: src/features/forge/ForgeView.tsx
 */
import React, { useState, useEffect, useCallback } from 'react';
import { ImageCropModal } from './ImageCropModal';
import { CardLibrary, type CardLibraryFilter } from './CardLibrary';
import { CardForgeCardEditor } from './CardForgeCardEditor';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { packToForgeCards, mergeForgeOverlays } from '../../services/cardForge/packToForge';
import { loadCardOverlays, saveCardOverlay } from '../../services/storage/cardOverlays';
import type { ForgeCardData } from '../../services/cardForge/types';
import type { ForgeCardKind } from '../../services/cardForge/categories';

const emptyCard = (type: ForgeCardKind): ForgeCardData => ({
  id: `custom-${Date.now()}`,
  name: '',
  type,
  element: 'Neutral',
  stats_json: {},
  effects: [''],
  image_asset: '',
  notes: '',
  fromPack: false,
});

function prepareCardForEdit(card: ForgeCardData): ForgeCardData {
  return { ...card, effects: card.effects?.length ? card.effects : [''] };
}

function createKindFromFilter(filter: CardLibraryFilter): ForgeCardKind {
  return filter === 'All' ? 'Element' : filter;
}

export function ForgeView() {
  const [cards, setCards] = useState<ForgeCardData[]>([]);
  const [selectedCard, setSelectedCard] = useState<ForgeCardData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CardLibraryFilter>('All');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);

  const loadCards = useCallback(async () => {
    setLoading(true);
    const packCards = packToForgeCards();
    const localOverlays = loadCardOverlays();
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } },
      );
      let customCards: ForgeCardData[] = [];
      if (response.ok) {
        const data = await response.json();
        customCards = data
          .filter(
            (c: ForgeCardData) =>
              c.id &&
              !packCards.some((p) => p.id === c.id) &&
              ['Character', 'Ultimate', 'Element', 'Arena', 'Glitch'].includes(c.type),
          )
          .map((c: ForgeCardData) => ({
            ...c,
            effects: c.effects?.length ? c.effects : [''],
            fromPack: false,
          }));
      }
      setCards([...mergeForgeOverlays(packCards, localOverlays), ...customCards]);
    } catch (error) {
      console.error('Error fetching custom cards:', error);
      setCards(mergeForgeOverlays(packCards, localOverlays));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleFilterChange = (filter: CardLibraryFilter) => {
    setActiveFilter(filter);
    setSearchTerm('');
  };

  const handleSelectCard = (card: ForgeCardData) => {
    setSelectedCard(prepareCardForEdit(card));
    setIsCreating(false);
  };

  const handleCloseEditor = () => {
    setSelectedCard(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!selectedCard) return;
    setSaving(true);
    try {
      if (selectedCard.fromPack) {
        saveCardOverlay(selectedCard.id, {
          image_asset: selectedCard.image_asset,
          notes: selectedCard.notes,
        });
        setCards((prev) =>
          prev.map((c) =>
            c.id === selectedCard.id
              ? {
                  ...c,
                  image_asset: selectedCard.image_asset,
                  notes: selectedCard.notes,
                  updated_at: new Date().toISOString(),
                }
              : c,
          ),
        );
        setIsCreating(false);
        return;
      }

      const isNew = selectedCard.id.startsWith('custom-');
      const url = isNew
        ? `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards`
        : `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards/${selectedCard.id}`;

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { Authorization: `Bearer ${publicAnonKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCard),
      });
      if (response.ok) {
        await loadCards();
        setIsCreating(false);
        setSelectedCard(await response.json());
      }
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCard?.id || selectedCard.fromPack) {
      alert('Pack-Karten können nicht gelöscht werden — nur Bild/Notizen bearbeiten.');
      return;
    }
    if (!confirm('Diese Custom-Karte wirklich löschen?')) return;
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards/${selectedCard.id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${publicAnonKey}` } },
      );
      if (response.ok) {
        await loadCards();
        handleCloseEditor();
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleCreateNew = () => {
    setSelectedCard(emptyCard(createKindFromFilter(activeFilter)));
    setIsCreating(true);
  };

  const updateField = (field: string, value: unknown) => {
    if (!selectedCard) return;
    setSelectedCard({ ...selectedCard, [field]: value });
  };

  const updateStats = (stat: string, value: number) => {
    if (!selectedCard) return;
    setSelectedCard({
      ...selectedCard,
      stats_json: { ...selectedCard.stats_json, [stat]: value },
    });
  };

  const updateEffect = (index: number, value: string) => {
    if (!selectedCard) return;
    const effects = [...(selectedCard.effects || [])];
    effects[index] = value;
    setSelectedCard({ ...selectedCard, effects });
  };

  const addEffect = () => {
    if (!selectedCard) return;
    setSelectedCard({ ...selectedCard, effects: [...(selectedCard.effects || []), ''] });
  };

  const removeEffect = (index: number) => {
    if (!selectedCard) return;
    setSelectedCard({
      ...selectedCard,
      effects: (selectedCard.effects || []).filter((_, i) => i !== index),
    });
  };

  const handleImageSelect = (file: File) => {
    if (!file) return;
    setImageToCrop(URL.createObjectURL(file));
    setCropModalOpen(true);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setCropModalOpen(false);
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
      setImageToCrop(null);
    }
    setUploading(true);
    setUploadProgress('Bild wird hochgeladen…');
    try {
      const formData = new FormData();
      formData.append('file', croppedImageBlob, 'cropped-image.jpg');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/upload-image`,
        { method: 'POST', headers: { Authorization: `Bearer ${publicAnonKey}` }, body: formData },
      );
      if (response.ok) {
        const data = await response.json();
        updateField('image_asset', data.url);
        setUploadProgress('Bild hochgeladen ✓');
        setTimeout(() => setUploadProgress(''), 3000);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
      setImageToCrop(null);
    }
  };

  const filteredCards = cards
    .filter((c) => activeFilter === 'All' || c.type === activeFilter)
    .filter(
      (c) =>
        !searchTerm ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.element.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.elementDisplay?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        c.effects.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase())),
    );

  const showEditor = selectedCard !== null;

  return (
    <div className="flex min-h-0 flex-1 bg-stone-950 text-stone-100">
      {showEditor && selectedCard ? (
        <CardForgeCardEditor
          selectedCard={selectedCard}
          isCreating={isCreating}
          saving={saving}
          uploading={uploading}
          uploadProgress={uploadProgress}
          onFieldChange={updateField}
          onStatsChange={updateStats}
          onEffectChange={updateEffect}
          onAddEffect={addEffect}
          onRemoveEffect={removeEffect}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={handleCloseEditor}
          onImageSelect={handleImageSelect}
          onNotesModalOpen={() => setNotesModalOpen(true)}
          notesModalOpen={notesModalOpen}
          onNotesModalClose={() => setNotesModalOpen(false)}
          onNotesSave={(notes) => {
            updateField('notes', notes);
            if (selectedCard.id) handleSave();
          }}
        />
      ) : (
        <CardLibrary
          cards={cards}
          filteredCards={filteredCards}
          loading={loading}
          searchTerm={searchTerm}
          activeFilter={activeFilter}
          onSearchChange={setSearchTerm}
          onFilterChange={handleFilterChange}
          onSelectCard={handleSelectCard}
          onCreateNew={handleCreateNew}
        />
      )}

      {imageToCrop && (
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={handleCropCancel}
          imageUrl={imageToCrop}
          onCropComplete={handleCropComplete}
          cardName={selectedCard?.name || 'Karte'}
        />
      )}
    </div>
  );
}
