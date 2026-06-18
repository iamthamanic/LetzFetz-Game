import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, MessageSquare, Save } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete, formatTimestamp } from '../utils/api';

interface Comment { id: string; text: string; timestamp: string; }
interface Note { id: string; title: string; content: string; created_at: string; updated_at: string; comments: Comment[]; }

interface NotesProps { isOpen: boolean; onClose: () => void; }

export function Notes({ isOpen, onClose }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [commentingNoteId, setCommentingNoteId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);

  useEffect(() => { if (isOpen) loadNotes(); }, [isOpen]);

  const loadNotes = async () => {
    setLoading(true);
    const data = await apiGet<Note[]>('/notes');
    if (data) setNotes(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    const created = await apiPost<Note>('/notes', { title: newNoteTitle, content: newNoteContent });
    if (created) { setNewNoteTitle(''); setNewNoteContent(''); await loadNotes(); }
  };

  const handleUpdate = async (noteId: string, updates: Partial<Note>) => {
    const updated = await apiPut<Note>(`/notes/${noteId}`, updates);
    if (updated) { setEditingNote(null); await loadNotes(); }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    const ok = await apiDelete(`/notes/${noteId}`);
    if (ok) await loadNotes();
  };

  const handleAddComment = async (noteId: string) => {
    if (!newComment.trim()) return;
    const added = await apiPost<Comment>(`/notes/${noteId}/comments`, { text: newComment });
    if (added) { setNewComment(''); setCommentingNoteId(null); await loadNotes(); }
  };

  const handleDeleteComment = async (noteId: string, commentId: string) => {
    const ok = await apiDelete(`/notes/${noteId}/comments/${commentId}`);
    if (ok) await loadNotes();
  };

  const toggleComments = (noteId: string) => setShowComments(showComments === noteId ? null : noteId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl text-white">📝 Notes & Comments</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <NewNoteForm
            title={newNoteTitle} content={newNoteContent}
            onTitleChange={setNewNoteTitle} onContentChange={setNewNoteContent}
            onSubmit={handleCreate}
          />

          <div className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading notes...</div>
            ) : notes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No notes yet. Create your first note above!</div>
            ) : (
              notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isEditing={editingNote?.id === note.id}
                  editingNote={editingNote}
                  onEdit={setEditingNote}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  showComments={showComments === note.id}
                  onToggleComments={() => toggleComments(note.id)}
                  commentingNoteId={commentingNoteId}
                  onCommentingChange={setCommentingNoteId}
                  newComment={newComment}
                  onNewCommentChange={setNewComment}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewNoteForm({ title, content, onTitleChange, onContentChange, onSubmit }: any) {
  return (
    <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-white mb-3">Create New Note</h3>
      <input
        type="text" placeholder="Note title..." value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2"
      />
      <textarea
        placeholder="Note content..." value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2 h-24 resize-none"
      />
      <button
        onClick={onSubmit}
        disabled={!title.trim() || !content.trim()}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Note
      </button>
    </div>
  );
}

function NoteItem({ note, isEditing, editingNote, onEdit, onUpdate, onDelete, showComments, onToggleComments, commentingNoteId, onCommentingChange, newComment, onNewCommentChange, onAddComment, onDeleteComment }: any) {
  if (isEditing) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <input
          type="text" value={editingNote.title}
          onChange={(e) => onEdit({ ...editingNote, title: e.target.value })}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2"
        />
        <textarea
          value={editingNote.content}
          onChange={(e) => onEdit({ ...editingNote, content: e.target.value })}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-2 h-32 resize-none"
        />
        <div className="flex gap-2">
          <button onClick={() => onUpdate(note.id, { title: editingNote.title, content: editingNote.content })} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Save className="w-4 h-4" /> Save
          </button>
          <button onClick={() => onEdit(null)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-white text-lg">{note.title}</h3>
          <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
            <span>Created: {formatTimestamp(note.created_at)}</span>
            {note.updated_at !== note.created_at && <span>Updated: {formatTimestamp(note.updated_at)}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(note)} className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-gray-700"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => onDelete(note.id)} className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-gray-700"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <p className="text-gray-300 whitespace-pre-wrap mb-3">{note.content}</p>

      <div className="border-t border-gray-700 pt-3 mt-3">
        <button onClick={onToggleComments} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4" />
          {note.comments.length} Comment{note.comments.length !== 1 ? 's' : ''}
        </button>

        {showComments && (
          <div className="mt-3 space-y-2">
            {note.comments.map((comment: Comment) => (
              <div key={comment.id} className="bg-gray-900 rounded-lg p-3 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimestamp(comment.timestamp)}</p>
                </div>
                <button onClick={() => onDeleteComment(note.id, comment.id)} className="text-red-400 hover:text-red-300 ml-2"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}

            <div className="flex gap-2 mt-3">
              <input
                type="text" placeholder="Add a comment..."
                value={commentingNoteId === note.id ? newComment : ''}
                onChange={(e) => { onCommentingChange(note.id); onNewCommentChange(e.target.value); }}
                onKeyPress={(e) => { if (e.key === 'Enter') onAddComment(note.id); }}
                className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
              />
              <button onClick={() => onAddComment(note.id)} disabled={!newComment.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white px-3 py-2 rounded-lg"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
