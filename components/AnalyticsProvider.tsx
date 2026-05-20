"use client";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, track } from "@/lib/posthog";
import CookieConsent, { getAnalyticsConsent } from "@/components/CookieConsent";

/** Inner component that uses useSearchParams — wrapped in Suspense because
 *  Next 16 requires any consumer of useSearchParams to be suspended.        */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    track("page_view", {
      path: pathname,
      url: qs ? `${pathname}?${qs}` : pathname,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (getAnalyticsConsent()) initPostHog();

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ analytics?: boolean }>).detail;
      if (detail?.analytics) initPostHog();
    };
    window.addEventListener("th-consent-changed", onConsent as EventListener);
    return () => window.removeEventListener("th-consent-changed", onConsent as EventListener);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
      <CookieConsent />
    </>
  );
}
