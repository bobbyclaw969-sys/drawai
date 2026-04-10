-- Tag Hunter — Deadline Verifications
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/tynbozzvqztyqapdfkna/sql
--
-- Each row = one (state, species, season_year) combo that has been
-- manually verified against the official state agency source by an admin.

CREATE TABLE IF NOT EXISTS deadline_verifications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id              TEXT NOT NULL,        -- e.g. "co", "wy", "ut"
  species               TEXT NOT NULL,        -- e.g. "elk", "mule_deer"
  verified_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_by           TEXT NOT NULL,        -- email of admin who verified
  source_url            TEXT NOT NULL,        -- official state agency URL
  source_label          TEXT NOT NULL,        -- e.g. "wgfd.wyo.gov"
  season_year           INTEGER NOT NULL,     -- e.g. 2026
  notes                 TEXT,                 -- optional notes about the record
  close_date_confirmed  DATE,                 -- the actual confirmed close date
  fee_nr_confirmed      INTEGER,              -- confirmed NR fee in dollars
  UNIQUE(state_id, species, season_year)
);

CREATE INDEX IF NOT EXISTS idx_deadline_verifications_year
  ON deadline_verifications(season_year);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Public read so anyone can see verification status on public pages.
-- Writes happen only via the API route which uses the service role key.

ALTER TABLE deadline_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON deadline_verifications;
CREATE POLICY "Public read" ON deadline_verifications
  FOR SELECT USING (true);

-- Service role bypasses RLS by default, but we add an explicit policy
-- in case the table is ever queried via other auth contexts.
DROP POLICY IF EXISTS "Service role full access" ON deadline_verifications;
CREATE POLICY "Service role full access" ON deadline_verifications
  USING (true) WITH CHECK (true);
