-- Enable RLS + service-role-only policy on all remaining public tables.
-- Already-secured tables (deadline_verifications, profiles, rate_limits,
-- saved_plans, usage_events, waitlist) are not touched.
--
-- Tables included:
--   - drawai: feedback, error_log (written from server via SUPABASE_SERVICE_ROLE_KEY)
--   - ol-co scaffolding (currently unused, all empty): budget_items, change_orders,
--     cost_codes, daily_logs, organizations, projects, punch_lists, resources,
--     task_dependencies, tasks, users
--
-- Service role bypasses RLS automatically, so server routes are unaffected.

DO $$
DECLARE
  t text;
  tbls text[] := ARRAY[
    'feedback','error_log',
    'budget_items','change_orders','cost_codes','daily_logs','organizations',
    'projects','punch_lists','resources','task_dependencies','tasks','users'
  ];
BEGIN
  FOREACH t IN ARRAY tbls LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "service role only" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "service role only" ON public.%I FOR ALL TO public USING (auth.role() = ''service_role'') WITH CHECK (auth.role() = ''service_role'')',
      t
    );
  END LOOP;
END$$;
