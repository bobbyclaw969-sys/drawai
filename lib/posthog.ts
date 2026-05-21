/**
 * Client-side PostHog helpers — anon ID + thin track/identify wrappers.
 *
 * Initialization lives in app/providers/PostHogProvider.tsx (App Router
 * provider, mounted inside layout.tsx) so consent gating and lifecycle
 * are colocated with React rendering. This module only exposes
 * non-React utilities for the handful of callers that need to fire
 * events from event handlers or imperative code paths.
 *
 * Anon-first: every visitor gets a stable `th_anon_id` (UUID) the moment
 * they land — synced between localStorage and a 2-year cookie so the
 * same ID survives across sessions and SSR-side checks. We never send
 * PII unless `identify(email)` is called.
 */
import posthog from "posthog-js";

const ANON_COOKIE = "th_anon_id";
const ANON_STORAGE = "th_anon_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years

let initialized = false;

/** Provider-only signal that posthog.init has completed. */
export function markInitialized(): void {
  initialized = true;
}

/** Whether PostHog has been initialized this session. */
export function isReady(): boolean {
  return initialized;
}

/** Generate a v4 UUID. Falls back to a non-crypto path for very old browsers. */
function newUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

/**
 * Read or create the `th_anon_id`. Server-safe (returns null if no window).
 * Prefers an existing cookie (set by middleware on first request) so the
 * client and server agree on the same ID even before client JS hydrates.
 */
export function getAnonId(): string | null {
  if (typeof window === "undefined") return null;

  const fromCookie = readCookie(ANON_COOKIE);
  const fromStorage = (() => {
    try { return localStorage.getItem(ANON_STORAGE); } catch { return null; }
  })();

  const existing = fromCookie ?? fromStorage;
  if (existing) {
    if (!fromStorage) { try { localStorage.setItem(ANON_STORAGE, existing); } catch {} }
    if (!fromCookie) writeCookie(ANON_COOKIE, existing);
    return existing;
  }

  const fresh = newUuid();
  try { localStorage.setItem(ANON_STORAGE, fresh); } catch {}
  writeCookie(ANON_COOKIE, fresh);
  return fresh;
}

/**
 * Thin wrapper around `posthog.capture`. No-op if PostHog hasn't been
 * initialized yet (e.g. before the provider mounts, or when consent
 * hasn't been granted — posthog's own opt-out gate handles the latter).
 */
export function track(event: string, props?: Record<string, unknown>): void {
  if (!initialized) return;
  try {
    posthog.capture(event, props);
  } catch {
    // Analytics must never break the UI.
  }
}

/**
 * Upgrade the anonymous profile to a known user. Links prior anon
 * events via `$set_once: { th_first_anon_id }` so funnels are
 * preserved end-to-end.
 */
export function identify(email: string): void {
  if (!initialized || !email) return;
  try {
    const anonId = getAnonId();
    posthog.identify(email, { email }, anonId ? { th_first_anon_id: anonId } : undefined);
  } catch {
    // ignore
  }
}
