/**
 * Lightweight error logger — writes to Supabase error_log table.
 * Never throws — error logging must never break the main request.
 */
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function logError(
  source: string,
  error: unknown,
  context?: Record<string, unknown>,
): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error";

    const stack =
      error instanceof Error && error.stack
        ? error.stack.slice(0, 2000)
        : null;

    await supabase.from("error_log").insert({
      source,
      message: message.slice(0, 500),
      stack,
      context: context ?? null,
    });
  } catch {
    // Error logging must never break the main request
  }
}
