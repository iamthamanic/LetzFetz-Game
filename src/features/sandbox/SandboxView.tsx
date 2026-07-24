/**
 * Sandbox feature entry — local-first free table with one autosaved session.
 * Location: src/features/sandbox/SandboxView.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { ArenaDeck } from './ArenaDeck';
import { ArenaToolbar } from './ArenaToolbar';
import { ArenaTable } from './ArenaTable';
import { ArenaSelectionModal } from './ArenaSelectionModal';
import { PlayerHUD } from './PlayerHUD';
import { RoundCounter } from './RoundCounter';
import { loadSandboxContent } from './data/loadSandboxContent';
import {
  clearSandboxSession,
  loadSandboxSession,
  saveSandboxSession,
} from './storage/sandboxSessionStorage';
import { saveCardOverlay } from '../../services/storage/cardOverlays';
import {
  createFreshSandboxSession,
  type SandboxArena,
  type SandboxCard,
  type SandboxContent,
  type SandboxCustomField,
  type SandboxDiceRoll,
  type SandboxPlacedCard,
  type SandboxSession,
  type SandboxStorageStatus,
} from './model/sandboxTypes';
import type { DiceRollResult } from './DiceRoller';

function applySession(session: SandboxSession) {
  return {
    placedCards: session.placedCards,
    nextZIndex: session.nextZIndex,
    p1Hp: session.p1Hp,
    p2Hp: session.p2Hp,
    p1Notes: session.p1Notes,
    p2Notes: session.p2Notes,
    p1CustomFields: session.p1CustomFields,
    p2CustomFields: session.p2CustomFields,
    diceHistory: session.diceHistory,
    arenaId: session.arenaId,
    arenaVariantIndex: session.arenaVariantIndex,
    roundCounter: session.roundCounter,
    roundNotes: session.roundNotes,
    zoomLevel: session.zoomLevel,
    panOffset: session.panOffset,
    arenaInfoPosition: session.arenaInfoPosition,
    sidebarOpen: session.sidebarOpen,
    arenaInfoExpanded: session.arenaInfoExpanded,
  };
}

export function SandboxView() {
  const [content, setContent] = useState<SandboxContent>({ cards: [], arenas: [] });
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [storageStatus, setStorageStatus] = useState<SandboxStorageStatus>('idle');
  const skipAutosaveRef = useRef(true);
  const resetGenerationRef = useRef(0);

  const [placedCards, setPlacedCards] = useState<SandboxPlacedCard[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [arenaSearchTerm, setArenaSearchTerm] = useState('');
  const [showArenaModal, setShowArenaModal] = useState(false);
  const [showArenaInfo, setShowArenaInfo] = useState(false);

  const [p1Hp, setP1Hp] = useState(20);
  const [p2Hp, setP2Hp] = useState(20);
  const [p1Notes, setP1Notes] = useState('');
  const [p2Notes, setP2Notes] = useState('');
  const [p1CustomFields, setP1CustomFields] = useState<SandboxCustomField[]>(
    createFreshSandboxSession().p1CustomFields,
  );
  const [p2CustomFields, setP2CustomFields] = useState<SandboxCustomField[]>(
    createFreshSandboxSession().p2CustomFields,
  );
  const [diceHistory, setDiceHistory] = useState<SandboxDiceRoll[]>([]);
  const [arenaId, setArenaId] = useState<string | null>(null);
  const [arenaVariantIndex, setArenaVariantIndex] = useState<0 | 1 | 2 | null>(null);
  const [roundCounter, setRoundCounter] = useState(1);
  const [roundNotes, setRoundNotes] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [arenaInfoPosition, setArenaInfoPosition] = useState({ x: 100, y: 100 });
  const [arenaInfoExpanded, setArenaInfoExpanded] = useState(true);

  const [draggedCard, setDraggedCard] = useState<SandboxCard | null>(null);
  const [draggedPlacedCard, setDraggedPlacedCard] = useState<{
    index: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedArenaPanel, setDraggedArenaPanel] = useState<{
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const dragAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    const loaded = loadSandboxContent();
    setContent(loaded);
    const { session } = loadSandboxSession();
    const next = applySession(session);
    setPlacedCards(next.placedCards);
    setNextZIndex(next.nextZIndex);
    setP1Hp(next.p1Hp);
    setP2Hp(next.p2Hp);
    setP1Notes(next.p1Notes);
    setP2Notes(next.p2Notes);
    setP1CustomFields(next.p1CustomFields);
    setP2CustomFields(next.p2CustomFields);
    setDiceHistory(next.diceHistory);
    setArenaId(next.arenaId);
    setArenaVariantIndex(next.arenaVariantIndex);
    setRoundCounter(next.roundCounter);
    setRoundNotes(next.roundNotes);
    setZoomLevel(next.zoomLevel);
    setPanOffset(next.panOffset);
    setArenaInfoPosition(next.arenaInfoPosition);
    setSidebarOpen(next.sidebarOpen);
    setArenaInfoExpanded(next.arenaInfoExpanded);
    setShowArenaInfo(Boolean(next.arenaId));
    setLoading(false);
    setHydrated(true);
    skipAutosaveRef.current = true;
  }, []);

  const buildSession = (): SandboxSession => ({
    version: 1,
    placedCards,
    nextZIndex,
    p1Hp,
    p2Hp,
    p1Notes,
    p2Notes,
    p1CustomFields,
    p2CustomFields,
    diceHistory,
    arenaId,
    arenaVariantIndex,
    roundCounter,
    roundNotes,
    zoomLevel,
    panOffset,
    arenaInfoPosition,
    sidebarOpen,
    arenaInfoExpanded,
  });

  useEffect(() => {
    if (!hydrated) return;
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    const generation = resetGenerationRef.current;
    setStorageStatus('saving');
    const timer = window.setTimeout(() => {
      if (generation !== resetGenerationRef.current) return;
      const result = saveSandboxSession(buildSession());
      setStorageStatus(result.ok ? 'saved' : 'error');
    }, 350);
    return () => window.clearTimeout(timer);
  }, [
    hydrated,
    placedCards,
    nextZIndex,
    p1Hp,
    p2Hp,
    p1Notes,
    p2Notes,
    p1CustomFields,
    p2CustomFields,
    diceHistory,
    arenaId,
    arenaVariantIndex,
    roundCounter,
    roundNotes,
    zoomLevel,
    panOffset,
    arenaInfoPosition,
    sidebarOpen,
    arenaInfoExpanded,
  ]);

  useEffect(() => {
    if (!draggedPlacedCard && !isPanning && !draggedArenaPanel) return;
    const onMove = (e: MouseEvent) => {
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
          const x =
            (e.clientX - rect.left - panOffset.x) / zoomLevel - draggedArenaPanel.offsetX;
          const y =
            (e.clientY - rect.top - panOffset.y) / zoomLevel - draggedArenaPanel.offsetY;
          if (!Number.isFinite(x) || !Number.isFinite(y)) return;
          setArenaInfoPosition({ x, y });
        });
        return;
      }

      if (!draggedPlacedCard || !tableRef.current) return;
      if (dragAnimationRef.current) cancelAnimationFrame(dragAnimationRef.current);
      dragAnimationRef.current = requestAnimationFrame(() => {
        const rect = tableRef.current!.getBoundingClientRect();
        const x =
          (e.clientX - rect.left - panOffset.x) / zoomLevel - draggedPlacedCard.offsetX;
        const y =
          (e.clientY - rect.top - panOffset.y) / zoomLevel - draggedPlacedCard.offsetY;
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        setPlacedCards((prev) => {
          const updated = [...prev];
          const current = updated[draggedPlacedCard.index];
          if (!current) return prev;
          updated[draggedPlacedCard.index] = {
            ...current,
            position: { x, y },
          };
          return updated;
        });
      });
    };

    const onUp = () => {
      if (dragAnimationRef.current) {
        cancelAnimationFrame(dragAnimationRef.current);
        dragAnimationRef.current = null;
      }
      setDraggedPlacedCard(null);
      setDraggedArenaPanel(null);
      setIsPanning(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [
    draggedPlacedCard,
    isPanning,
    panStart,
    panOffset,
    draggedArenaPanel,
    zoomLevel,
  ]);

  const cardById = new Map(content.cards.map((c) => [c.id, c]));
  const placedViews = placedCards
    .map((record) => {
      const card = cardById.get(record.cardId);
      if (!card) return null;
      return { record, card };
    })
    .filter((v): v is { record: SandboxPlacedCard; card: SandboxCard } => v !== null);

  const activeArena =
    arenaId === null ? null : (content.arenas.find((a) => a.id === arenaId) ?? null);
  const arenaVariantText =
    activeArena &&
    activeArena.d6Variants &&
    arenaVariantIndex !== null
      ? activeArena.d6Variants[arenaVariantIndex]
      : null;

  const handleDragStart = (e: React.DragEvent, card: SandboxCard) => {
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
    const x =
      (e.clientX - rect.left - panOffset.x) / zoomLevel - scaledWidth / 2;
    const y =
      (e.clientY - rect.top - panOffset.y) / zoomLevel - scaledHeight / 2;

    setPlacedCards((prev) => [
      ...prev,
      {
        instanceId: crypto.randomUUID(),
        cardId: draggedCard.id,
        position: { x, y },
        zIndex: nextZIndex,
      },
    ]);
    setNextZIndex((z) => z + 1);
    setDraggedCard(null);
  };

  const handleRemoveCard = (index: number) => {
    setPlacedCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCardNotesChange = (cardId: string, notes: string) => {
    saveCardOverlay(cardId, { notes });
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === cardId ? { ...c, notes } : c)),
    }));
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
      updated[index] = { ...card, zIndex: nextZIndex };
      return updated;
    });
    setDraggedPlacedCard({ index, offsetX, offsetY });
    setNextZIndex((z) => z + 1);
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
      setPanOffset({
        x: mouseX - (mouseX - panOffset.x) * zoomRatio,
        y: mouseY - (mouseY - panOffset.y) * zoomRatio,
      });
      setZoomLevel(newZoom);
    }
  };

  const handleTableMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
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

  const activateArena = (arena: SandboxArena) => {
    let variant: 0 | 1 | 2 | null = null;
    if (arena.d6Variants) {
      const roll = (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
      variant = roll <= 2 ? 0 : roll <= 4 ? 1 : 2;
    }
    setArenaId(arena.id);
    setArenaVariantIndex(variant);
    setShowArenaModal(false);
    setShowArenaInfo(true);
  };

  const handleDiceRoll = (result: DiceRollResult) => {
    setDiceHistory((prev) => [
      {
        id: crypto.randomUUID(),
        value: result.value,
        timestamp: result.timestamp,
      },
      ...prev,
    ]);
  };

  const handleResetSession = () => {
    resetGenerationRef.current += 1;
    clearSandboxSession();
    const fresh = createFreshSandboxSession();
    const next = applySession(fresh);
    setPlacedCards(next.placedCards);
    setNextZIndex(next.nextZIndex);
    setP1Hp(next.p1Hp);
    setP2Hp(next.p2Hp);
    setP1Notes(next.p1Notes);
    setP2Notes(next.p2Notes);
    setP1CustomFields(next.p1CustomFields);
    setP2CustomFields(next.p2CustomFields);
    setDiceHistory(next.diceHistory);
    setArenaId(next.arenaId);
    setArenaVariantIndex(next.arenaVariantIndex);
    setRoundCounter(next.roundCounter);
    setRoundNotes(next.roundNotes);
    setZoomLevel(next.zoomLevel);
    setPanOffset(next.panOffset);
    setArenaInfoPosition(next.arenaInfoPosition);
    setSidebarOpen(next.sidebarOpen);
    setArenaInfoExpanded(next.arenaInfoExpanded);
    setShowArenaInfo(false);
    setStorageStatus('saved');
    skipAutosaveRef.current = true;
  };

  const updateCustomField = (
    which: 'p1' | 'p2',
    index: number,
    patch: Partial<SandboxCustomField>,
  ) => {
    const setter = which === 'p1' ? setP1CustomFields : setP2CustomFields;
    setter((prev) => {
      const updated = [...prev];
      const current = updated[index];
      if (!current) return prev;
      updated[index] = { ...current, ...patch };
      return updated;
    });
  };

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden bg-stone-950" data-testid="sandbox-view">
      <ArenaDeck
        cards={content.cards}
        loading={loading}
        sidebarOpen={sidebarOpen}
        searchTerm={searchTerm}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSearchChange={setSearchTerm}
        onDragStart={handleDragStart}
      />

      <div className="relative flex min-h-0 flex-1 flex-col">
        <ArenaToolbar
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          tableRef={tableRef}
          storageStatus={storageStatus}
          onZoomChange={(zoom, pan) => {
            setZoomLevel(zoom);
            setPanOffset(pan);
          }}
          onResetView={() => {
            setZoomLevel(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          onOpenArenaModal={() => setShowArenaModal(true)}
          onDiceRoll={handleDiceRoll}
          onResetSession={handleResetSession}
        />

        <ArenaTable
          tableRef={tableRef}
          placedCards={placedViews}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          draggedPlacedCard={draggedPlacedCard}
          showArenaInfo={showArenaInfo}
          activeArena={activeArena}
          arenaVariantText={arenaVariantText}
          arenaInfoExpanded={arenaInfoExpanded}
          arenaInfoPosition={arenaInfoPosition}
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
          playerName="Spieler 1"
          hp={p1Hp}
          onHpChange={setP1Hp}
          notes={p1Notes}
          onNotesChange={setP1Notes}
          position="bottom-left"
          customFields={p1CustomFields}
          onCustomFieldChange={(index, value) => updateCustomField('p1', index, { value })}
          onCustomFieldNameChange={(index, name) => updateCustomField('p1', index, { name })}
        />
        <PlayerHUD
          playerName="Spieler 2"
          hp={p2Hp}
          onHpChange={setP2Hp}
          notes={p2Notes}
          onNotesChange={setP2Notes}
          position="bottom-right"
          customFields={p2CustomFields}
          onCustomFieldChange={(index, value) => updateCustomField('p2', index, { value })}
          onCustomFieldNameChange={(index, name) => updateCustomField('p2', index, { name })}
        />

        <RoundCounter
          round={roundCounter}
          onRoundChange={setRoundCounter}
          notes={roundNotes}
          onNotesChange={setRoundNotes}
        />
      </div>

      <ArenaSelectionModal
        isOpen={showArenaModal}
        arenas={content.arenas}
        searchTerm={arenaSearchTerm}
        onSearchChange={setArenaSearchTerm}
        onSelect={activateArena}
        onClose={() => setShowArenaModal(false)}
      />
    </div>
  );
}
