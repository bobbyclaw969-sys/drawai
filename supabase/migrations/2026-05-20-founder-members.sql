-- Tag Hunter Founder Tier
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/tynbozzvqztyqapdfkna/sql
--
-- Two tables:
--   founder_interest — emails captured before Stripe is wired (open list)
--   founder_members  — paid lifetime founders, populated by Stripe webhook
--
-- The interest table exists so we can run the landing page now and convert
-- interested users to paid members once Stripe Checkout goes live.

CREATE TABLE IF NOT EXISTS founder_interest (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  source      TEXT DEFAULT 'founder_page',
  notes       TEXT,
  contacted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_founder_interest_email      ON founder_interest(email);
CREATE INDEX IF NOT EXISTS idx_founder_interest_created_at ON founder_interest(created_at DESC);

ALTER TABLE founder_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only — founder_interest"
  ON founder_interest
  FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS founder_members (
  id                  BIGSERIAL PRIMARY KEY,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email               TEXT NOT NULL UNIQUE,
  stripe_customer_id  TEXT,
  stripe_session_id   TEXT UNIQUE,
  amount_cents        INTEGER NOT NULL,
  display_name        TEXT,
  visible             BOOLEAN DEFAULT TRUE, -- show on /backers page
  notes               TEXT
);

CREATE INDEX IF NOT EXISTS idx_founder_members_email        ON founder_members(email);
CREATE INDEX IF NOT EXISTS idx_founder_members_created_at   ON founder_members(created_at DESC);

ALTER TABLE founder_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only — founder_members"
  ON founder_members
  FOR ALL
  USING (auth.role() = 'service_role');

-- Public read of visible display names for the /backers page.
CREATE POLICY "anon read visible founder display names"
  ON founder_members
  FOR SELECT
  TO anon
  USING (visible = TRUE);

-- ─────────────────────────────────────────────────────────────────────────
-- Helper: get the current founder count, for the live cap UI on /founder
CREATE OR REPLACE FUNCTION get_founder_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER FROM founder_members;
$$;

GRANT EXECUTE ON FUNCTION get_founder_count() TO anon, authenticated;
