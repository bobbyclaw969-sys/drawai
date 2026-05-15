"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { getAnonId as getPosthogAnonId } from "@/lib/posthog";

// ── Brand palette (matches homepage) ─────────────────────────────────────
const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW = "#F0A040";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

// ── Placeholder URLs — REPLACE BEFORE PROD ───────────────────────────────
// TODO(mayor): swap to real Google Business "leave a review" deeplink once
// the GBP listing is live. Format: https://g.page/r/<PLACE_ID>/review
const GOOGLE_REVIEW_URL = "https://g.page/r/PLACEHOLDER_TAGHUNTER/review";
// TODO(mayor): confirm hello@taghunter.app exists; otherwise route to team@f21.ai
const VIDEO_REVIEW_MAILTO =
  "mailto:hello@taghunter.app?subject=Video%20Review%20-%20%2450%20Gift%20Card&body=Send%20a%20short%20video%20of%20why%20you%20use%20TagHunter%20-%20we%27ll%20mail%20you%20a%20%2450%20gift%20card.%20Two%20sentences%20about%20you%20%2B%20a%20clip%20is%20plenty.";

type Step = "thumbs" | "positive" | "negative";

// ── Anon ID — reuse the canonical posthog `th_anon_id` ──────────────────
// posthog.ts manages cookie + localStorage; we just read through it so the
// same anon identifier ties feedback events to PostHog funnels.
function getAnonId(): string {
  return getPosthogAnonId() ?? "";
}

function FeedbackInner() {
  const params = useSearchParams();
  const initialStep = ((): Step => {
    const s = params.get("step");
    if (s === "2a") return "positive";
    if (s === "2b") return "negative";
    return "thumbs";
  })();
  const sourceParam = params.get("source") ?? "feedback_page";

  const [step, setStep] = useState<Step>(initialStep);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Lock body class for full-bleed editorial style
  useEffect(() => {
    document.body.classList.add("editorial");
    return () => { document.body.classList.remove("editorial"); };
  }, []);

  // Mark that the user was asked, so PostEventReviewAsk respects 7-day cooldown
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("th_review_asked", new Date().toISOString());
    } catch { /* ignore */ }
  }, []);

  const submitFeedback = async (sentiment: "positive" | "negative") => {
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anon_id: getAnonId(),
          sentiment,
          message: message.trim(),
          email: email.trim(),
          source: sourceParam,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error ?? "Couldn't send. Try again in a sec.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMsg("Network hiccup. Try again.");
      setStatus("error");
    }
  };

  return (
    <div style={{ background: SOIL, color: BONE, minHeight: "100vh", fontFamily: "var(--font-dm-mono), monospace" }}>
      <AppNav />
      <div id="main-content" />
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px 96px" }}>
        {/* ── STEP 1: thumbs ──────────────────────────────────────────── */}
        {step === "thumbs" && (
          <section>
            <p
              style={{
                color: AMBER,
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              30-Second Check-In
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                fontWeight: 900,
                fontSize: "clamp(36px, 5vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: BONE,
                marginBottom: 16,
              }}
            >
              Did TagHunter help<br />you plan your hunt?
            </h1>
            <p style={{ color: DUST, fontSize: 15, lineHeight: 1.6, marginBottom: 40, maxWidth: 480 }}>
              No spam. No follow-up unless you want one. Two clicks.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <ThumbButton emoji="👍" label="Yeah, it did" onClick={() => setStep("positive")} variant="primary" />
              <ThumbButton emoji="👎" label="Not really" onClick={() => setStep("negative")} variant="ghost" />
            </div>
          </section>
        )}

        {/* ── STEP 2A: positive — share ─────────────────────────────── */}
        {step === "positive" && status !== "sent" && (
          <section>
            <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>
              Stoked to hear it
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 4.5vw, 48px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: BONE,
                marginBottom: 16,
              }}
            >
              Awesome. Hunters trust<br />other hunters — would<br />you share this?
            </h1>
            <p style={{ color: DUST, fontSize: 15, lineHeight: 1.6, marginBottom: 36, maxWidth: 520 }}>
              Pick whichever takes the least effort. All three help us hit 5K hunters before we go talk to onX.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
              <ShareBlock
                href={GOOGLE_REVIEW_URL}
                title="Leave a Google Review"
                meta="60 seconds · public · biggest impact"
                primary
                onClick={() => {
                  // Fire-and-forget — log that a positive user clicked through
                  void fetch("/api/feedback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      anon_id: getAnonId(),
                      sentiment: "positive",
                      message: "[clicked through to Google Review]",
                      source: `${sourceParam}:google_click`,
                    }),
                  }).catch(() => {});
                }}
              />
              <ShareBlock
                href={VIDEO_REVIEW_MAILTO}
                title="Tell us why on camera"
                meta="30-sec clip · we'll mail you a $50 gift card"
              />
            </div>

            <div style={{ borderTop: `1px solid ${FENCE}`, paddingTop: 28 }}>
              <p style={{ color: DUST, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
                Or — just text us why
              </p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="What worked? What state, what species, what's the plan?"
                style={textareaStyle}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email (optional — if you want a reply)"
                style={{ ...inputStyle, marginTop: 10 }}
              />
              {status === "error" && (
                <p style={{ color: "#c25050", fontSize: 13, marginTop: 10 }}>{errorMsg}</p>
              )}
              <button
                onClick={() => submitFeedback("positive")}
                disabled={status === "sending" || message.trim().length < 5}
                style={{
                  ...primaryButtonStyle,
                  marginTop: 14,
                  opacity: (status === "sending" || message.trim().length < 5) ? 0.5 : 1,
                  cursor: (status === "sending" || message.trim().length < 5) ? "not-allowed" : "pointer",
                }}
              >
                {status === "sending" ? "Sending…" : "Send →"}
              </button>
            </div>

            <BackLink onClick={() => setStep("thumbs")} />
          </section>
        )}

        {/* ── STEP 2B: negative — fix it fast ───────────────────────── */}
        {step === "negative" && status !== "sent" && (
          <section>
            <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>
              Tell us straight
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                fontWeight: 900,
                fontSize: "clamp(36px, 5vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: BONE,
                marginBottom: 16,
              }}
            >
              What broke?<br />We fix things fast.
            </h1>
            <p style={{ color: DUST, fontSize: 15, lineHeight: 1.6, marginBottom: 28, maxWidth: 520 }}>
              Wrong odds? Wrong deadline? Slow page? Dumb copy? Mayor reads every one of these — most get fixed inside 48 hours.
            </p>

            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={6}
              maxLength={3000}
              placeholder="What happened. What state/species if it's a data thing. Be specific — vague is hard to fix."
              style={textareaStyle}
              autoFocus
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email (optional — if you want us to reply when it's fixed)"
              style={{ ...inputStyle, marginTop: 10 }}
            />
            {status === "error" && (
              <p style={{ color: "#c25050", fontSize: 13, marginTop: 10 }}>{errorMsg}</p>
            )}
            <button
              onClick={() => submitFeedback("negative")}
              disabled={status === "sending" || message.trim().length < 5}
              style={{
                ...primaryButtonStyle,
                marginTop: 18,
                opacity: (status === "sending" || message.trim().length < 5) ? 0.5 : 1,
                cursor: (status === "sending" || message.trim().length < 5) ? "not-allowed" : "pointer",
              }}
            >
              {status === "sending" ? "Sending…" : "Send it →"}
            </button>

            <BackLink onClick={() => setStep("thumbs")} />
          </section>
        )}

        {/* ── DONE state ─────────────────────────────────────────────── */}
        {status === "sent" && (
          <section style={{ paddingTop: 32 }}>
            <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
              Got it
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 4.5vw, 48px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: BONE,
                marginBottom: 16,
              }}
            >
              {step === "negative"
                ? "Thanks — Mayor will look at this today."
                : "Thanks. Means a lot."}
            </h1>
            <p style={{ color: DUST, fontSize: 15, lineHeight: 1.6, marginBottom: 32, maxWidth: 480 }}>
              {step === "negative"
                ? "If you left an email, you'll hear back when it's fixed. Otherwise it's already in the queue."
                : "Now go draw that tag."}
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                background: AMBER,
                color: SOIL,
                padding: "14px 28px",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Back to TagHunter →
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

// ── Small subcomponents ─────────────────────────────────────────────────

function ThumbButton({
  emoji,
  label,
  onClick,
  variant,
}: {
  emoji: string;
  label: string;
  onClick: () => void;
  variant: "primary" | "ghost";
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        flex: "1 1 220px",
        minHeight: 140,
        padding: "24px 28px",
        background: isPrimary ? AMBER : "transparent",
        color: isPrimary ? SOIL : BONE,
        border: isPrimary ? `1px solid ${AMBER}` : `1px solid ${FENCE}`,
        borderRadius: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: 15,
        fontWeight: 500,
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={e => {
        if (isPrimary) {
          e.currentTarget.style.background = GLOW;
        } else {
          e.currentTarget.style.borderColor = AMBER;
          e.currentTarget.style.color = AMBER;
        }
      }}
      onMouseLeave={e => {
        if (isPrimary) {
          e.currentTarget.style.background = AMBER;
        } else {
          e.currentTarget.style.borderColor = FENCE;
          e.currentTarget.style.color = BONE;
        }
      }}
    >
      <span style={{ fontSize: 40, lineHeight: 1 }}>{emoji}</span>
      <span style={{ letterSpacing: "0.05em" }}>{label}</span>
    </button>
  );
}

function ShareBlock({
  href,
  title,
  meta,
  primary = false,
  onClick,
}: {
  href: string;
  title: string;
  meta: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  const isExternalHttp = href.startsWith("http");
  return (
    <a
      href={href}
      onClick={onClick}
      target={isExternalHttp ? "_blank" : undefined}
      rel={isExternalHttp ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        background: primary ? AMBER : BARK,
        color: primary ? SOIL : BONE,
        border: `1px solid ${primary ? AMBER : FENCE}`,
        textDecoration: "none",
        fontFamily: "var(--font-dm-mono), monospace",
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={e => {
        if (primary) {
          e.currentTarget.style.background = GLOW;
        } else {
          e.currentTarget.style.borderColor = AMBER;
        }
      }}
      onMouseLeave={e => {
        if (primary) {
          e.currentTarget.style.background = AMBER;
        } else {
          e.currentTarget.style.borderColor = FENCE;
        }
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 500 }}>{title}</span>
        <span style={{ fontSize: 12, color: primary ? "rgba(15,13,10,0.7)" : DUST }}>
          {meta}
        </span>
      </div>
      <span style={{ fontSize: 20 }}>→</span>
    </a>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 32,
        background: "none",
        border: "none",
        color: DUST,
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: 12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        padding: 0,
      }}
      onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
      onMouseLeave={e => (e.currentTarget.style.color = DUST)}
    >
      ← Back
    </button>
  );
}

// ── Shared input styles ──────────────────────────────────────────────────
const textareaStyle: React.CSSProperties = {
  width: "100%",
  background: BARK,
  border: `1px solid ${FENCE}`,
  color: BONE,
  padding: "14px 16px",
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 14,
  lineHeight: 1.6,
  resize: "vertical",
  outline: "none",
  borderRadius: 0,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: BARK,
  border: `1px solid ${FENCE}`,
  color: BONE,
  padding: "12px 16px",
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 14,
  outline: "none",
  borderRadius: 0,
};

const primaryButtonStyle: React.CSSProperties = {
  background: AMBER,
  color: SOIL,
  border: "none",
  padding: "14px 28px",
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: "0.04em",
  cursor: "pointer",
  borderRadius: 0,
};

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div style={{ background: SOIL, color: DUST, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading…
      </div>
    }>
      <FeedbackInner />
    </Suspense>
  );
}
