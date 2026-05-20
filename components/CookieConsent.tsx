"use client";

/**
 * Cookie consent banner — gates PostHog analytics for EU/EEA traffic.
 *
 * Strategy: opt-in for likely EU/EEA visitors (detected via Intl timezone),
 * opt-out for the rest of the world. PostHog is initialized lazily by
 * AnalyticsProvider only after `getAnalyticsConsent()` returns true. The
 * banner sets one of `th_consent_analytics=1|0` cookies and dispatches a
 * window event so the provider can wire PostHog without a full reload.
 *
 * No third-party geo-IP call — the timezone heuristic is good enough for
 * a Phase-1 cookie banner. False positives (US visitor with EU timezone
 * set) just see the banner; false negatives (EU visitor with a US VPN +
 * spoofed timezone) get default-allow, which is no worse than the
 * pre-banner state. PostHog cookies + identify-only persons mean we
 * never write a PII row before consent.
 */
import { useEffect, useState } from "react";

const CONSENT_COOKIE = "th_consent_analytics";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

const EU_EEA_TIMEZONES = [
  "Europe/", "Atlantic/Reykjavik", "Atlantic/Faroe", "Atlantic/Madeira",
  "Atlantic/Azores", "Atlantic/Canary",
];

/** True if the browser's timezone is plausibly in the EU/EEA. */
function isLikelyEU(): boolean {
  if (typeof Intl === "undefined") return false;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return EU_EEA_TIMEZONES.some(prefix => tz.startsWith(prefix));
  } catch {
    return false;
  }
}

/** Module-level read for AnalyticsProvider. */
export function getAnalyticsConsent(): boolean {
  // Anywhere outside EU/EEA gets analytics by default (CCPA opt-out applies
  // separately via /data-delete). EU/EEA visitors require explicit opt-in.
  const consent = readCookie(CONSENT_COOKIE);
  if (consent === "1") return true;
  if (consent === "0") return false;
  return !isLikelyEU();
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = readCookie(CONSENT_COOKIE);
    if (stored === "1" || stored === "0") return; // already decided
    if (isLikelyEU()) setShow(true);
  }, []);

  if (!show) return null;

  const accept = () => {
    writeCookie(CONSENT_COOKIE, "1");
    setShow(false);
    window.dispatchEvent(new CustomEvent("th-consent-changed", { detail: { analytics: true } }));
  };

  const decline = () => {
    writeCookie(CONSENT_COOKIE, "0");
    setShow(false);
    window.dispatchEvent(new CustomEvent("th-consent-changed", { detail: { analytics: false } }));
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 720,
        margin: "0 auto",
        background: "#1A1712",
        border: "1px solid #2E2A24",
        padding: "16px 20px",
        borderRadius: 8,
        zIndex: 9999,
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: 13,
        color: "#E8DFC8",
        lineHeight: 1.5,
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ flex: "1 1 280px", minWidth: 0 }}>
        Tag Hunter uses PostHog for anonymous analytics (no PII, no ads, no third-party trackers).{" "}
        <a href="/privacy" style={{ color: "#D4852A", textDecoration: "underline" }}>
          Read the policy
        </a>
        .
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            background: "transparent",
            color: "#7A6E5F",
            border: "1px solid #2E2A24",
            padding: "8px 16px",
            fontFamily: "inherit",
            fontSize: 12,
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          Essential only
        </button>
        <button
          onClick={accept}
          style={{
            background: "#D4852A",
            color: "#0F0D0A",
            border: "none",
            padding: "8px 16px",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          Accept analytics
        </button>
      </div>
    </div>
  );
}
