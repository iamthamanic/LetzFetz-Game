/**
 * Local-first game notes modal (create / edit / delete + DE timestamps).
 * Location: src/features/shell/Notes.tsx
 * Opened from Settings; Spielregeln via composition-root callback (PlayRulesModal).
 */
import React, { useEffect, useState } from 'react';
import { BookOpen, Edit2, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import {
  createGameNoteId,
  formatGameNoteTimestamp,
  loadGameNotes,
  saveGameNotes,
  type GameNote,
} from '../../services/storage/gameNotes';

interface NotesProps {
  isOpen: boolean;
  onClose: () => void;
  /** Opens existing V5 PlayRulesModal (wired in App). */
  onOpenRules?: () => void;
}

export function Notes({ isOpen, onClose, onOpenRules }: NotesProps) {
  const [notes, setNotes] = useState<GameNote[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setNotes(loadGameNotes());
    setEditingId(null);
    setNewTitle('');
    setNewContent('');
  }, [isOpen]);

  const persist = (next: GameNote[]) => {
    setNotes(next);
    saveGameNotes(next);
  };

  const handleCreate = () => {
    const title = newTitle.trim();
    const content = newContent.trim();
    if (!title || !content) return;
    const now = new Date().toISOString();
    const note: GameNote = {
      id: createGameNoteId(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    persist([note, ...notes]);
    setNewTitle('');
    setNewContent('');
  };

  const startEdit = (note: GameNote) => {
    setEditingId(note.id);
    setDraftTitle(note.title);
    setDraftContent(note.content);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const title = draftTitle.trim();
    const content = draftContent.trim();
    if (!title || !content) return;
    const now = new Date().toISOString();
    persist(
      notes.map((n) =>
        n.id === editingId ? { ...n, title, content, updatedAt: now } : n,
      ),
    );
    setEditingId(null);
  };

  const handleDelete = (noteId: string) => {
    if (!window.confirm('Notiz wirklich löschen?')) return;
    persist(notes.filter((n) => n.id !== noteId));
    if (editingId === noteId) setEditingId(null);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Spielregeln & Notizen"
      size="lg"
      testId="game-notes-modal"
      dismissible
      footer={
        onOpenRules ? (
          <Button
            variant="secondary"
            size="sm"
            icon={<BookOpen className="h-4 w-4" />}
            onClick={onOpenRules}
            data-testid="game-notes-open-rules"
          >
            Spielregeln öffnen
          </Button>
        ) : null
      }
    >
      <p className="mb-4 text-xs text-stone-500">
        Spielnotizen und Ideen — lokal in diesem Browser. Jede Notiz zeigt Erstell- und
        Änderungszeit.
      </p>

      <div className="mb-6 space-y-3 rounded-md border border-stone-700/80 bg-stone-950/40 p-3">
        <h4 className="text-sm font-semibold text-stone-100">Neue Notiz</h4>
        <Input
          label="Titel"
          placeholder="Kurzer Titel…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          data-testid="game-notes-new-title"
        />
        <Textarea
          label="Inhalt"
          rows={3}
          placeholder="Beobachtung, Balance-Idee, Bug…"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          data-testid="game-notes-new-content"
        />
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleCreate}
          disabled={!newTitle.trim() || !newContent.trim()}
          data-testid="game-notes-create"
        >
          Notiz speichern
        </Button>
      </div>

      <div className="space-y-3" data-testid="game-notes-list">
        {notes.length === 0 ? (
          <p className="py-6 text-center text-sm text-stone-500">
            Noch keine Notizen. Lege oben die erste an.
          </p>
        ) : (
          notes.map((note) => (
            <article
              key={note.id}
              className="rounded-md border border-stone-700/80 bg-stone-950/40 p-3"
              data-testid={`game-note-${note.id}`}
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <Input
                    label="Titel"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                  />
                  <Textarea
                    label="Inhalt"
                    rows={4}
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      icon={<Save className="h-4 w-4" />}
                      onClick={handleSaveEdit}
                      disabled={!draftTitle.trim() || !draftContent.trim()}
                    >
                      Speichern
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                      Abbrechen
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-stone-100">{note.title}</h4>
                      <p className="mt-1 text-xs text-stone-500">
                        Erstellt: {formatGameNoteTimestamp(note.createdAt)}
                        {note.updatedAt !== note.createdAt
                          ? ` · Geändert: ${formatGameNoteTimestamp(note.updatedAt)}`
                          : null}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit2 className="h-4 w-4" />}
                        onClick={() => startEdit(note)}
                        aria-label="Notiz bearbeiten"
                        className="px-2 py-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => handleDelete(note.id)}
                        aria-label="Notiz löschen"
                        className="px-2 py-2 text-red-400 hover:text-red-300"
                      />
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-stone-300">{note.content}</p>
                </>
              )}
            </article>
          ))
        )}
      </div>
    </Modal>
  );
}
