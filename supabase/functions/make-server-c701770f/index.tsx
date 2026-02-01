/**
 * Edge Function: make-server-c701770f
 * Source copied from src/supabase/functions/server/index.tsx.
 * API routes: cards, session, notes, arenas, upload-image.
 */
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize database and storage on startup
async function initializeDatabase() {
  try {
    // Check if card index exists
    const cardIndex = await kv.get('card_index');
    if (!cardIndex) {
      await kv.set('card_index', []);
      console.log('Initialized card_index');
    }
    
    // Check if session index exists
    const sessionIndex = await kv.get('session_index');
    if (!sessionIndex) {
      await kv.set('session_index', []);
      console.log('Initialized session_index');
    }
    
    // Check if note index exists
    const noteIndex = await kv.get('note_index');
    if (!noteIndex) {
      await kv.set('note_index', []);
      console.log('Initialized note_index');
    }
    
    // Check if arena index exists
    const arenaIndex = await kv.get('arena_index');
    if (!arenaIndex) {
      await kv.set('arena_index', []);
      console.log('Initialized arena_index');
    }
    
    // Initialize Supabase Storage bucket for card images
    const bucketName = 'make-c701770f-card-images';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880 // 5MB
      });
      console.log('Initialized storage bucket:', bucketName);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();

// ============= CARD ROUTES =============

// Get all cards
app.get('/make-server-c701770f/cards', async (c) => {
  try {
    const cardIndex = await kv.get('card_index') || [];
    const cardIds = cardIndex as string[];
    
    if (cardIds.length === 0) {
      return c.json([]);
    }
    
    const cards = await kv.mget(cardIds.map(id => `card:${id}`));
    return c.json(cards.filter(card => card !== null));
  } catch (error) {
    console.error('Error fetching cards:', error);
    return c.json({ error: 'Failed to fetch cards', details: error.message }, 500);
  }
});

// Get single card
app.get('/make-server-c701770f/cards/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const card = await kv.get(`card:${id}`);
    
    if (!card) {
      return c.json({ error: 'Card not found' }, 404);
    }
    
    return c.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    return c.json({ error: 'Failed to fetch card', details: error.message }, 500);
  }
});

// Create card
app.post('/make-server-c701770f/cards', async (c) => {
  try {
    const cardData = await c.req.json();
    const id = crypto.randomUUID();
    
    const card = {
      id,
      name: cardData.name,
      type: cardData.type,
      element: cardData.element,
      stats_json: cardData.stats_json,
      effects_text: cardData.effects_text,
      effects: cardData.effects,
      trigger_dice_value: cardData.trigger_dice_value,
      image_asset: cardData.image_asset,
      notes: cardData.notes || '',
      created_at: new Date().toISOString()
    };
    
    // Save card
    await kv.set(`card:${id}`, card);
    
    // Update index
    const cardIndex = await kv.get('card_index') || [];
    await kv.set('card_index', [...cardIndex as string[], id]);
    
    return c.json(card, 201);
  } catch (error) {
    console.error('Error creating card:', error);
    return c.json({ error: 'Failed to create card', details: error.message }, 500);
  }
});

// Update card
app.put('/make-server-c701770f/cards/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const cardData = await c.req.json();
    
    const existingCard = await kv.get(`card:${id}`);
    if (!existingCard) {
      return c.json({ error: 'Card not found' }, 404);
    }
    
    const updatedCard = {
      ...(existingCard as object),
      ...cardData,
      id,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`card:${id}`, updatedCard);
    
    return c.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    return c.json({ error: 'Failed to update card', details: error.message }, 500);
  }
});

// Delete card
app.delete('/make-server-c701770f/cards/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const card = await kv.get(`card:${id}`);
    if (!card) {
      return c.json({ error: 'Card not found' }, 404);
    }
    
    // Delete card
    await kv.del(`card:${id}`);
    
    // Delete card comments
    await kv.del(`card_comments:${id}`);
    
    // Update index
    const cardIndex = await kv.get('card_index') || [];
    const updatedIndex = (cardIndex as string[]).filter(cardId => cardId !== id);
    await kv.set('card_index', updatedIndex);
    
    return c.json({ success: true, message: 'Card deleted' });
  } catch (error) {
    console.error('Error deleting card:', error);
    return c.json({ error: 'Failed to delete card', details: error.message }, 500);
  }
});

// Get card comments
app.get('/make-server-c701770f/cards/:id/comments', async (c) => {
  try {
    const id = c.req.param('id');
    
    const comments = await kv.get(`card_comments:${id}`);
    return c.json(comments || []);
  } catch (error) {
    console.error('Error fetching card comments:', error);
    return c.json({ error: 'Failed to fetch comments', details: error.message }, 500);
  }
});

// Add comment to card
app.post('/make-server-c701770f/cards/:id/comments', async (c) => {
  try {
    const cardId = c.req.param('id');
    const commentData = await c.req.json();
    
    const comment = {
      id: crypto.randomUUID(),
      text: commentData.text,
      timestamp: new Date().toISOString()
    };
    
    const comments = await kv.get(`card_comments:${cardId}`) || [];
    const updatedComments = [...(comments as any[]), comment];
    
    await kv.set(`card_comments:${cardId}`, updatedComments);
    
    return c.json(comment);
  } catch (error) {
    console.error('Error adding card comment:', error);
    return c.json({ error: 'Failed to add comment', details: error.message }, 500);
  }
});

// Delete comment from card
app.delete('/make-server-c701770f/cards/:cardId/comments/:commentId', async (c) => {
  try {
    const cardId = c.req.param('cardId');
    const commentId = c.req.param('commentId');
    
    const comments = await kv.get(`card_comments:${cardId}`) || [];
    const updatedComments = (comments as any[]).filter((comment: any) => comment.id !== commentId);
    
    await kv.set(`card_comments:${cardId}`, updatedComments);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting card comment:', error);
    return c.json({ error: 'Failed to delete comment', details: error.message }, 500);
  }
});

// ============= GAME SESSION ROUTES =============

// Create or update game session
app.post('/make-server-c701770f/session', async (c) => {
  try {
    const sessionData = await c.req.json();
    const sessionId = sessionData.session_id || crypto.randomUUID();
    
    const session = {
      session_id: sessionId,
      p1_hp: sessionData.p1_hp ?? 20,
      p2_hp: sessionData.p2_hp ?? 20,
      p1_notes: sessionData.p1_notes || '',
      p2_notes: sessionData.p2_notes || '',
      dice_history: sessionData.dice_history || [],
      board_state_json: sessionData.board_state_json || {},
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`session:${sessionId}`, session);
    
    // Update session index if new
    const sessionIndex = await kv.get('session_index') || [];
    if (!(sessionIndex as string[]).includes(sessionId)) {
      await kv.set('session_index', [...sessionIndex as string[], sessionId]);
    }
    
    return c.json(session);
  } catch (error) {
    console.error('Error saving session:', error);
    return c.json({ error: 'Failed to save session', details: error.message }, 500);
  }
});

// Get game session
app.get('/make-server-c701770f/session/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const session = await kv.get(`session:${id}`);
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404);
    }
    
    return c.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return c.json({ error: 'Failed to fetch session', details: error.message }, 500);
  }
});

// Get cards by type (for Arena Generator)
app.get('/make-server-c701770f/cards-by-type/:type', async (c) => {
  try {
    const type = c.req.param('type');
    const cardIndex = await kv.get('card_index') || [];
    const cardIds = cardIndex as string[];
    
    if (cardIds.length === 0) {
      return c.json([]);
    }
    
    const cards = await kv.mget(cardIds.map(id => `card:${id}`));
    const filteredCards = cards.filter(card => card !== null && (card as any).type === type);
    
    return c.json(filteredCards);
  } catch (error) {
    console.error('Error fetching cards by type:', error);
    return c.json({ error: 'Failed to fetch cards by type', details: error.message }, 500);
  }
});

// ============= NOTES ROUTES =============

// Get all notes
app.get('/make-server-c701770f/notes', async (c) => {
  try {
    const noteIndex = await kv.get('note_index') || [];
    const noteIds = noteIndex as string[];
    
    if (noteIds.length === 0) {
      return c.json([]);
    }
    
    const notes = await kv.mget(noteIds.map(id => `note:${id}`));
    const validNotes = notes.filter(note => note !== null);
    
    // Sort by created_at descending (newest first)
    validNotes.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return c.json(validNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return c.json({ error: 'Failed to fetch notes', details: error.message }, 500);
  }
});

// Create note
app.post('/make-server-c701770f/notes', async (c) => {
  try {
    const noteData = await c.req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const note = {
      id,
      title: noteData.title,
      content: noteData.content,
      created_at: now,
      updated_at: now,
      comments: []
    };
    
    // Save note
    await kv.set(`note:${id}`, note);
    
    // Update index
    const noteIndex = await kv.get('note_index') || [];
    await kv.set('note_index', [...noteIndex as string[], id]);
    
    return c.json(note, 201);
  } catch (error) {
    console.error('Error creating note:', error);
    return c.json({ error: 'Failed to create note', details: error.message }, 500);
  }
});

// Update note
app.put('/make-server-c701770f/notes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const noteData = await c.req.json();
    
    const existingNote = await kv.get(`note:${id}`);
    if (!existingNote) {
      return c.json({ error: 'Note not found' }, 404);
    }
    
    const updatedNote = {
      ...(existingNote as object),
      ...noteData,
      id,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`note:${id}`, updatedNote);
    
    return c.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    return c.json({ error: 'Failed to update note', details: error.message }, 500);
  }
});

// Delete note
app.delete('/make-server-c701770f/notes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const note = await kv.get(`note:${id}`);
    if (!note) {
      return c.json({ error: 'Note not found' }, 404);
    }
    
    // Delete note
    await kv.del(`note:${id}`);
    
    // Update index
    const noteIndex = await kv.get('note_index') || [];
    const updatedIndex = (noteIndex as string[]).filter(noteId => noteId !== id);
    await kv.set('note_index', updatedIndex);
    
    return c.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return c.json({ error: 'Failed to delete note', details: error.message }, 500);
  }
});

// Add comment to note
app.post('/make-server-c701770f/notes/:id/comments', async (c) => {
  try {
    const noteId = c.req.param('id');
    const commentData = await c.req.json();
    
    const note = await kv.get(`note:${noteId}`);
    if (!note) {
      return c.json({ error: 'Note not found' }, 404);
    }
    
    const comment = {
      id: crypto.randomUUID(),
      text: commentData.text,
      timestamp: new Date().toISOString()
    };
    
    const updatedNote = {
      ...(note as any),
      comments: [...(note as any).comments, comment]
    };
    
    await kv.set(`note:${noteId}`, updatedNote);
    
    return c.json(updatedNote);
  } catch (error) {
    console.error('Error adding comment:', error);
    return c.json({ error: 'Failed to add comment', details: error.message }, 500);
  }
});

// Delete comment from note
app.delete('/make-server-c701770f/notes/:noteId/comments/:commentId', async (c) => {
  try {
    const noteId = c.req.param('noteId');
    const commentId = c.req.param('commentId');
    
    const note = await kv.get(`note:${noteId}`);
    if (!note) {
      return c.json({ error: 'Note not found' }, 404);
    }
    
    const updatedNote = {
      ...(note as any),
      comments: (note as any).comments.filter((comment: any) => comment.id !== commentId)
    };
    
    await kv.set(`note:${noteId}`, updatedNote);
    
    return c.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return c.json({ error: 'Failed to delete comment', details: error.message }, 500);
  }
});

// ============= ARENA LIBRARY ROUTES =============

// Get all arenas
app.get('/make-server-c701770f/arenas', async (c) => {
  try {
    const arenaIndex = await kv.get('arena_index') || [];
    const arenaIds = arenaIndex as string[];
    
    if (arenaIds.length === 0) {
      return c.json([]);
    }
    
    const arenas = await kv.mget(arenaIds.map(id => `arena:${id}`));
    const validArenas = arenas.filter(arena => arena !== null);
    
    return c.json(validArenas);
  } catch (error) {
    console.error('Error fetching arenas:', error);
    return c.json({ error: 'Failed to fetch arenas', details: error.message }, 500);
  }
});

// Create arena
app.post('/make-server-c701770f/arenas', async (c) => {
  try {
    const arenaData = await c.req.json();
    const id = crypto.randomUUID();
    
    const arena = {
      id,
      name: arenaData.name,
      biom_card_id: arenaData.biom_card_id,
      mutation_card_id: arenaData.mutation_card_id,
      created_at: new Date().toISOString()
    };
    
    // Save arena
    await kv.set(`arena:${id}`, arena);
    
    // Update index
    const arenaIndex = await kv.get('arena_index') || [];
    await kv.set('arena_index', [...arenaIndex as string[], id]);
    
    return c.json(arena, 201);
  } catch (error) {
    console.error('Error creating arena:', error);
    return c.json({ error: 'Failed to create arena', details: error.message }, 500);
  }
});

// Update arena
app.put('/make-server-c701770f/arenas/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const arenaData = await c.req.json();
    
    const existingArena = await kv.get(`arena:${id}`);
    if (!existingArena) {
      return c.json({ error: 'Arena not found' }, 404);
    }
    
    // Only update fields that are provided in the request
    const updatedArena = {
      ...(existingArena as object),
      ...(arenaData.name !== undefined && { name: arenaData.name }),
      ...(arenaData.biom_card_id !== undefined && { biom_card_id: arenaData.biom_card_id }),
      ...(arenaData.mutation_card_id !== undefined && { mutation_card_id: arenaData.mutation_card_id }),
      id
    };
    
    await kv.set(`arena:${id}`, updatedArena);
    
    return c.json(updatedArena);
  } catch (error) {
    console.error('Error updating arena:', error);
    return c.json({ error: 'Failed to update arena', details: error.message }, 500);
  }
});

// Delete arena
app.delete('/make-server-c701770f/arenas/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const arena = await kv.get(`arena:${id}`);
    if (!arena) {
      return c.json({ error: 'Arena not found' }, 404);
    }
    
    // Delete arena
    await kv.del(`arena:${id}`);
    
    // Update index
    const arenaIndex = await kv.get('arena_index') || [];
    const updatedIndex = (arenaIndex as string[]).filter(arenaId => arenaId !== id);
    await kv.set('arena_index', updatedIndex);
    
    return c.json({ success: true, message: 'Arena deleted' });
  } catch (error) {
    console.error('Error deleting arena:', error);
    return c.json({ error: 'Failed to delete arena', details: error.message }, 500);
  }
});

// ============= IMAGE UPLOAD ROUTE =============

// Upload image for card
app.post('/make-server-c701770f/upload-image', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed' }, 400);
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File too large. Maximum size is 5MB' }, 400);
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const bucketName = 'make-c701770f-card-images';
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return c.json({ error: 'Failed to upload image', details: error.message }, 500);
    }
    
    // Generate signed URL (valid for 10 years)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 315360000); // 10 years in seconds
    
    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError);
      return c.json({ error: 'Failed to generate signed URL', details: signedUrlError.message }, 500);
    }
    
    return c.json({
      success: true,
      url: signedUrlData.signedUrl,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return c.json({ error: 'Failed to upload image', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);
