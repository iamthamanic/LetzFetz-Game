import React, { useState, useEffect, useRef } from 'react';
import { ArenaDeck } from './ArenaDeck';
import { ArenaToolbar } from './ArenaToolbar';
import { ArenaTable } from './ArenaTable';
import { ArenaSelectionModal } from './ArenaSelectionModal';
import { PlayerHUD } from './PlayerHUD';
import { RoundCounter } from './RoundCounter';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PlacedCard {
  cardData: any;
  position: { x: number; y: number };
  zIndex: number;
  id: string;
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
  const [p1CustomFields, setP1CustomFields] = useState([
    { name: 'Stat 1', value: 0 },
    { name: 'Stat 2', value: 0 },
    { name: 'Stat 3', value: 0 }
  ]);
  const [p2CustomFields, setP2CustomFields] = useState([
    { name: 'Stat 1', value: 0 },
    { name: 'Stat 2', value: 0 },
    { name: 'Stat 3', value: 0 }
  ]);
  const [diceHistory, setDiceHistory] = useState<any[]>([]);
  const [draggedCard, setDraggedCard] = useState<any>(null);
  const [nextZIndex, setNextZIndex] = useState(100);
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
  const [activeArenaBiom, setActiveArenaBiom] = useState<any>(null);
  const [activeArenaMutation, setActiveArenaMutation] = useState<any>(null);
  const [arenaInfoExpanded, setArenaInfoExpanded] = useState(true);
  const [showArenaInfo, setShowArenaInfo] = useState(false);
  const [arenaInfoPosition, setArenaInfoPosition] = useState({ x: 100, y: 100 });
  const [draggedArenaPanel, setDraggedArenaPanel] = useState<{ offsetX: number; offsetY: number } | null>(null);
  const [roundCounter, setRoundCounter] = useState(1);
  const [roundNotes, setRoundNotes] = useState('');

  useEffect(() => {
    fetchCards();
    fetchArenas();
  }, []);

  useEffect(() => {
    saveSession();
  }, [p1Hp, p2Hp, p1Notes, p2Notes, placedCards, diceHistory]);

  useEffect(() => {
    if (draggedPlacedCard) return;
    if (cards.length > 0 && placedCards.length > 0) {
      setPlacedCards((current) => {
        const updated = current.map((pc) => {
          if (!pc.position || typeof pc.position.x !== 'number' || typeof pc.position.y !== 'number') {
            console.warn('PlacedCard missing valid position, skipping:', pc);
            return null;
          }
          const updatedCard = cards.find((c) => c.id === pc.cardData.id);
          return updatedCard ? { ...pc, cardData: updatedCard } : pc;
        }).filter(Boolean) as PlacedCard[];
        return JSON.stringify(updated) !== JSON.stringify(current) ? updated : current;
      });
    }
  }, [cards, draggedPlacedCard]);

  useEffect(() => {
    if (draggedPlacedCard || isPanning || draggedArenaPanel) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedPlacedCard, isPanning, panStart, panOffset, draggedArenaPanel, arenaInfoPosition]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (response.ok) {
        setCards(await response.json());
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
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (response.ok) {
        setArenas(await response.json());
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
        headers: { Authorization: `Bearer ${publicAnonKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          p1_hp: p1Hp,
          p2_hp: p2Hp,
          p1_notes: p1Notes,
          p2_notes: p2Notes,
          dice_history: diceHistory,
          board_state_json: {
            cards: placedCards.map((pc) => ({
              cardId: pc.cardData.id,
              position: pc.position,
              zIndex: pc.zIndex,
            })),
          },
        }),
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
    const x = (e.clientX - rect.left - panOffset.x) / zoomLevel - scaledWidth / 2;
    const y = (e.clientY - rect.top - panOffset.y) / zoomLevel - scaledHeight / 2;

    setPlacedCards((prev) => [...prev, { id: crypto.randomUUID(), cardData: draggedCard, position: { x, y }, zIndex: nextZIndex }]);
    setNextZIndex((z) => z + 1);
    setDraggedCard(null);
  };

  const handleRemoveCard = (index: number) => {
    setPlacedCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCardNotesChange = async (cardId: string, notes: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards/${cardId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${publicAnonKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        }
      );
      if (response.ok) {
        const updatedCard = await response.json();
        setCards((prev) => prev.map((c) => (c.id === cardId ? updatedCard : c)));
        setPlacedCards((prev) => prev.map((pc) => (pc.cardData.id === cardId ? { ...pc, cardData: updatedCard } : pc)));
      } else {
        console.error('Failed to update card notes:', await response.text());
      }
    } catch (error) {
      console.error('Error updating card notes:', error);
    }
  };

  const getDragOffset = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    return {
      offsetX: (e.clientX - rect.left) / zoomLevel,
      offsetY: (e.clientY - rect.top) / zoomLevel,
    };
  };

  const handlePlacedCardMouseDown = (e: React.MouseEvent, index: number) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const { offsetX, offsetY } = getDragOffset(e);

    setPlacedCards((prev) => {
      const updated = [...prev];
      const card = updated[index];
      if (!card) return prev;
      currentDragPos.current = { ...card.position };
      updated[index] = { ...card, zIndex: nextZIndex };
      return updated;
    });
    setDraggedPlacedCard({ index, offsetX, offsetY });
    setNextZIndex((z) => z + 1);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isPanning && tableRef.current) {
      if (dragAnimationRef.current) cancelAnimationFrame(dragAnimationRef.current);
      dragAnimationRef.current = requestAnimationFrame(() => {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPanOffset((po) => ({ x: po.x + dx, y: po.y + dy }));
        setPanStart({ x: e.clientX, y: e.clientY });
      });
      return;
    }

    if (draggedArenaPanel && tableRef.current) {
      if (dragAnimationRef.current) cancelAnimationFrame(dragAnimationRef.current);
      dragAnimationRef.current = requestAnimationFrame(() => {
        const rect = tableRef.current!.getBoundingClientRect();
        const x = (e.clientX - rect.left - panOffset.x) / zoomLevel - draggedArenaPanel.offsetX;
        const y = (e.clientY - rect.top - panOffset.y) / zoomLevel - draggedArenaPanel.offsetY;
        if (!isFinite(x) || !isFinite(y)) return;
        setArenaInfoPosition({ x, y });
      });
      return;
    }

    if (!draggedPlacedCard || !tableRef.current) return;
    if (dragAnimationRef.current) cancelAnimationFrame(dragAnimationRef.current);
    dragAnimationRef.current = requestAnimationFrame(() => {
      const rect = tableRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / zoomLevel - draggedPlacedCard.offsetX;
      const y = (e.clientY - rect.top - panOffset.y) / zoomLevel - draggedPlacedCard.offsetY;
      if (!isFinite(x) || !isFinite(y)) return;
      currentDragPos.current = { x, y };
      setPlacedCards((prev) => {
        const updated = [...prev];
        if (!updated[draggedPlacedCard.index]) return prev;
        updated[draggedPlacedCard.index] = { ...updated[draggedPlacedCard.index], position: { x, y } };
        return updated;
      });
    });
  };

  const handleMouseUp = () => {
    if (dragAnimationRef.current) {
      cancelAnimationFrame(dragAnimationRef.current);
      dragAnimationRef.current = null;
    }
    currentDragPos.current = null;
    setDraggedPlacedCard(null);
    setDraggedArenaPanel(null);
    setIsPanning(false);
  };

  const handleZoomChange = (newZoom: number, newPan: { x: number; y: number }) => {
    setZoomLevel(newZoom);
    setPanOffset(newPan);
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!tableRef.current) return;
    const rect = tableRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = -e.deltaY * 0.001;
    const newZoom = Math.min(Math.max(0.25, zoomLevel + delta), 3);
    if (newZoom !== zoomLevel) {
      const zoomRatio = newZoom / zoomLevel;
      setPanOffset({ x: mouseX - (mouseX - panOffset.x) * zoomRatio, y: mouseY - (mouseY - panOffset.y) * zoomRatio });
      setZoomLevel(newZoom);
    }
  };

  const handleTableMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && (e as any).spaceKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleArenaPanelMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const { offsetX, offsetY } = getDragOffset(e);
    setDraggedArenaPanel({ offsetX, offsetY });
  };

  const activateArena = (arena: any) => {
    const biomCard = cards.find((c) => c.id === arena.biom_card_id);
    const mutationCard = cards.find((c) => c.id === arena.mutation_card_id);
    const rollResult = { timestamp: new Date().toISOString(), arenaName: arena.name, biom: biomCard, mutation: mutationCard };
    setDiceHistory((prev) => [rollResult, ...prev]);
    setActiveArenaBiom(biomCard);
    setActiveArenaMutation(mutationCard);
    setShowArenaModal(false);
    setShowArenaInfo(true);
    const biomEffects = biomCard?.effects?.join('\n') || biomCard?.effects_text || 'No effects';
    const mutationEffects = mutationCard?.effects?.join('\n') || mutationCard?.effects_text || 'No effects';
    alert(`🏔️ Arena Activated: ${arena.name}\n\n${biomCard ? `Biom: ${biomCard.name}\n${biomEffects}` : 'No Biom available'}\n\n${mutationCard ? `Mutation: ${mutationCard.name}\n${mutationEffects}` : 'No Mutation available'}`);
  };

  return (
    <div className="h-screen bg-gray-950 flex relative overflow-hidden">
      <ArenaDeck
        cards={cards}
        placedCards={placedCards}
        loading={loading}
        sidebarOpen={sidebarOpen}
        searchTerm={searchTerm}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSearchChange={setSearchTerm}
        onDragStart={handleDragStart}
      />

      <div className="flex-1 flex flex-col relative">
        <ArenaToolbar
          sidebarOpen={sidebarOpen}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          tableRef={tableRef}
          onZoomChange={handleZoomChange}
          onResetView={handleResetView}
          onOpenArenaModal={() => setShowArenaModal(true)}
          onDiceRoll={(result) => setDiceHistory((prev) => [result, ...prev])}
        />

        <ArenaTable
          tableRef={tableRef}
          placedCards={placedCards}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          draggedPlacedCard={draggedPlacedCard}
          showArenaInfo={showArenaInfo}
          activeArenaBiom={activeArenaBiom}
          activeArenaMutation={activeArenaMutation}
          arenaInfoExpanded={arenaInfoExpanded}
          arenaInfoPosition={arenaInfoPosition}
          diceHistory={diceHistory}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onWheel={handleWheel}
          onMouseDown={handleTableMouseDown}
          onPlacedCardMouseDown={handlePlacedCardMouseDown}
          onRemoveCard={handleRemoveCard}
          onCardNotesChange={handleCardNotesChange}
          onArenaPanelMouseDown={handleArenaPanelMouseDown}
          onToggleArenaInfo={() => setArenaInfoExpanded(!arenaInfoExpanded)}
          onCloseArenaInfo={() => setShowArenaInfo(false)}
        />

        <PlayerHUD
          playerName="Player 1"
          hp={p1Hp}
          onHpChange={setP1Hp}
          notes={p1Notes}
          onNotesChange={setP1Notes}
          position="bottom-left"
          customFields={p1CustomFields}
          onCustomFieldChange={(index, value) => {
            const updated = [...p1CustomFields];
            updated[index] = { ...updated[index], value };
            setP1CustomFields(updated);
          }}
          onCustomFieldNameChange={(index, name) => {
            const updated = [...p1CustomFields];
            updated[index] = { ...updated[index], name };
            setP1CustomFields(updated);
          }}
        />
        <PlayerHUD
          playerName="Player 2"
          hp={p2Hp}
          onHpChange={setP2Hp}
          notes={p2Notes}
          onNotesChange={setP2Notes}
          position="bottom-right"
          customFields={p2CustomFields}
          onCustomFieldChange={(index, value) => {
            const updated = [...p2CustomFields];
            updated[index] = { ...updated[index], value };
            setP2CustomFields(updated);
          }}
          onCustomFieldNameChange={(index, name) => {
            const updated = [...p2CustomFields];
            updated[index] = { ...updated[index], name };
            setP2CustomFields(updated);
          }}
        />

        <RoundCounter round={roundCounter} onRoundChange={setRoundCounter} notes={roundNotes} onNotesChange={setRoundNotes} />
      </div>

      <ArenaSelectionModal
        isOpen={showArenaModal}
        arenas={arenas}
        cards={cards}
        searchTerm={arenaSearchTerm}
        onSearchChange={setArenaSearchTerm}
        onSelect={activateArena}
        onClose={() => setShowArenaModal(false)}
      />
    </div>
  );
}
