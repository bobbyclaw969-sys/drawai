"use client";

import { useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW = "#F0A040";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";
const SUCCESS = "#3DA86A";

const PRICE_USD = 99;
const SPOTS_CAP = 500;

const PERKS = [
  { headline: "Lifetime access — forever.", body: "Every future paid feature, every premium tier. One payment, no renewals." },
  { headline: "No AI rate limits.", body: "Unlimited Find, Chat, and Strategy calls. The free tier caps; you don't." },
  { headline: "Priority data verification.", body: "Spot a deadline or odds discrepancy → it jumps the verification queue." },
  { headline: "Hunt party sharing.", body: "Share a Hunt with up to 4 hunting partners. Sync plans, coordinate apps, split logistics." },
  { headline: "Founder line on /backers.", body: "Public, optional. Display name + state. Acquirers see the names early." },
  { headline: "Direct line to the build.", body: "Founder-only channel for feature requests. We ship what founders ask for." },
];

export default function FounderPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async () => {
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/founder/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source: "founder_page" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error ?? "Couldn't add you. Try again.");
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
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "64px 24px 96px" }}>
        <header style={{ marginBottom: 48 }}>
          <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Tag Hunter Founder · capped at {SPOTS_CAP}
          </p>
          <h1 style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 900,
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            color: BONE,
            marginBottom: 20,
          }}>
            ${PRICE_USD}.<br />Lifetime.<br />500 spots.
          </h1>
          <p style={{ color: DUST, fontSize: 17, lineHeight: 1.55, maxWidth: 600 }}>
            Tag Hunter is free forever for everyone. This is the one-time tier for the
            people who want every future premium feature, no rate limits, and a line in
            the history of how this product got built.
          </p>
        </header>

        {/* Perk grid */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 48 }}>
          {PERKS.map(p => (
            <div key={p.headline} style={{
              background: BARK,
              border: `1px solid ${FENCE}`,
              padding: "20px 22px",
            }}>
              <div style={{ color: AMBER, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
                Included
              </div>
              <div style={{
                fontFamily: "var(--font-display), serif",
                fontWeight: 700,
                fontSize: 18,
                color: BONE,
                marginBottom: 8,
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
              }}>
                {p.headline}
              </div>
              <div style={{ color: DUST, fontSize: 13, lineHeight: 1.55 }}>
                {p.body}
              </div>
            </div>
          ))}
        </section>

        {/* CTA — interest list (Stripe wired separately) */}
        <section style={{
          background: BARK,
          border: `1px solid ${AMBER}`,
          padding: "32px 28px",
          marginBottom: 32,
        }}>
          <h2 style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: "-0.015em",
            color: BONE,
            marginBottom: 12,
          }}>
            Get the first email when checkout opens.
          </h2>
          <p style={{ color: DUST, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            We&apos;re wiring Stripe Checkout now. Drop your email and you&apos;ll be the first to know — before any social announcement, before the cap closes.
          </p>

          {status !== "sent" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  flex: "1 1 220px",
                  background: SOIL,
                  border: `1px solid ${FENCE}`,
                  color: BONE,
                  padding: "14px 16px",
                  fontFamily: "inherit",
                  fontSize: 15,
                  outline: "none",
                  borderRadius: 0,
                  minWidth: 0,
                }}
              />
              <button
                onClick={submit}
                disabled={status === "sending" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
                style={{
                  background: AMBER,
                  color: SOIL,
                  border: "none",
                  padding: "14px 28px",
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                  borderRadius: 0,
                  opacity: (status === "sending" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) ? 0.5 : 1,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = GLOW)}
                onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
              >
                {status === "sending" ? "Adding…" : "Lock my spot →"}
              </button>
            </div>
          )}
          {status === "error" && (
            <p style={{ color: "#c25050", fontSize: 13, marginTop: 14 }}>{errorMsg}</p>
          )}
          {status === "sent" && (
            <div style={{
              background: SOIL,
              border: `1px solid ${SUCCESS}`,
              padding: 20,
              color: BONE,
              fontSize: 14,
              lineHeight: 1.6,
            }}>
              <span style={{ color: SUCCESS, fontWeight: 600 }}>You&apos;re on the list.</span> Check your inbox. We&apos;ll email you the second Stripe Checkout goes live — before any social announcement.
            </div>
          )}
        </section>

        <p style={{ color: DUST, fontSize: 13, lineHeight: 1.6, maxWidth: 600, marginBottom: 28 }}>
          Free Tag Hunter never goes away. The Founder tier is for hunters who want to fund the build and get every future paid feature locked in for life.
        </p>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${FENCE}`, display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13, color: DUST }}>
          <Link href="/" style={{ color: DUST }}>← Back to Tag Hunter</Link>
          <Link href="/about" style={{ color: DUST }}>Who builds this</Link>
          <Link href="/faq" style={{ color: DUST }}>FAQ</Link>
        </div>
      </main>
    </div>
  );
}
