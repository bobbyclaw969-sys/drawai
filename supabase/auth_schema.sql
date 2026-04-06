-- Tag Hunter user profiles + saved plans
-- Run in Supabase SQL editor after enabling Auth (Email provider)

-- ── profiles ─────────────────────────────────────────────────────────────────
-- Mirrors HunterProfile from localStorage. SSN4 is NEVER stored here.
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  first_name       TEXT,
  last_name        TEXT,
  email            TEXT,
  residency_state  TEXT,
  city             TEXT,
  zip              TEXT,
  phone            TEXT,
  hunter_ed_number TEXT,
  hunter_ed_state  TEXT,
  licenses         JSONB DEFAULT '{}',   -- { stateId: licenseNumber }
  points_by_state  JSONB DEFAULT '{}',   -- { stateId: points }
  dob              TEXT,                 -- stored as string, user controls this
  address          TEXT
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── saved_plans ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_plans (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name       TEXT,
  profile    JSONB NOT NULL,   -- HunterProfile (no ssn4)
  strategy   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_saved_plans_user_id ON saved_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_plans_created_at ON saved_plans(created_at DESC);

ALTER TABLE saved_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own plans"
  ON saved_plans FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users can insert own plans"
  ON saved_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own plans"
  ON saved_plans FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users can delete own plans"
  ON saved_plans FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER saved_plans_updated_at
  BEFORE UPDATE ON saved_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
