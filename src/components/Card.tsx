import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CardNotes } from './CardNotes';
import { createPortal } from 'react-dom';

interface CardProps {
  id: string;
  name: string;
  type: 'Character_Base' | 'Subclass_Element' | 'Specialization_Loadout' | 'Arena_Biom' | 'Arena_Mutation';
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Light' | 'Shadow' | 'Neutral';
  stats_json?: {
    hp?: number;
    mana?: number;
    attack?: number;
  };
  effects?: string[];
  effects_text?: string; // Backward compatibility
  image_asset?: string;
  trigger_dice_value?: number; // For Arena cards
  preview?: boolean;
  scale?: number; // Scale factor for card size (default 1)
  onRemove?: () => void; // Callback to remove card from arena
  notes?: string; // Card-specific notes
  created_at?: string;
  updated_at?: string;
  onNotesChange?: (notes: string) => void; // Callback when notes are saved
}

const elementColors = {
  Fire: 'from-red-600 to-orange-500',
  Water: 'from-blue-600 to-cyan-500',
  Earth: 'from-green-700 to-lime-600',
  Air: 'from-sky-400 to-cyan-300',
  Light: 'from-yellow-300 to-amber-200',
  Shadow: 'from-purple-900 to-indigo-700',
  Neutral: 'from-gray-600 to-gray-500'
};

const elementBorders = {
  Fire: 'border-red-500',
  Water: 'border-blue-500',
  Earth: 'border-green-600',
  Air: 'border-cyan-400',
  Light: 'border-yellow-400',
  Shadow: 'border-purple-700',
  Neutral: 'border-gray-500'
};

const typeIcons = {
  Character_Base: '⚔️',
  Subclass_Element: '✨',
  Specialization_Loadout: '🎯',
  Arena_Biom: '🌍',
  Arena_Mutation: '⚡'
};

export function Card({ 
  id, 
  name, 
  type, 
  element, 
  stats_json, 
  effects,
  effects_text, 
  image_asset,
  trigger_dice_value,
  preview = false,
  scale = 1,
  onRemove,
  notes = '',
  created_at,
  updated_at,
  onNotesChange
}: CardProps) {
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [effectsModalOpen, setEffectsModalOpen] = useState(false);
  
  // Use effects array if available, otherwise fall back to effects_text
  const effectsList = effects && effects.length > 0 ? effects : (effects_text ? [effects_text] : []);
  
  const handleNotesSave = (newNotes: string) => {
    if (onNotesChange) {
      onNotesChange(newNotes);
    }
  };
  
  return (
    <div className="relative inline-block" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      {/* Action Buttons - Outside Card */}
      {onRemove && (
        <>
          {/* Remove Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-10 -left-3 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors shadow-lg border-2 border-gray-900"
            title="Remove from arena"
          >
            ✕
          </button>
          
          {/* Notes Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNotesModalOpen(true);
            }}
            className="absolute -top-10 left-5 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors shadow-lg border-2 border-gray-900"
            title="Card notes"
          >
            📝
          </button>
        </>
      )}
      
      {/* Card Container */}
      <div 
        className={`w-64 h-96 rounded-xl overflow-hidden shadow-2xl border-4 ${element ? elementBorders[element] : 'border-gray-500'} bg-gradient-to-br ${element ? elementColors[element] : 'from-gray-600 to-gray-500'} ${!preview ? 'cursor-grab active:cursor-grabbing hover:scale-105 transition-transform' : ''}`}
        draggable={!preview}
        data-card-id={id}
      >

      {/* Card Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3 border-b-2 border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{type ? typeIcons[type] : '❓'}</span>
            <h3 className="text-white truncate text-sm">{name || 'Unnamed Card'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded">
              {element || 'Unknown'}
            </div>
            {(type === 'Arena_Biom' || type === 'Arena_Mutation') && trigger_dice_value && (
              <div className="text-xs text-white bg-purple-600 px-2 py-1 rounded flex items-center gap-1">
                🎲 {trigger_dice_value}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Image */}
      <div className="absolute top-16 left-0 right-0 h-48 overflow-hidden">
        {image_asset ? (
          <ImageWithFallback 
            src={image_asset} 
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/30">
            <span className="text-6xl opacity-50">{typeIcons[type]}</span>
          </div>
        )}
      </div>

      {/* Stats Section */}
      {stats_json && (type === 'Character_Base' || type === 'Subclass_Element') && (
        <div className="absolute top-64 left-0 right-0 flex justify-around bg-black/70 backdrop-blur-sm py-2 border-y border-white/20">
          {stats_json.hp !== undefined && (
            <div className="text-center">
              <div className="text-xs text-white/60">HP</div>
              <div className="text-white">{stats_json.hp}</div>
            </div>
          )}
          {stats_json.mana !== undefined && (
            <div className="text-center">
              <div className="text-xs text-white/60">Mana</div>
              <div className="text-white">{stats_json.mana}</div>
            </div>
          )}
          {stats_json.attack !== undefined && (
            <div className="text-center">
              <div className="text-xs text-white/60">ATK</div>
              <div className="text-white">{stats_json.attack}</div>
            </div>
          )}
        </div>
      )}

      {/* Effects List */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-3 border-t-2 border-white/20 max-h-28 overflow-y-auto">
        {effectsList.length > 0 ? (
          <ul 
            className="space-y-1 cursor-pointer hover:bg-white/5 -mx-1 px-1 py-1 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setEffectsModalOpen(true);
            }}
            title="Click to view full effects"
          >
            {effectsList.map((effect, index) => (
              <li key={index} className="text-white/90 text-xs flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span className="flex-1 line-clamp-2">{effect}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/60 text-xs italic">No effects described.</p>
        )}
      </div>

      {/* Type Badge */}
      <div className="absolute top-64 right-2 text-xs text-white/40 bg-black/60 px-2 py-1 rounded z-10">
        {type ? type.replace(/_/g, ' ') : 'Unknown'}
      </div>
      </div>
      
      {/* Card Notes Modal */}
      {onRemove && (
        <CardNotes
          isOpen={notesModalOpen}
          onClose={() => setNotesModalOpen(false)}
          cardName={name}
          cardId={id}
          initialNotes={notes}
          onSave={handleNotesSave}
          createdAt={created_at}
          updatedAt={updated_at}
        />
      )}
      
      {/* Effects Modal */}
      {effectsModalOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setEffectsModalOpen(false)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border-2 border-purple-500/50 shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-white/10 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white text-2xl flex items-center gap-3">
                  <span className="text-3xl">{typeIcons[type]}</span>
                  <span>{name}</span>
                </h3>
                <p className="text-purple-300 mt-1">Card Effects</p>
              </div>
              <button
                onClick={() => setEffectsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors text-3xl leading-none"
                title="Close"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {effectsList.length > 0 ? (
                <ul className="space-y-4">
                  {effectsList.map((effect, index) => (
                    <li key={index} className="flex items-start gap-4 bg-black/30 p-6 rounded-lg border border-white/10">
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
      )}
    </div>
  );
}