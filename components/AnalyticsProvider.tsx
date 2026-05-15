"use client";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, track } from "@/lib/posthog";

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
    initPostHog();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}
