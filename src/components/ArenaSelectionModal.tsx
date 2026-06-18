/**
 * Arena selection modal for sandbox.
 * Location: src/components/ArenaSelectionModal.tsx
 */
import React from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { EmptyState } from './ui/EmptyState';
import { Badge } from './ui/Badge';

interface ArenaSelectionModalProps {
  isOpen: boolean;
  arenas: any[];
  cards: any[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelect: (arena: any) => void;
  onClose: () => void;
}

export function ArenaSelectionModal({
  isOpen,
  arenas,
  cards,
  searchTerm,
  onSearchChange,
  onSelect,
  onClose,
}: ArenaSelectionModalProps) {
  const filteredArenas = arenas.filter((arena) => {
    const search = searchTerm.toLowerCase();
    const biomCard = cards.find((c) => c.id === arena.biom_card_id);
    const mutationCard = cards.find((c) => c.id === arena.mutation_card_id);
    return (
      arena.name?.toLowerCase().includes(search) ||
      biomCard?.name?.toLowerCase().includes(search) ||
      mutationCard?.name?.toLowerCase().includes(search) ||
      biomCard?.effects?.some((effect: string) => effect.toLowerCase().includes(search)) ||
      mutationCard?.effects?.some((effect: string) => effect.toLowerCase().includes(search))
    );
  });

  return (
    <Modal open={isOpen} onClose={onClose} title="Arena wählen" size="lg" footer={null}>
      <div className="mb-4">
        <Input
          placeholder="Arenen suchen…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {arenas.length === 0 ? (
        <EmptyState
          title="Keine Arenen"
          subtitle="Erstelle Arenen in der Card Forge unter „Arena“."
          icon="🏟️"
        />
      ) : filteredArenas.length === 0 ? (
        <EmptyState title="Keine Treffer" subtitle={`Für „${searchTerm}“`} />
      ) : (
        <div className="space-y-3">
          {filteredArenas.map((arena) => {
            const biomCard = cards.find((c) => c.id === arena.biom_card_id);
            const mutationCard = cards.find((c) => c.id === arena.mutation_card_id);
            return (
              <button
                key={arena.id}
                onClick={() => onSelect(arena)}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/50 p-4 text-left transition-colors hover:border-purple-600 hover:bg-stone-800"
              >
                <h3 className="mb-3 text-base font-bold text-stone-100">{arena.name}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Badge variant="accent">BIOM</Badge>
                    <p className="text-sm text-stone-300">{biomCard?.name || '—'}</p>
                    <p className="text-xs text-stone-500">{biomCard?.effects?.join(', ') || biomCard?.effects_text || 'Keine Effekte'}</p>
                  </div>
                  <div className="space-y-1">
                    <Badge variant="warning">MUTATION</Badge>
                    <p className="text-sm text-stone-300">{mutationCard?.name || '—'}</p>
                    <p className="text-xs text-stone-500">{mutationCard?.effects?.join(', ') || mutationCard?.effects_text || 'Keine Effekte'}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
