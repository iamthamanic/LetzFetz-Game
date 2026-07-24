import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, MessageSquare, Trash2 } from 'lucide-react';
import { apiGet, apiPost, apiDelete, formatTimestamp } from '../../utils/api';

interface Comment { id: string; text: string; timestamp: string; }

interface CardNotesProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardId?: string;
  initialNotes: string;
  onSave: (notes: string) => void;
  createdAt?: string;
  updatedAt?: string;
}

export function CardNotes({ isOpen, onClose, cardName, cardId, initialNotes, onSave, createdAt, updatedAt }: CardNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [hasChanges, setHasChanges] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNotes(initialNotes);
      setHasChanges(false);
      if (cardId) loadComments();
    }
  }, [isOpen, initialNotes, cardId]);

  const loadComments = async () => {
    if (!cardId) return;
    setLoadingComments(true);
    const data = await apiGet<Comment[]>(`/cards/${cardId}/comments`);
    if (data) setComments(data);
    setLoadingComments(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !cardId) return;
    const added = await apiPost<Comment>(`/cards/${cardId}/comments`, { text: newComment });
    if (added) { setNewComment(''); await loadComments(); }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!cardId) return;
    const ok = await apiDelete(`/cards/${cardId}/comments/${commentId}`);
    if (ok) await loadComments();
  };

  const handleSave = () => { onSave(notes); setHasChanges(false); onClose(); };

  const handleClose = () => {
    if (hasChanges && !confirm('Du hast ungespeicherte Änderungen. Möchtest du wirklich schließen?')) return;
    onClose();
  };

  const handleNotesChange = (value: string) => { setNotes(value); setHasChanges(value !== initialNotes); };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
        <Header cardName={cardName} onClose={handleClose} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NotesEditor notes={notes} onChange={handleNotesChange} createdAt={createdAt} updatedAt={updatedAt} />
            <CommentsSection
              cardId={cardId} comments={comments} showComments={showComments}
              onToggle={() => setShowComments(!showComments)} newComment={newComment}
              onNewCommentChange={setNewComment} onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment} loadingComments={loadingComments}
            />
          </div>
        </div>
        <Footer hasChanges={hasChanges} onClose={handleClose} onSave={handleSave} />
      </div>
    </div>,
    document.body
  );
}

function Header({ cardName, onClose }: { cardName: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-800">
      <div>
        <h2 className="text-2xl text-white">📝 Karten-Notizen & Kommentare</h2>
        <p className="text-gray-400 text-sm mt-1">{cardName}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
    </div>
  );
}

function NotesEditor({ notes, onChange, createdAt, updatedAt }: { notes: string; onChange: (v: string) => void; createdAt?: string; updatedAt?: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-white mb-4">📄 Notizen</h3>
        {createdAt && (
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 bg-gray-900 rounded-lg p-3 border border-gray-700">
            <span>📅 Erstellt: {formatTimestamp(createdAt)}</span>
            {updatedAt && updatedAt !== createdAt && <span>🔄 Geändert: {formatTimestamp(updatedAt)}</span>}
          </div>
        )}
        <textarea
          value={notes} onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
          style={{ minHeight: '500px' }}
          placeholder="Notizen, Ideen, Design-Gedanken für diese Karte..."
          autoFocus
        />
      </div>
    </div>
  );
}

function CommentsSection({ cardId, comments, showComments, onToggle, newComment, onNewCommentChange, onAddComment, onDeleteComment, loadingComments }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <button onClick={onToggle} className="text-white mb-4 flex items-center gap-2 hover:text-purple-400 w-full">
          <MessageSquare className="w-5 h-5" />
          <h3>Kommentare ({comments.length})</h3>
          <span className="text-gray-500 ml-auto">{showComments ? '▼' : '▶'}</span>
        </button>

        {showComments && (
          <div className="space-y-4">
            {cardId && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <textarea value={newComment} onChange={(e) => onNewCommentChange(e.target.value)} rows={3}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Neuen Kommentar hinzufügen..."
                />
                <button onClick={onAddComment} disabled={!newComment.trim()} className="mt-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                  💬 Kommentar hinzufügen
                </button>
              </div>
            )}
            <div className="space-y-3" style={{ maxHeight: '450px', overflowY: 'auto' }}>
              {loadingComments ? <div className="text-center text-gray-400 py-8">Lade Kommentare...</div> :
               comments.length === 0 ? <EmptyComments cardId={cardId} /> :
               comments.map((c: Comment) => (
                 <div key={c.id} className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex items-start justify-between gap-3">
                   <div className="flex-1">
                     <p className="text-white text-sm whitespace-pre-wrap">{c.text}</p>
                     <p className="text-xs text-gray-500 mt-2">{formatTimestamp(c.timestamp)}</p>
                   </div>
                   <button onClick={() => onDeleteComment(c.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
        <p className="text-purple-200 text-sm">💡 <strong>Tipp:</strong> Nutze Notizen für Design-Gedanken und Kommentare für Diskussionen.</p>
      </div>
    </div>
  );
}

function EmptyComments({ cardId }: { cardId?: string }) {
  return (
    <div className="text-center text-gray-500 py-8 bg-gray-900 rounded-lg border border-gray-700">
      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
      <p>Noch keine Kommentare</p>
      {!cardId && <p className="text-xs mt-2">(Speichere die Karte zuerst, um Kommentare hinzuzufügen)</p>}
    </div>
  );
}

function Footer({ hasChanges, onClose, onSave }: { hasChanges: boolean; onClose: () => void; onSave: () => void }) {
  return (
    <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-800/50">
      <div className="text-sm text-gray-400">
        {hasChanges && <span className="text-yellow-400">⚠️ Ungespeicherte Änderungen in Notizen</span>}
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">Abbrechen</button>
        <button onClick={onSave} disabled={!hasChanges} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" /> Notizen speichern
        </button>
      </div>
    </div>
  );
}
