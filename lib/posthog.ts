/**
 * Client-side PostHog analytics for Tag Hunter.
 *
 * Anon-first: every visitor gets a stable `th_anon_id` (UUID) the moment
 * they land — synced between localStorage and a 2-year cookie so the same
 * ID survives across sessions, devices that share a browser profile, and
 * SSR-side checks. We never send PII unless `identify(email)` is called.
 *
 * PostHog is initialized with `person_profiles: 'identified_only'` so
 * anonymous users do NOT count against the MAU quota — only people who
 * explicitly identify (e.g. join the waitlist) become identified persons.
 */
import posthog from "posthog-js";

const ANON_COOKIE = "th_anon_id";
const ANON_STORAGE = "th_anon_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years

let initialized = false;

/** Generate a v4 UUID. Falls back to a non-crypto path for very old browsers. */
function newUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC4122-ish fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Read a cookie value by name, browser-side only. */
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Write a cookie, browser-side only. SameSite=Lax, path=/, 2yr max-age. */
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

  // Cookie wins if both exist — middleware may have set it before JS booted.
  const existing = fromCookie ?? fromStorage;
  if (existing) {
    // Keep storage and cookie in sync for next time.
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
 * Idempotent PostHog init. Safe to call on every mount — the second call
 * is a no-op. Distinct ID is bootstrapped from `th_anon_id` so the very
 * first event already carries the stable anon identifier.
 */
export function initPostHog(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  if (!key) return; // no key in env -> silently skip; never break the app

  const anonId = getAnonId();

  posthog.init(key, {
    api_host: host,
    autocapture: true,
    capture_pageview: false, // we fire `page_view` ourselves on route change
    capture_pageleave: true,
    // Anon-first: only burn quota on people we have explicitly identified.
    person_profiles: "identified_only",
    bootstrap: anonId ? { distinctID: anonId } : undefined,
    persistence: "localStorage+cookie",
    disable_session_recording: true,
    loaded: (ph) => {
      if (anonId && ph.get_distinct_id() !== anonId) {
        ph.register({ th_anon_id: anonId });
      }
    },
  });

  initialized = true;
}

/** Thin wrapper. No-op if PostHog isn't initialized (e.g. missing key). */
export function track(event: string, props?: Record<string, unknown>): void {
  if (!initialized) return;
  try {
    posthog.capture(event, props);
  } catch {
    // Analytics must never break the UI.
  }
}

/**
 * Upgrade the anonymous profile to a known user. Links prior anon events
 * via `$set_once: { th_first_anon_id }` so funnels are preserved end-to-end.
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

/** Whether PostHog has been initialized this session. */
export function isReady(): boolean {
  return initialized;
}
