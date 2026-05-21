"use client";
import { useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { track } from "@/lib/posthog";

const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW = "#F0A040";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

export default function DataExportPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async () => {
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/data-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error ?? "Couldn't process the request. Try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      track("data_export_requested", { surface: "data_export_page" });
    } catch {
      setErrorMsg("Network hiccup. Try again.");
      setStatus("error");
    }
  };

  return (
    <div style={{ background: SOIL, color: BONE, minHeight: "100vh", fontFamily: "var(--font-dm-mono), monospace" }}>
      <AppNav />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px 96px" }}>
        <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>
          Export my data
        </p>
        <h1 style={{
          fontFamily: "var(--font-display), serif",
          fontWeight: 900,
          fontSize: "clamp(32px, 4.5vw, 48px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: BONE,
          marginBottom: 16,
        }}>
          Get a copy of your data.
        </h1>
        <p style={{ color: DUST, fontSize: 15, lineHeight: 1.6, marginBottom: 28, maxWidth: 520 }}>
          Enter the email you signed up with. We&apos;ll email a JSON dump of every row tied to your address — waitlist entry, feedback, review timestamps. Browser-side data (saved plans, hunter profile) lives only on your device.
        </p>

        {status !== "sent" && (
          <>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              style={{
                width: "100%",
                background: BARK,
                border: `1px solid ${FENCE}`,
                color: BONE,
                padding: "14px 16px",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 15,
                outline: "none",
                borderRadius: 0,
                marginBottom: 14,
              }}
            />
            {status === "error" && (
              <p style={{ color: "#c25050", fontSize: 13, marginTop: 4, marginBottom: 12 }}>{errorMsg}</p>
            )}
            <button
              onClick={submit}
              disabled={status === "sending" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
              style={{
                background: AMBER,
                color: SOIL,
                border: "none",
                padding: "14px 28px",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.04em",
                cursor: status === "sending" ? "not-allowed" : "pointer",
                borderRadius: 0,
                opacity: (status === "sending" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) ? 0.5 : 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = GLOW)}
              onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
            >
              {status === "sending" ? "Sending…" : "Email me my data →"}
            </button>
          </>
        )}

        {status === "sent" && (
          <div style={{ background: BARK, border: `1px solid ${FENCE}`, padding: 24 }}>
            <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              Check your inbox
            </p>
            <p style={{ color: BONE, fontSize: 15, lineHeight: 1.6 }}>
              If that email is on file, a data export has been sent.
            </p>
          </div>
        )}

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${FENCE}`, fontSize: 13, color: DUST }}>
          <p style={{ marginBottom: 8 }}>
            Want to delete your data instead? <Link href="/data-delete" style={{ color: AMBER }}>Delete my data</Link>.
          </p>
          <p>
            <Link href="/privacy" style={{ color: AMBER }}>Privacy Policy</Link>
            <span style={{ margin: "0 12px" }}>·</span>
            <Link href="/" style={{ color: DUST }}>← Back to Tag Hunter</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
