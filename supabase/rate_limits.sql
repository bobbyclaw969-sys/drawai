-- Tag Hunter distributed rate limiting
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/tynbozzvqztyqapdfkna/sql

CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT PRIMARY KEY,
  count        INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION check_rate_limit(
  p_key       TEXT,
  p_limit     INTEGER,
  p_window_ms BIGINT
) RETURNS TABLE(allowed BOOLEAN, remaining INTEGER, retry_after_ms BIGINT)
LANGUAGE plpgsql AS $$
DECLARE
  v_now        TIMESTAMPTZ := NOW();
  v_count      INTEGER;
  v_win_start  TIMESTAMPTZ;
BEGIN
  INSERT INTO rate_limits (key, count, window_start)
  VALUES (p_key, 1, v_now)
  ON CONFLICT (key) DO UPDATE SET
    count        = CASE
      WHEN EXTRACT(EPOCH FROM (v_now - rate_limits.window_start)) * 1000 > p_window_ms
        THEN 1
        ELSE rate_limits.count + 1
      END,
    window_start = CASE
      WHEN EXTRACT(EPOCH FROM (v_now - rate_limits.window_start)) * 1000 > p_window_ms
        THEN v_now
        ELSE rate_limits.window_start
      END
  RETURNING rate_limits.count, rate_limits.window_start INTO v_count, v_win_start;

  RETURN QUERY SELECT
    v_count <= p_limit,
    GREATEST(0, p_limit - v_count),
    CASE WHEN v_count > p_limit
      THEN GREATEST(0, p_window_ms - EXTRACT(EPOCH FROM (v_now - v_win_start))::BIGINT * 1000)
      ELSE 0::BIGINT
    END;
END;
$$;

-- Cleanup old windows hourly (optional cron, or just let rows accumulate — table stays small)
-- SELECT cron.schedule('rate-limit-cleanup', '0 * * * *', $$DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '2 hours'$$);
