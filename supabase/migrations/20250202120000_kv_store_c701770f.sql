-- Migration: KV store table for Edge Function make-server-c701770f (cards, notes, arenas, session).
-- Source: Comment in src/supabase/functions/server/kv_store.tsx.

CREATE TABLE IF NOT EXISTS public.kv_store_c701770f (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

COMMENT ON TABLE public.kv_store_c701770f IS 'Key-value store for Figma Make app data (cards, notes, arenas, session).';
