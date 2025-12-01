import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, MessageSquare, Trash2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Comment {
  id: string;
  text: string;
  timestamp: string;
}

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

export function CardNotes({ 
  isOpen, 
  onClose, 
  cardName,
  cardId,
  initialNotes, 
  onSave,
  createdAt,
  updatedAt
}: CardNotesProps) {
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
      if (cardId) {
        fetchComments();
      }
    }
  }, [isOpen, initialNotes, cardId]);

  const fetchComments = async () => {
    if (!cardId) return;

    setLoadingComments(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards/${cardId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data || []);
      } else {
        console.error('Failed to fetch comments:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !cardId) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards/${cardId}/comments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newComment }),
        }
      );

      if (response.ok) {
        setNewComment('');
        await fetchComments();
      } else {
        console.error('Failed to add comment:', await response.text());
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!cardId) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/cards/${cardId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        await fetchComments();
      } else {
        console.error('Failed to delete comment:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleSave = () => {
    onSave(notes);
    setHasChanges(false);
    onClose();
  };

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('Du hast ungespeicherte Änderungen. Möchtest du wirklich schließen?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasChanges(value !== initialNotes);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl text-white">📝 Karten-Notizen & Kommentare</h2>
            <p className="text-gray-400 text-sm mt-1">{cardName}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Notes */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white mb-4 flex items-center gap-2">
                  📄 Notizen
                </h3>

                {/* Timestamps */}
                {createdAt && (
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 bg-gray-900 rounded-lg p-3 border border-gray-700">
                    <span>📅 Erstellt: {formatTimestamp(createdAt)}</span>
                    {updatedAt && updatedAt !== createdAt && (
                      <span>🔄 Geändert: {formatTimestamp(updatedAt)}</span>
                    )}
                  </div>
                )}

                {/* Notes Textarea */}
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                    style={{ minHeight: '500px' }}
                    placeholder="Notizen, Ideen, Design-Gedanken für diese Karte..."
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Diese Notizen sind nur für diese Karte sichtbar und werden in der Datenbank gespeichert.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Comments */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-white mb-4 flex items-center gap-2 hover:text-purple-400 transition-colors w-full"
                >
                  <MessageSquare className="w-5 h-5" />
                  <h3>Kommentare ({comments.length})</h3>
                  <span className="text-gray-500 ml-auto">{showComments ? '▼' : '▶'}</span>
                </button>

                {showComments && (
                  <div className="space-y-4">
                    {/* Add Comment */}
                    {cardId && (
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                          rows={3}
                          placeholder="Neuen Kommentar hinzufügen..."
                        />
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="mt-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          💬 Kommentar hinzufügen
                        </button>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-3" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                      {loadingComments ? (
                        <div className="text-center text-gray-400 py-8">
                          Lade Kommentare...
                        </div>
                      ) : comments.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 bg-gray-900 rounded-lg border border-gray-700">
                          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p>Noch keine Kommentare</p>
                          {!cardId && (
                            <p className="text-xs mt-2">
                              (Speichere die Karte zuerst, um Kommentare hinzuzufügen)
                            </p>
                          )}
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex items-start justify-between gap-3"
                          >
                            <div className="flex-1">
                              <p className="text-white text-sm whitespace-pre-wrap">
                                {comment.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTimestamp(comment.timestamp)}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors"
                              title="Kommentar löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                <p className="text-purple-200 text-sm">
                  💡 <strong>Tipp:</strong> Nutze Notizen für Design-Gedanken und Kommentare für Diskussionen oder Changelog-Einträge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-800/50">
          <div className="text-sm text-gray-400">
            {hasChanges && (
              <span className="text-yellow-400">⚠️ Ungespeicherte Änderungen in Notizen</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Notizen speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}