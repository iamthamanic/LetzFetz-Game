import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, MessageSquare, Save } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Comment {
  id: string;
  text: string;
  timestamp: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  comments: Comment[];
}

interface NotesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Notes({ isOpen, onClose }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [commentingNoteId, setCommentingNoteId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/notes`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        console.error('Failed to fetch notes:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/notes`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newNoteTitle,
            content: newNoteContent,
          }),
        }
      );

      if (response.ok) {
        setNewNoteTitle('');
        setNewNoteContent('');
        await fetchNotes();
      } else {
        console.error('Failed to create note:', await response.text());
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/notes/${noteId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      );

      if (response.ok) {
        setEditingNote(null);
        await fetchNotes();
      } else {
        console.error('Failed to update note:', await response.text());
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/notes/${noteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        await fetchNotes();
      } else {
        console.error('Failed to delete note:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleAddComment = async (noteId: string) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/notes/${noteId}/comments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: newComment,
          }),
        }
      );

      if (response.ok) {
        setNewComment('');
        setCommentingNoteId(null);
        await fetchNotes();
      } else {
        console.error('Failed to add comment:', await response.text());
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (noteId: string, commentId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c701770f/notes/${noteId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        await fetchNotes();
      } else {
        console.error('Failed to delete comment:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl text-white">📝 Notes & Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Create New Note */}
          <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white mb-3">Create New Note</h3>
            <input
              type="text"
              placeholder="Note title..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2"
            />
            <textarea
              placeholder="Note content..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2 h-24 resize-none"
            />
            <button
              onClick={handleCreateNote}
              disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading notes...</div>
            ) : notes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No notes yet. Create your first note above!
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  {editingNote?.id === note.id ? (
                    // Edit Mode
                    <div>
                      <input
                        type="text"
                        value={editingNote.title}
                        onChange={(e) =>
                          setEditingNote({ ...editingNote, title: e.target.value })
                        }
                        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2"
                      />
                      <textarea
                        value={editingNote.content}
                        onChange={(e) =>
                          setEditingNote({ ...editingNote, content: e.target.value })
                        }
                        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2 h-32 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateNote(note.id, {
                              title: editingNote.title,
                              content: editingNote.content,
                            })
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white text-lg">{note.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                            <span>Created: {formatTimestamp(note.created_at)}</span>
                            {note.updated_at !== note.created_at && (
                              <span>Updated: {formatTimestamp(note.updated_at)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingNote(note)}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap mb-3">
                        {note.content}
                      </p>

                      {/* Comments Section */}
                      <div className="border-t border-gray-700 pt-3 mt-3">
                        <button
                          onClick={() =>
                            setShowComments(
                              showComments === note.id ? null : note.id
                            )
                          }
                          className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 mb-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {note.comments.length} Comment
                          {note.comments.length !== 1 ? 's' : ''}
                        </button>

                        {showComments === note.id && (
                          <div className="mt-3 space-y-2">
                            {note.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="bg-gray-900 rounded-lg p-3 flex items-start justify-between"
                              >
                                <div className="flex-1">
                                  <p className="text-gray-300 text-sm">
                                    {comment.text}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatTimestamp(comment.timestamp)}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(note.id, comment.id)
                                  }
                                  className="text-red-400 hover:text-red-300 ml-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}

                            {/* Add Comment */}
                            <div className="flex gap-2 mt-3">
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={
                                  commentingNoteId === note.id ? newComment : ''
                                }
                                onChange={(e) => {
                                  setCommentingNoteId(note.id);
                                  setNewComment(e.target.value);
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddComment(note.id);
                                  }
                                }}
                                className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
                              />
                              <button
                                onClick={() => handleAddComment(note.id)}
                                disabled={!newComment.trim()}
                                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
