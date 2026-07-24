/**
 * Arena selection modal — BASE_PACK arenas only.
 * Location: src/features/sandbox/ArenaSelectionModal.tsx
 */
import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import type { SandboxArena } from './model/sandboxTypes';

interface ArenaSelectionModalProps {
  isOpen: boolean;
  arenas: SandboxArena[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelect: (arena: SandboxArena) => void;
  onClose: () => void;
}

export function ArenaSelectionModal({
  isOpen,
  arenas,
  searchTerm,
  onSearchChange,
  onSelect,
  onClose,
}: ArenaSelectionModalProps) {
  const search = searchTerm.toLowerCase();
  const filteredArenas = arenas.filter(
    (arena) =>
      arena.name.toLowerCase().includes(search) ||
      arena.role.toLowerCase().includes(search) ||
      arena.baseEffect.toLowerCase().includes(search) ||
      arena.specialRule.toLowerCase().includes(search),
  );

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
        <EmptyState title="Keine Arenen" subtitle="Base Pack enthält keine Arenen." icon="🏟️" />
      ) : filteredArenas.length === 0 ? (
        <EmptyState title="Keine Treffer" subtitle={`Für „${searchTerm}“`} />
      ) : (
        <div className="space-y-3">
          {filteredArenas.map((arena) => (
            <button
              key={arena.id}
              type="button"
              data-testid={`sandbox-arena-option-${arena.id}`}
              onClick={() => onSelect(arena)}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/50 p-4 text-left transition-colors hover:border-amber-500 hover:bg-stone-800"
            >
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-100">{arena.name}</h3>
                <Badge variant="warning">{arena.role}</Badge>
              </div>
              <p className="text-sm text-stone-300">{arena.baseEffect}</p>
              <p className="mt-1 text-xs text-stone-500">{arena.specialRule}</p>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
