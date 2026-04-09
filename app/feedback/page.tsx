"use client";
import { useState } from "react";
import AppNav from "@/components/AppNav";
import Link from "next/link";

const CATEGORIES = [
  { value: "general", label: "General Feedback" },
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "data", label: "Data Issue (wrong odds, fees, deadlines)" },
];

export default function FeedbackPage() {
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 5) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message: message.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner" style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8 }}>
            Send Feedback
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
            Found a bug? Wrong data? Have an idea? We read every message.
          </p>
        </div>

        {status === "sent" ? (
          <div className="card fade-in" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>✓</div>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "var(--success)" }}>
              Thanks for your feedback!
            </p>
            <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 24 }}>
              We appreciate you taking the time. If you left an email, we may follow up.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => { setStatus("idle"); setMessage(""); setEmail(""); }}
                className="btn-ghost"
              >
                Send Another
              </button>
              <Link href="/" className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }}>
                Back to Tag Hunter
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ padding: 28 }}>
            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <label className="field-label">Category</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIES.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className="pill-btn"
                    style={category === c.value ? {
                      background: "var(--amber)",
                      borderColor: "var(--amber)",
                      color: "var(--text-inv)",
                    } : undefined}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 20 }}>
              <label className="field-label">
                Message <span className="req">*</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                className="input"
                placeholder={
                  category === "bug"
                    ? "What happened? What did you expect to happen?"
                    : category === "data"
                    ? "Which state/species has wrong data? What should it be?"
                    : category === "feature"
                    ? "What would make Tag Hunter more useful for you?"
                    : "What's on your mind?"
                }
                required
                minLength={5}
                maxLength={5000}
              />
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4, textAlign: "right" }}>
                {message.length}/5000
              </div>
            </div>

            {/* Email (optional) */}
            <div style={{ marginBottom: 24 }}>
              <label className="field-label">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="If you'd like a response"
              />
            </div>

            {status === "error" && (
              <div className="alert alert-danger" style={{ marginBottom: 16 }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending" || message.trim().length < 5}
              className="btn-primary"
              style={{ width: "100%", padding: "12px 24px" }}
            >
              {status === "sending" ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>
            You can also email us directly at{" "}
            <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a>
          </p>
        </div>
      </div>
    </div>
  );
}
