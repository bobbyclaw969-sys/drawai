"use client";
/**
 * PostEventReviewAsk
 *
 * Small banner that asks "was this useful? 👍 👎" after a key moment (draw-odds
 * calculation, deadline alert saved, etc). Respects a 7-day cooldown stored in
 * localStorage (`th_review_asked`).
 *
 * Usage:
 *   <PostEventReviewAsk trigger={someBoolean} source="odds_page" />
 *
 * - `trigger`: when this flips to true, we evaluate the cooldown and show.
 * - `source`: tag for analytics — flows into the /feedback?source=... param.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

const ASKED_KEY = "th_review_asked";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SHOW_DELAY_MS = 800; // small delay so it doesn't feel mashed-in

function isWithinCooldown(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(ASKED_KEY);
    if (!raw) return false;
    const last = Date.parse(raw);
    if (Number.isNaN(last)) return false;
    return Date.now() - last < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markAsked(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ASKED_KEY, new Date().toISOString());
  } catch { /* ignore */ }
}

export default function PostEventReviewAsk({
  trigger,
  source,
}: {
  trigger: boolean;
  source: string;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!trigger || dismissed) return;
    if (isWithinCooldown()) return;
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [trigger, dismissed]);

  if (!visible || dismissed) return null;

  const go = (step: "2a" | "2b") => {
    markAsked();
    router.push(`/feedback?step=${step}&source=${encodeURIComponent(source)}`);
  };

  const dismiss = () => {
    // Don't fully mark asked on dismiss — just hide for this session. We want
    // users to still get the prompt on their next clear win.
    setDismissed(true);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Was this useful?"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 70,
        maxWidth: 360,
        background: BARK,
        border: `1px solid ${FENCE}`,
        borderLeft: `4px solid ${AMBER}`,
        padding: "14px 16px 14px 18px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        fontFamily: "var(--font-dm-mono), monospace",
        animation: "th-review-slidein 0.35s ease-out",
      }}
    >
      <style jsx>{`
        @keyframes th-review-slidein {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <p style={{ color: BONE, fontSize: 13, lineHeight: 1.5, margin: 0 }}>
          Was this useful?
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            color: DUST,
            fontSize: 18,
            lineHeight: 1,
            cursor: "pointer",
            padding: 0,
            marginTop: -2,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => go("2a")}
          style={{
            flex: 1,
            background: AMBER,
            color: SOIL,
            border: "none",
            padding: "10px 12px",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            borderRadius: 0,
          }}
        >
          👍 Yeah
        </button>
        <button
          onClick={() => go("2b")}
          style={{
            flex: 1,
            background: "transparent",
            color: BONE,
            border: `1px solid ${FENCE}`,
            padding: "10px 12px",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            borderRadius: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.color = AMBER; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = FENCE; e.currentTarget.style.color = BONE; }}
        >
          👎 Not really
        </button>
      </div>
    </div>
  );
}
