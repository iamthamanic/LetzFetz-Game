import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Save, Trash2, X, Upload, StickyNote } from 'lucide-react';
import { Card } from './Card';
import { CardNotes } from './CardNotes';
import { ImageCropModal } from './ImageCropModal';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CardData {
  id?: string;
  name: string;
  type: 'Character_Base' | 'Subclass_Element' | 'Specialization_Loadout' | 'Arena_Biom' | 'Arena_Mutation';
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Light' | 'Shadow' | 'Neutral';
  stats_json: {
    hp?: number;
    mana?: number;
    attack?: number;
  };
  effects: string[];
  image_asset: string;
  trigger_dice_value?: number; // For Arena cards
  notes?: string; // Card-specific notes
}

const CARD_TYPES = ['Character_Base', 'Subclass_Element', 'Specialization_Loadout', 'Arena_Biom', 'Arena_Mutation'];
const ELEMENTS = ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Shadow', 'Neutral'];

const emptyCard: CardData = {
  name: '',
  type: 'Character_Base',
  element: 'Neutral',
  stats_json: {},
  effects: ['', '', '', ''],
  image_asset: '',
  notes: ''
};

interface ArenaData {
  id?: string;
  name: string;
  biom_card_id: string;
  mutation_card_id: string;
  created_at?: string;
}

export function CardForge() {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Character_Base');
  const [mainTab, setMainTab] = useState<'cards' | 'arenas'>('cards');
  
  // Arena Library state
  const [arenas, setArenas] = useState<ArenaData[]>([]);
  const [selectedArena, setSelectedArena] = useState<ArenaData | null>(null);
  const [isCreatingArena, setIsCreatingArena] = useState(false);
  const [newArenaName, setNewArenaName] = useState('');
  const [selectedBiomId, setSelectedBiomId] = useState('');
  const [selectedMutationId, setSelectedMutationId] = useState('');
  
  // Image upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  
  // Image crop state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  
  // Card Notes Modal state
  const [notesModalOpen, setNotesModalOpen] = useState(false);

  useEffect(() => {
    fetchCards();
    fetchArenas();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Migrate old format to new format
        const migratedData = data.map((card: any) => {
          if (!card.effects && card.effects_text) {
            return { ...card, effects: [card.effects_text] };
          }
          if (!card.effects) {
            return { ...card, effects: [] };
          }
          return card;
        });
        setCards(migratedData);
      } else {
        console.error('Failed to fetch cards:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCard) return;
    
    setSaving(true);
    try {
      const url = selectedCard.id
        ? `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards/${selectedCard.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards`;
      
      const method = selectedCard.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedCard)
      });
      
      if (response.ok) {
        await fetchCards();
        setIsCreating(false);
        const savedCard = await response.json();
        setSelectedCard(savedCard);
      } else {
        console.error('Failed to save card:', await response.text());
        alert('Failed to save card');
      }
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Error saving card');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCard?.id) return;
    
    if (!confirm('Are you sure you want to delete this card?')) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards/${selectedCard.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      
      if (response.ok) {
        await fetchCards();
        setSelectedCard(null);
        setIsCreating(false);
      } else {
        console.error('Failed to delete card:', await response.text());
        alert('Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error deleting card');
    }
  };

  const handleCreateNew = () => {
    setSelectedCard({ ...emptyCard, type: activeTab as any });
    setIsCreating(true);
  };

  // Arena functions
  const fetchArenas = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c701770f/arenas`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setArenas(data);
      } else {
        console.error('Failed to fetch arenas:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching arenas:', error);
    }
  };

  const handleCreateArena = async () => {
    if (!newArenaName || !selectedBiomId || !selectedMutationId) {
      alert('Please fill all fields: Arena Name, Biom, and Mutation');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c701770f/arenas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newArenaName,
          biom_card_id: selectedBiomId,
          mutation_card_id: selectedMutationId
        })
      });
      
      if (response.ok) {
        await fetchArenas();
        setNewArenaName('');
        setSelectedBiomId('');
        setSelectedMutationId('');
        setIsCreatingArena(false);
      } else {
        console.error('Failed to create arena:', await response.text());
        alert('Failed to create arena');
      }
    } catch (error) {
      console.error('Error creating arena:', error);
      alert('Error creating arena');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArena = async (arenaId: string) => {
    if (!confirm('Are you sure you want to delete this arena?')) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c701770f/arenas/${arenaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.ok) {
        await fetchArenas();
      } else {
        console.error('Failed to delete arena:', await response.text());
        alert('Failed to delete arena');
      }
    } catch (error) {
      console.error('Error deleting arena:', error);
      alert('Error deleting arena');
    }
  };

  const handleUpdateArenaName = async (arenaId: string, newName: string) => {
    if (!newName.trim()) {
      alert('Arena name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c701770f/arenas/${arenaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      });
      
      if (response.ok) {
        const updatedArena = await response.json();
        // Update local state
        setArenas(arenas.map(a => a.id === arenaId ? updatedArena : a));
        if (selectedArena?.id === arenaId) {
          setSelectedArena(updatedArena);
        }
      } else {
        console.error('Failed to update arena name:', await response.text());
        alert('Failed to update arena name');
      }
    } catch (error) {
      console.error('Error updating arena name:', error);
      alert('Error updating arena name');
    }
  };

  const updateField = (field: string, value: any) => {
    if (!selectedCard) return;
    setSelectedCard({ ...selectedCard, [field]: value });
  };

  const updateStats = (stat: string, value: number) => {
    if (!selectedCard) return;
    setSelectedCard({
      ...selectedCard,
      stats_json: {
        ...selectedCard.stats_json,
        [stat]: value
      }
    });
  };

  const updateEffect = (index: number, value: string) => {
    if (!selectedCard) return;
    const newEffects = [...(selectedCard.effects || [])];
    newEffects[index] = value;
    setSelectedCard({ ...selectedCard, effects: newEffects });
  };

  const addEffect = () => {
    if (!selectedCard) return;
    setSelectedCard({ ...selectedCard, effects: [...(selectedCard.effects || []), ''] });
  };

  const removeEffect = (index: number) => {
    if (!selectedCard) return;
    const newEffects = (selectedCard.effects || []).filter((_, i) => i !== index);
    setSelectedCard({ ...selectedCard, effects: newEffects });
  };

  const handleImageSelect = (file: File) => {
    if (!file) return;

    // Create object URL for cropping
    const objectUrl = URL.createObjectURL(file);
    setImageToCrop(objectUrl);
    setCropModalOpen(true);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setCropModalOpen(false);
    
    // Clean up object URL
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
      setImageToCrop(null);
    }

    // Upload cropped image
    setUploading(true);
    setUploadProgress('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('file', croppedImageBlob, 'cropped-image.jpg');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/upload-image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: formData
        }
      );

      if (response.ok) {
        const data = await response.json();
        updateField('image_asset', data.url);
        setUploadProgress('Image uploaded successfully! ✓');
        setTimeout(() => setUploadProgress(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('Failed to upload image:', errorData);
        alert(`Failed to upload image: ${errorData.error || 'Unknown error'}`);
        setUploadProgress('');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      setUploadProgress('');
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

  // Filter cards by active tab and search term
  const getFilteredCards = () => {
    let filtered = cards.filter(card => card.type === activeTab);
    
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.element.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredCards = getFilteredCards();

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Left Panel - Card List with Tabs */}
      <div className="w-96 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          {/* Main Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMainTab('cards')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                mainTab === 'cards'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
              }`}
            >
              Card Library
            </button>
            <button
              onClick={() => setMainTab('arenas')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                mainTab === 'arenas'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
              }`}
            >
              Arena Library
            </button>
          </div>
          
          {mainTab === 'cards' ? (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateNew}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
              >
                <Plus className="w-4 h-4" />
                Create New Card
              </button>

              {/* Tabs */}
              <div className="space-y-1">
                {CARD_TYPES.map(type => {
                  const typeCards = cards.filter(card => card.type === type);
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        activeTab === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                      }`}
                    >
                      <span className="text-sm">{type.replace(/_/g, ' ')}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        activeTab === type
                          ? 'bg-purple-700'
                          : 'bg-gray-700'
                      }`}>
                        {typeCards.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Arena Library - Create Form */}
              <div className="space-y-4">
                <button
                  onClick={() => setIsCreatingArena(!isCreatingArena)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {isCreatingArena ? 'Cancel' : 'Create New Arena'}
                </button>

                {isCreatingArena && (
                  <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Arena Name</label>
                      <input
                        type="text"
                        value={newArenaName}
                        onChange={(e) => setNewArenaName(e.target.value)}
                        placeholder="Enter arena name..."
                        className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Biom Card</label>
                      <select
                        value={selectedBiomId}
                        onChange={(e) => setSelectedBiomId(e.target.value)}
                        className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Select Biom...</option>
                        {cards.filter(c => c.type === 'Arena_Biom').map(card => (
                          <option key={card.id} value={card.id}>
                            {card.name} {card.trigger_dice_value ? `(🎲 ${card.trigger_dice_value})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Mutation Card</label>
                      <select
                        value={selectedMutationId}
                        onChange={(e) => setSelectedMutationId(e.target.value)}
                        className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Select Mutation...</option>
                        {cards.filter(c => c.type === 'Arena_Mutation').map(card => (
                          <option key={card.id} value={card.id}>
                            {card.name} {card.trigger_dice_value ? `(🎲 ${card.trigger_dice_value})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleCreateArena}
                      disabled={saving || !newArenaName || !selectedBiomId || !selectedMutationId}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Create Arena
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Card/Arena List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {mainTab === 'cards' ? (
            loading ? (
              <div className="text-gray-500 text-center py-8">Loading cards...</div>
            ) : filteredCards.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                {searchTerm ? 'No cards found' : `No ${activeTab.replace(/_/g, ' ')} cards yet`}
              </div>
            ) : (
              filteredCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => {
                    // Ensure effects is an array
                    const cardWithEffects = {
                      ...card,
                      effects: card.effects || []
                    };
                    setSelectedCard(cardWithEffects);
                    setIsCreating(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedCard?.id === card.id
                      ? 'bg-purple-900/30 border-purple-500'
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    {card.image_asset ? (
                      <img 
                        src={card.image_asset} 
                        alt={card.name}
                        className="w-16 h-16 object-cover rounded border-2 border-gray-600 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 rounded border-2 border-gray-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl opacity-50">
                          {card.type === 'Character_Base' ? '⚔️' : 
                           card.type === 'Subclass_Element' ? '✨' : 
                           card.type === 'Specialization_Loadout' ? '🎯' : 
                           card.type === 'Arena_Biom' ? '🌍' : '⚡'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white truncate">{card.name}</div>
                      <div className="text-sm text-gray-400 mt-1 flex items-center justify-between">
                        <span>{card.element}</span>
                        {(card.type === 'Arena_Biom' || card.type === 'Arena_Mutation') && card.trigger_dice_value && (
                          <span className="text-xs bg-purple-700 text-white px-2 py-0.5 rounded">
                            🎲 {card.trigger_dice_value}
                          </span>
                        )}
                      </div>
                      {(card.created_at || card.updated_at) && (
                        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                          {card.created_at && (
                            <div>Erstellt: {new Date(card.created_at).toLocaleString('de-DE', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</div>
                          )}
                          {card.updated_at && (
                            <div>Geändert: {new Date(card.updated_at).toLocaleString('de-DE', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )
          ) : (
            arenas.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No arenas yet. Create your first arena above!
              </div>
            ) : (
              arenas.map(arena => {
                const biomCard = cards.find(c => c.id === arena.biom_card_id);
                const mutationCard = cards.find(c => c.id === arena.mutation_card_id);
                return (
                  <div
                    key={arena.id}
                    onClick={() => setSelectedArena(arena)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedArena?.id === arena.id
                        ? 'bg-purple-900/30 border-purple-500'
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-white">{arena.name}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteArena(arena.id!);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>🏔️ Biom: {biomCard?.name || 'Unknown'}</div>
                      <div>⚡ Mutation: {mutationCard?.name || 'Unknown'}</div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* Right Panel - Edit Form & Preview */}
      <div className="flex-1 flex flex-col">
        {selectedArena && mainTab === 'arenas' ? (
          /* Arena Preview */
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-white">Arena Preview: {selectedArena.name}</h2>
                <button
                  onClick={() => setSelectedArena(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Combined Arena Card */}
                <div>
                  <h3 className="text-xl text-white mb-4">Combined Arena</h3>
                  <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30">
                    <div className="text-center mb-6">
                      <div className="text-3xl mb-2">🏟️</div>
                      <input
                        type="text"
                        value={selectedArena.name}
                        onChange={(e) => {
                          setSelectedArena({ ...selectedArena, name: e.target.value });
                        }}
                        onBlur={(e) => {
                          if (selectedArena.id && e.target.value !== arenas.find(a => a.id === selectedArena.id)?.name) {
                            handleUpdateArenaName(selectedArena.id, e.target.value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && selectedArena.id) {
                            e.currentTarget.blur();
                          }
                        }}
                        className="text-2xl text-white bg-purple-900/10 border-2 border-purple-500/40 hover:border-purple-500/60 focus:border-purple-500 focus:bg-purple-900/20 focus:outline-none text-center transition-colors px-4 py-2 rounded-lg"
                        placeholder="Arena Name"
                      />
                      <p className="text-sm text-gray-400 mt-2">Arena Configuration</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Biom Section */}
                      {(() => {
                        const biomCard = cards.find(c => c.id === selectedArena.biom_card_id);
                        return biomCard ? (
                          <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">🏔️</span>
                              <h5 className="text-lg text-blue-300">Biom: {biomCard.name} {biomCard.trigger_dice_value ? `(🎲 ${biomCard.trigger_dice_value})` : ''}</h5>
                            </div>
                            <div className="text-sm text-gray-300 mb-2">Element: {biomCard.element}</div>
                            <div className="space-y-2">
                              <p className="text-xs text-gray-400">Biom Effects:</p>
                              {(biomCard.effects || []).map((effect: string, idx: number) => (
                                <div key={idx} className="text-sm text-blue-200 bg-blue-900/20 rounded px-3 py-2">
                                  • {effect}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                            <p className="text-gray-500">Biom card not found</p>
                          </div>
                        );
                      })()}

                      {/* Mutation Section */}
                      {(() => {
                        const mutationCard = cards.find(c => c.id === selectedArena.mutation_card_id);
                        return mutationCard ? (
                          <div className="bg-gray-900/50 rounded-lg p-4 border border-pink-500/30">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">⚡</span>
                              <h5 className="text-lg text-pink-300">Mutation: {mutationCard.name} {mutationCard.trigger_dice_value ? `(🎲 ${mutationCard.trigger_dice_value})` : ''}</h5>
                            </div>
                            <div className="text-sm text-gray-300 mb-2">Element: {mutationCard.element}</div>
                            <div className="space-y-2">
                              <p className="text-xs text-gray-400">Mutation Effects:</p>
                              {(mutationCard.effects || []).map((effect: string, idx: number) => (
                                <div key={idx} className="text-sm text-pink-200 bg-pink-900/20 rounded px-3 py-2">
                                  • {effect}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                            <p className="text-gray-500">Mutation card not found</p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Individual Card Previews */}
                <div>
                  <h3 className="text-xl text-white mb-4">Individual Cards</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(() => {
                      const biomCard = cards.find(c => c.id === selectedArena.biom_card_id);
                      return biomCard ? (
                        <div>
                          <p className="text-sm text-gray-400 mb-3">🏔️ Biom Card</p>
                          <Card {...biomCard} preview={true} />
                        </div>
                      ) : null;
                    })()}
                    {(() => {
                      const mutationCard = cards.find(c => c.id === selectedArena.mutation_card_id);
                      return mutationCard ? (
                        <div>
                          <p className="text-sm text-gray-400 mb-3">⚡ Mutation Card</p>
                          <Card {...mutationCard} preview={true} />
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedCard ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-white">
                  {isCreating ? 'Create New Card' : 'Edit Card'}
                </h2>
                <div className="flex items-center gap-3">
                  {isCreating && (
                    <button
                      onClick={handleSave}
                      disabled={saving || !selectedCard?.name}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      Create
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCard(null);
                      setIsCreating(false);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-white mb-2">Card Name</label>
                    <input
                      type="text"
                      value={selectedCard.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter card name"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-white mb-2">Card Type</label>
                    <select
                      value={selectedCard.type}
                      onChange={(e) => updateField('type', e.target.value)}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    >
                      {CARD_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Element */}
                  <div>
                    <label className="block text-white mb-2">Element</label>
                    <select
                      value={selectedCard.element}
                      onChange={(e) => updateField('element', e.target.value)}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    >
                      {ELEMENTS.map(element => (
                        <option key={element} value={element}>
                          {element}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Trigger Dice Value (for Arena cards) */}
                  {(selectedCard.type === 'Arena_Biom' || selectedCard.type === 'Arena_Mutation') && (
                    <div>
                      <label className="block text-white mb-2">
                        🎲 Trigger Dice Value (2-12)
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="12"
                        value={selectedCard.trigger_dice_value || ''}
                        onChange={(e) => updateField('trigger_dice_value', parseInt(e.target.value) || undefined)}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                        placeholder="Enter dice value (2-12)"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Würfelzahl (2×W6), bei der diese Karte getriggert wird
                      </p>
                    </div>
                  )}

                  {/* Stats (for Character_Base and Subclass_Element) */}
                  {(selectedCard.type === 'Character_Base' || selectedCard.type === 'Subclass_Element') && (
                    <div>
                      <label className="block text-white mb-2">Stats</label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">HP</label>
                          <input
                            type="number"
                            value={selectedCard.stats_json.hp || ''}
                            onChange={(e) => updateStats('hp', parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Mana</label>
                          <input
                            type="number"
                            value={selectedCard.stats_json.mana || ''}
                            onChange={(e) => updateStats('mana', parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Attack</label>
                          <input
                            type="number"
                            value={selectedCard.stats_json.attack || ''}
                            onChange={(e) => updateStats('attack', parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Effects List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-white">
                        {selectedCard.type === 'Character_Base' ? 'Skills & Abilities' : 'Effects & Description'}
                      </label>
                      <button
                        onClick={addEffect}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition-colors text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        Add Effect
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(selectedCard.effects || []).map((effect, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={effect}
                            onChange={(e) => updateEffect(index, e.target.value)}
                            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                            placeholder={`Effect ${index + 1}`}
                          />
                          {(selectedCard.effects || []).length > 1 && (
                            <button
                              onClick={() => removeEffect(index)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-white mb-2">Card Image</label>
                    <div className="space-y-3">
                      {/* URL Input */}
                      <div>
                        <input
                          type="text"
                          value={selectedCard.image_asset}
                          onChange={(e) => updateField('image_asset', e.target.value)}
                          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                          placeholder="Enter image URL or upload file below..."
                        />
                      </div>
                      
                      {/* File Upload */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageSelect(file);
                              e.target.value = ''; // Reset input to allow re-selecting same file
                            }}
                            className="hidden"
                            disabled={uploading}
                          />
                          <label
                            htmlFor="image-upload"
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                              uploading
                                ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:border-purple-500'
                            }`}
                          >
                            <Upload className="w-4 h-4" />
                            {uploading ? 'Uploading...' : 'Upload from Computer'}
                          </label>
                        </div>
                      </div>
                      
                      {/* Upload Status */}
                      {uploadProgress && (
                        <div className="text-sm text-green-400 bg-green-900/20 px-3 py-2 rounded-lg">
                          {uploadProgress}
                        </div>
                      )}
                      
                      {/* Format Info */}
                      <p className="text-xs text-gray-500">
                        Supported formats: JPEG, PNG, WebP, GIF (max 5MB)
                      </p>
                    </div>
                  </div>

                  {/* Card Notes Button */}
                  <div>
                    <button
                      onClick={() => setNotesModalOpen(true)}
                      className="w-full bg-amber-600/80 hover:bg-amber-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <StickyNote className="w-5 h-5" />
                      Notizen für diese Karte {selectedCard.notes && selectedCard.notes.trim() ? '📝' : ''}
                    </button>
                    {selectedCard.notes && selectedCard.notes.trim() && (
                      <p className="text-xs text-amber-400 mt-2 text-center">
                        Diese Karte hat Notizen gespeichert
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving || !selectedCard.name}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Card'}
                    </button>
                    
                    {!isCreating && (
                      <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Preview */}
                <div>
                  <label className="block text-white mb-4">Live Preview</label>
                  <div className="flex justify-center">
                    <Card
                      id={selectedCard.id || 'preview'}
                      name={selectedCard.name}
                      type={selectedCard.type}
                      element={selectedCard.element}
                      stats_json={selectedCard.stats_json}
                      effects={selectedCard.effects}
                      image_asset={selectedCard.image_asset}
                      trigger_dice_value={selectedCard.trigger_dice_value}
                      preview={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">🃏</div>
              <p className="text-xl">Select a card to edit or create a new one</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Card Notes Modal */}
      {selectedCard && (
        <CardNotes
          isOpen={notesModalOpen}
          onClose={() => setNotesModalOpen(false)}
          cardName={selectedCard.name || 'Unbenannte Karte'}
          cardId={selectedCard.id}
          initialNotes={selectedCard.notes || ''}
          onSave={(notes) => {
            updateField('notes', notes);
            // Auto-save after closing modal
            if (selectedCard.id) {
              handleSave();
            }
          }}
          createdAt={selectedCard.id ? (cards.find(c => c.id === selectedCard.id)?.created_at) : undefined}
          updatedAt={selectedCard.id ? (cards.find(c => c.id === selectedCard.id)?.updated_at) : undefined}
        />
      )}

      {/* Image Crop Modal */}
      {imageToCrop && (
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={handleCropCancel}
          imageUrl={imageToCrop}
          onCropComplete={handleCropComplete}
          cardName={selectedCard?.name || 'Card'}
        />
      )}
    </div>
  );
}