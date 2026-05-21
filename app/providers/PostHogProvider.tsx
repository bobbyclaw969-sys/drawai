"use client";

/**
 * Client-only PostHog provider.
 *
 * Initialization is **opt-out by default** — `posthog.init` runs at module
 * load but every event is queued until `posthog.opt_in_capturing()` is
 * called. Consent state lives in CookieConsent (cookie + Intl-timezone
 * heuristic): EU/EEA visitors must explicitly accept the banner, everyone
 * else is auto-opted-in on mount. The `th-consent-changed` window event
 * fired by CookieConsent flips opt-in/opt-out without a reload.
 *
 * Distinct ID is bootstrapped from the existing `th_anon_id` cookie so
 * the very first event after consent already carries the stable anon
 * identifier set by middleware on the user's first page load.
 *
 * Pageviews are captured manually on App Router pathname/search-param
 * changes because Next.js App Router does not trigger a full page reload
 * between routes — `capture_pageview: false` disables PostHog's default.
 */
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CookieConsent, { getAnalyticsConsent } from "@/components/CookieConsent";
import { getAnonId, markInitialized } from "@/lib/posthog";

if (typeof window !== "undefined") {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (key && !posthog.__loaded) {
    const anonId = getAnonId();
    posthog.init(key, {
      api_host: host,
      autocapture: true,
      capture_pageview: false,
      capture_pageleave: true,
      // GDPR-friendly: anonymous visitors never become identified persons
      // (and never count toward MAU). identify() is what flips this on.
      person_profiles: "identified_only",
      // Hard gate: nothing fires until opt_in_capturing() is called.
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
      bootstrap: anonId ? { distinctID: anonId } : undefined,
      persistence: "localStorage+cookie",
      disable_session_recording: true,
      loaded: (ph) => {
        markInitialized();
        if (anonId && ph.get_distinct_id() !== anonId) {
          ph.register({ th_anon_id: anonId });
        }
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  }
}

function applyConsent(allowed: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (allowed) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  } catch {
    // never break the UI on analytics errors
  }
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!ph || !pathname) return;
    if (typeof window === "undefined") return;
    const qs = searchParams?.toString();
    const url = qs ? `${window.location.origin}${pathname}?${qs}` : `${window.location.origin}${pathname}`;
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Resolve consent on mount and flip the PostHog opt-state to match.
    applyConsent(getAnalyticsConsent());

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ analytics?: boolean }>).detail;
      applyConsent(!!detail?.analytics);
    };
    window.addEventListener("th-consent-changed", onConsent as EventListener);
    return () => window.removeEventListener("th-consent-changed", onConsent as EventListener);
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
      <CookieConsent />
    </PHProvider>
  );
}
