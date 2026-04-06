-- Tag Hunter email waitlist
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/tynbozzvqztyqapdfkna/sql

CREATE TABLE IF NOT EXISTS waitlist (
  id         BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  source     TEXT DEFAULT 'homepage'
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email      ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only"
  ON waitlist
  FOR ALL
  USING (auth.role() = 'service_role');
