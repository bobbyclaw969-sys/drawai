-- Tag Hunter usage analytics
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/tynbozzvqztyqapdfkna/sql

CREATE TABLE IF NOT EXISTS usage_events (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  event_type  TEXT NOT NULL CHECK (event_type IN ('strategy', 'find', 'chat')),
  ip_hash     TEXT NOT NULL,
  species     TEXT[] DEFAULT '{}',
  states      TEXT[] DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_usage_events_created_at  ON usage_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_event_type  ON usage_events(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_ip_hash     ON usage_events(ip_hash);

-- Row-level security: service role can insert, nobody can read (except via /api/stats)
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only"
  ON usage_events
  FOR ALL
  USING (auth.role() = 'service_role');
