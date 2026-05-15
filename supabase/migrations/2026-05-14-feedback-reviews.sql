-- Reviews flow: extend `feedback` table for thumbs-up/down sentiment capture.
-- Adds anon_id (uuid string from client localStorage), sentiment, source.
-- Drops `category` requirement (kept nullable for back-compat with existing rows).
-- RLS already enabled (see 2026-05-06-enable-rls-all-tables.sql) — service role only.
--
-- Run in: https://supabase.com/dashboard/project/tynbozzvqztyqapdfkna/sql

-- Add columns (idempotent)
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS anon_id   TEXT;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral'));
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS source    TEXT;

-- Drop the NOT NULL on `message` if it exists, so an empty positive thumbs-up
-- (user clicked Google Review without typing) still records sentiment.
-- (No-op if already nullable.)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'feedback'
      AND column_name = 'message' AND is_nullable = 'NO'
  ) THEN
    EXECUTE 'ALTER TABLE public.feedback ALTER COLUMN message DROP NOT NULL';
  END IF;
END$$;

-- Index for idempotency lookups (anon_id + recent created_at)
CREATE INDEX IF NOT EXISTS idx_feedback_anon_id_created_at
  ON public.feedback (anon_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_sentiment_created_at
  ON public.feedback (sentiment, created_at DESC);

-- Allow anon role to INSERT (no SELECT). Service role still bypasses RLS
-- and remains the primary writer from the API route.
-- The anon role can only INSERT — no reads, no updates, no deletes.
DROP POLICY IF EXISTS "anon insert feedback" ON public.feedback;
CREATE POLICY "anon insert feedback"
  ON public.feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Re-assert: anon role cannot SELECT. No policy = no access under RLS.
-- (We intentionally do NOT create a SELECT policy for anon.)

-- ── waitlist: track when we last asked for a review, so we don't re-ask ──
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS review_asked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_waitlist_review_asked_at
  ON public.waitlist (review_asked_at);
