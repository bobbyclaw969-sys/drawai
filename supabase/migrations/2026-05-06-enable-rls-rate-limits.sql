-- Fix Supabase advisor alert: rls_disabled_in_public on rate_limits
-- Project: tynbozzvqztyqapdfkna (drawai / Tag Hunter)
-- Date: 2026-05-06
--
-- rate_limits is only accessed server-side via SUPABASE_SERVICE_ROLE_KEY
-- (see drawai/lib/rateLimit.ts). Service role bypasses RLS by default,
-- so enabling RLS with a service-role-only policy is fully backwards
-- compatible and just closes the public attack surface.
--
-- Run in: https://supabase.com/dashboard/project/tynbozzvqztyqapdfkna/sql

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service role only" ON rate_limits;
CREATE POLICY "service role only"
  ON rate_limits
  FOR ALL
  USING (auth.role() = 'service_role');
