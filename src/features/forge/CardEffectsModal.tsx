import React from 'react';
import { createPortal } from 'react-dom';

interface CardEffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  type: string;
  effects: string[];
}

const typeIcons: Record<string, string> = {
  Character: '⚔️', Ultimate: '💫', Element: '🃏', Arena: '🏟️', Glitch: '🌀',
};

export function CardEffectsModal({ isOpen, onClose, name, type, effects }: CardEffectsModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border-2 border-purple-500/50 shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white text-2xl flex items-center gap-3">
              <span className="text-3xl">{typeIcons[type] || '❓'}</span>
              <span>{name}</span>
            </h3>
            <p className="text-purple-300 mt-1">Card Effects</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {effects.length > 0 ? (
            <ul className="space-y-4">
              {effects.map((effect, i) => (
                <li key={i} className="flex items-start gap-4 bg-black/30 p-6 rounded-lg border border-white/10">
                  <span className="text-yellow-400 text-2xl mt-1 flex-shrink-0">•</span>
                  <span className="text-white/90 leading-relaxed flex-1 text-lg">{effect}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/60 italic text-center py-12 text-lg">No effects described.</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
