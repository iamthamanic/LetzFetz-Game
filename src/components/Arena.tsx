import React, { useState, useEffect, useRef } from 'react';
import { Dices, Menu, X, Search, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Card } from './Card';
import { PlayerHUD } from './PlayerHUD';
import { DiceRoller } from './DiceRoller';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PlacedCard {
  cardData: any;
  position: { x: number; y: number };
  zIndex: number;
  id: string; // Unique identifier for placed cards
}

export function Arena() {
  const [cards, setCards] = useState<any[]>([]);
  const [placedCards, setPlacedCards] = useState<PlacedCard[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [p1Hp, setP1Hp] = useState(20);
  const [p2Hp, setP2Hp] = useState(20);
  const [p1Notes, setP1Notes] = useState('');
  const [p2Notes, setP2Notes] = useState('');
  const [diceHistory, setDiceHistory] = useState<any[]>([]);
  const [draggedCard, setDraggedCard] = useState<any>(null);
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null);
  const [arenas, setArenas] = useState<any[]>([]);
  const [showArenaModal, setShowArenaModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [arenaSearchTerm, setArenaSearchTerm] = useState('');
  const [draggedPlacedCard, setDraggedPlacedCard] = useState<{ index: number; offsetX: number; offsetY: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const dragAnimationRef = useRef<number | null>(null);
  const currentDragPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    fetchCards();
    fetchArenas();
  }, []);

  useEffect(() => {
    saveSession();
  }, [p1Hp, p2Hp, p1Notes, p2Notes, placedCards, diceHistory]);

  // Update placed cards when cards data changes (e.g., edited in CardForge)
  useEffect(() => {
    if (cards.length > 0 && placedCards.length > 0) {
      const updatedPlacedCards = placedCards.map(placedCard => {
        // Find the updated card data from the cards array
        const updatedCardData = cards.find(card => card.id === placedCard.cardData.id);
        if (updatedCardData) {
          return {
            ...placedCard,
            cardData: updatedCardData
          };
        }
        return placedCard;
      });
      setPlacedCards(updatedPlacedCards);
    }
  }, [cards]);

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
        setCards(data);
      } else {
        console.error('Failed to fetch cards:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const saveSession = async () => {
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c701770f/session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          p1_hp: p1Hp,
          p2_hp: p2Hp,
          p1_notes: p1Notes,
          p2_notes: p2Notes,
          dice_history: diceHistory,
          board_state_json: {
            cards: placedCards.map(pc => ({
              cardId: pc.cardData.id,
              position: pc.position,
              zIndex: pc.zIndex
            }))
          }
        })
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, card: any) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedCard || !tableRef.current) return;
    
    const rect = tableRef.current.getBoundingClientRect();
    const cardScale = 0.6;
    const scaledWidth = 256 * cardScale;
    const scaledHeight = 384 * cardScale;
    
    // Adjust for zoom level and pan offset
    const x = (e.clientX - rect.left - panOffset.x) / zoomLevel - (scaledWidth / 2);
    const y = (e.clientY - rect.top - panOffset.y) / zoomLevel - (scaledHeight / 2);
    
    const newPlacedCard: PlacedCard = {
      id: crypto.randomUUID(),
      cardData: draggedCard,
      position: { x, y },
      zIndex: nextZIndex
    };
    
    setPlacedCards([...placedCards, newPlacedCard]);
    setNextZIndex(nextZIndex + 1);
    setDraggedCard(null);
  };

  const handleCardClick = (index: number) => {
    // Bring clicked card to front
    const updatedCards = [...placedCards];
    updatedCards[index] = {
      ...updatedCards[index],
      zIndex: nextZIndex
    };
    setPlacedCards(updatedCards);
    setNextZIndex(nextZIndex + 1);
  };

  const handleRemoveCard = (index: number) => {
    setPlacedCards(placedCards.filter((_, i) => i !== index));
  };

  const handleCardNotesChange = async (cardId: string, notes: string) => {
    try {
      // Update notes in backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      });

      if (response.ok) {
        const updatedCard = await response.json();
        
        // Update cards list
        setCards(cards.map(card => card.id === cardId ? updatedCard : card));
        
        // Update placed cards
        setPlacedCards(placedCards.map(placedCard => 
          placedCard.cardData.id === cardId 
            ? { ...placedCard, cardData: updatedCard }
            : placedCard
        ));
      } else {
        console.error('Failed to update card notes:', await response.text());
      }
    } catch (error) {
      console.error('Error updating card notes:', error);
    }
  };

  const handlePlacedCardMouseDown = (e: React.MouseEvent, index: number) => {
    if (e.button !== 0) return; // Only left mouse button
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Adjust for zoom level and pan offset
    const offsetX = (e.clientX - rect.left) / zoomLevel;
    const offsetY = (e.clientY - rect.top) / zoomLevel;
    
    setDraggedPlacedCard({ index, offsetX, offsetY });
    currentDragPos.current = { ...placedCards[index].position };
    
    // Bring card to front immediately
    const updatedCards = [...placedCards];
    updatedCards[index] = {
      ...updatedCards[index],
      zIndex: nextZIndex
    };
    setPlacedCards(updatedCards);
    setNextZIndex(nextZIndex + 1);
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Handle panning
    if (isPanning && tableRef.current) {
      if (dragAnimationRef.current) {
        cancelAnimationFrame(dragAnimationRef.current);
      }
      dragAnimationRef.current = requestAnimationFrame(() => {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPanOffset({
          x: panOffset.x + dx,
          y: panOffset.y + dy
        });
        setPanStart({ x: e.clientX, y: e.clientY });
      });
      return;
    }

    // Handle card dragging
    if (!draggedPlacedCard || !tableRef.current) return;
    
    if (dragAnimationRef.current) {
      cancelAnimationFrame(dragAnimationRef.current);
    }
    
    dragAnimationRef.current = requestAnimationFrame(() => {
      const rect = tableRef.current!.getBoundingClientRect();
      
      // Adjust for zoom level and pan offset
      const x = (e.clientX - rect.left - panOffset.x) / zoomLevel - draggedPlacedCard.offsetX;
      const y = (e.clientY - rect.top - panOffset.y) / zoomLevel - draggedPlacedCard.offsetY;
      
      currentDragPos.current = { x, y };
      
      // Update immediately without batching
      setPlacedCards(prev => {
        const updated = [...prev];
        updated[draggedPlacedCard.index] = {
          ...updated[draggedPlacedCard.index],
          position: { x, y }
        };
        return updated;
      });
    });
  };

  const handleMouseUp = () => {
    if (dragAnimationRef.current) {
      cancelAnimationFrame(dragAnimationRef.current);
      dragAnimationRef.current = null;
    }
    
    // Final position update
    if (draggedPlacedCard && currentDragPos.current) {
      setPlacedCards(prev => {
        const updated = [...prev];
        updated[draggedPlacedCard.index] = {
          ...updated[draggedPlacedCard.index],
          position: currentDragPos.current!
        };
        return updated;
      });
    }
    
    currentDragPos.current = null;
    setDraggedPlacedCard(null);
    setIsPanning(false);
  };

  useEffect(() => {
    if (draggedPlacedCard || isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedPlacedCard, placedCards, isPanning, panStart, panOffset]);

  const handleArenaGenerator = async () => {
    setShowArenaModal(true);
  };

  const activateArena = (arena: any) => {
    const biomCard = cards.find(c => c.id === arena.biom_card_id);
    const mutationCard = cards.find(c => c.id === arena.mutation_card_id);
    
    const rollResult = {
      timestamp: new Date().toISOString(),
      arenaName: arena.name,
      biom: biomCard,
      mutation: mutationCard
    };
    
    setDiceHistory([rollResult, ...diceHistory]);
    setShowArenaModal(false);
    
    // Show notification
    const biomEffects = biomCard?.effects?.join('\n') || biomCard?.effects_text || 'No effects';
    const mutationEffects = mutationCard?.effects?.join('\n') || mutationCard?.effects_text || 'No effects';
    const message = `🏔️ Arena Activated: ${arena.name}\n\n${biomCard ? `Biom: ${biomCard.name}\n${biomEffects}` : 'No Biom available'}\n\n${mutationCard ? `Mutation: ${mutationCard.name}\n${mutationEffects}` : 'No Mutation available'}`;
    
    alert(message);
  };

  return (
    <div className="h-screen bg-gray-950 flex relative overflow-hidden">
      {/* Sidebar - Deck */}
      <div 
        className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
          sidebarOpen ? 'w-80' : 'w-0'
        } flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl text-white">Card Deck</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-gray-500 text-center py-8">Loading cards...</div>
          ) : cards.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No cards available. Create cards in Card Forge first!
            </div>
          ) : (
            (() => {
              const filteredCards = cards.filter(card => {
                const search = searchTerm.toLowerCase();
                return (
                  card.name.toLowerCase().includes(search) ||
                  card.type.toLowerCase().includes(search) ||
                  card.element.toLowerCase().includes(search) ||
                  (card.effects && card.effects.some((effect: string) => effect.toLowerCase().includes(search))) ||
                  (card.effects_text && card.effects_text.toLowerCase().includes(search))
                );
              });
              
              if (filteredCards.length === 0) {
                return (
                  <div className="text-gray-500 text-center py-8">
                    No cards found matching "{searchTerm}"
                  </div>
                );
              }
              
              return filteredCards.map(card => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card)}
                  className="cursor-grab active:cursor-grabbing transform hover:scale-105 transition-transform"
                >
                  <div className="scale-75 origin-top">
                    <Card {...card} preview={false} />
                  </div>
                </div>
              ));
            })()
          )}
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Toolbar */}
        <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
              <button
                onClick={() => {
                  const newZoom = Math.max(0.25, zoomLevel - 0.25);
                  const centerX = tableRef.current ? tableRef.current.clientWidth / 2 : 0;
                  const centerY = tableRef.current ? tableRef.current.clientHeight / 2 : 0;
                  const zoomRatio = newZoom / zoomLevel;
                  setPanOffset({
                    x: centerX - (centerX - panOffset.x) * zoomRatio,
                    y: centerY - (centerY - panOffset.y) * zoomRatio
                  });
                  setZoomLevel(newZoom);
                }}
                className="text-gray-400 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white text-sm min-w-[3.5rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => {
                  const newZoom = Math.min(3, zoomLevel + 0.25);
                  const centerX = tableRef.current ? tableRef.current.clientWidth / 2 : 0;
                  const centerY = tableRef.current ? tableRef.current.clientHeight / 2 : 0;
                  const zoomRatio = newZoom / zoomLevel;
                  setPanOffset({
                    x: centerX - (centerX - panOffset.x) * zoomRatio,
                    y: centerY - (centerY - panOffset.y) * zoomRatio
                  });
                  setZoomLevel(newZoom);
                }}
                className="text-gray-400 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="text-gray-400 hover:text-white transition-colors ml-2"
                title="Reset Zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <DiceRoller onRoll={(result) => setDiceHistory([result, ...diceHistory])} />
            
            <button
              onClick={handleArenaGenerator}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Dices className="w-5 h-5" />
              New Arena Round
            </button>
          </div>
        </div>

        {/* Tabletop Canvas */}
        <div
          ref={tableRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onWheel={(e) => {
            e.preventDefault();
            
            if (!tableRef.current) return;
            
            const rect = tableRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Calculate zoom delta (smooth zooming)
            const delta = -e.deltaY * 0.001;
            const newZoom = Math.min(Math.max(0.25, zoomLevel + delta), 3);
            
            if (newZoom !== zoomLevel) {
              // Zoom towards mouse position
              const zoomRatio = newZoom / zoomLevel;
              
              setPanOffset({
                x: mouseX - (mouseX - panOffset.x) * zoomRatio,
                y: mouseY - (mouseY - panOffset.y) * zoomRatio
              });
              
              setZoomLevel(newZoom);
            }
          }}
          onMouseDown={(e) => {
            // Pan with space + click or middle mouse button
            if (e.button === 1 || (e.button === 0 && e.spaceKey)) {
              e.preventDefault();
              setIsPanning(true);
              setPanStart({ x: e.clientX, y: e.clientY });
            }
          }}
          className="flex-1 relative bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1), transparent 50%)',
          }}
        >
          {/* Zoomable Inner Canvas */}
          <div
            className="absolute"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: '0 0',
              width: '10000px',
              height: '10000px',
              transition: 'none',
              willChange: 'transform'
            }}
          >
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />

            {/* Drop Zone Hint */}
            {placedCards.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎴</div>
                  <p className="text-xl">Drag cards from the deck to place them on the table</p>
                  <p className="text-sm mt-2">Drag cards to move them • Right-click to remove</p>
                </div>
              </div>
            )}

            {/* Placed Cards */}
            {placedCards.map((placedCard, index) => (
              <div
                key={placedCard.id}
                className="absolute cursor-move select-none touch-none"
                style={{
                  left: `${placedCard.position.x}px`,
                  top: `${placedCard.position.y}px`,
                  zIndex: placedCard.zIndex,
                  willChange: draggedPlacedCard?.index === index ? 'transform' : 'auto',
                  transition: draggedPlacedCard?.index === index ? 'none' : 'transform 0.1s ease-out'
                }}
                onMouseDown={(e) => handlePlacedCardMouseDown(e, index)}
              >
                <Card 
                  {...placedCard.cardData} 
                  preview={false} 
                  scale={0.6} 
                  onRemove={() => handleRemoveCard(index)}
                  onNotesChange={(notes) => handleCardNotesChange(placedCard.cardData.id, notes)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Player HUDs */}
        <PlayerHUD
          playerName="Player 1"
          hp={p1Hp}
          onHpChange={setP1Hp}
          notes={p1Notes}
          onNotesChange={setP1Notes}
          position="bottom-left"
        />
        <PlayerHUD
          playerName="Player 2"
          hp={p2Hp}
          onHpChange={setP2Hp}
          notes={p2Notes}
          onNotesChange={setP2Notes}
          position="bottom-right"
        />
      </div>

      {/* Arena Selection Modal */}
      {showArenaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-white">Select Arena</h2>
                <button
                  onClick={() => setShowArenaModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search arenas..."
                  value={arenaSearchTerm}
                  onChange={(e) => setArenaSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {arenas.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No arenas available. Create arenas in the Edit view under Arena Library.
                </div>
              ) : (
                (() => {
                  const filteredArenas = arenas.filter(arena => {
                    const search = arenaSearchTerm.toLowerCase();
                    const biomCard = cards.find(c => c.id === arena.biom_card_id);
                    const mutationCard = cards.find(c => c.id === arena.mutation_card_id);
                    return (
                      arena.name.toLowerCase().includes(search) ||
                      (biomCard && biomCard.name.toLowerCase().includes(search)) ||
                      (mutationCard && mutationCard.name.toLowerCase().includes(search)) ||
                      (biomCard && biomCard.effects && biomCard.effects.some((effect: string) => effect.toLowerCase().includes(search))) ||
                      (mutationCard && mutationCard.effects && mutationCard.effects.some((effect: string) => effect.toLowerCase().includes(search)))
                    );
                  });
                  
                  if (filteredArenas.length === 0) {
                    return (
                      <div className="text-center text-gray-500 py-8">
                        No arenas found matching "{arenaSearchTerm}"
                      </div>
                    );
                  }
                  
                  return (
                    <div className="grid gap-4">
                      {filteredArenas.map(arena => {
                        const biomCard = cards.find(c => c.id === arena.biom_card_id);
                        const mutationCard = cards.find(c => c.id === arena.mutation_card_id);
                        return (
                          <button
                            key={arena.id}
                            onClick={() => activateArena(arena)}
                            className="text-left p-4 rounded-lg border bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-purple-500 transition-colors"
                          >
                            <h3 className="text-white text-lg mb-3">{arena.name}</h3>
                            <div className="space-y-2">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">🏔️</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-xs font-semibold text-purple-400 bg-purple-900/50 px-2 py-1 rounded">BIOM</span>
                                    {biomCard?.trigger_dice_value && (
                                      <span className="text-xs text-white bg-purple-600 px-2 py-1 rounded flex items-center gap-1">
                                        🎲 {biomCard.trigger_dice_value}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-purple-300">
                                    {biomCard?.name || 'Unknown Biom'}
                                  </div>
                                  {biomCard && (
                                    <div className="text-xs text-gray-400 mt-1">
                                      {biomCard.effects?.join(', ') || biomCard.effects_text || 'No effects'}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">⚡</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-xs font-semibold text-pink-400 bg-pink-900/50 px-2 py-1 rounded">MUTATION</span>
                                    {mutationCard?.trigger_dice_value && (
                                      <span className="text-xs text-white bg-pink-600 px-2 py-1 rounded flex items-center gap-1">
                                        🎲 {mutationCard.trigger_dice_value}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-pink-300">
                                    {mutationCard?.name || 'Unknown Mutation'}
                                  </div>
                                  {mutationCard && (
                                    <div className="text-xs text-gray-400 mt-1">
                                      {mutationCard.effects?.join(', ') || mutationCard.effects_text || 'No effects'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
