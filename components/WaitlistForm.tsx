"use client";
import { useState } from "react";

export default function WaitlistForm({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "already" | "error">("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? "Something went wrong."); setState("error"); return; }
      if (data.alreadyRegistered) { setState("already"); return; }
      setPosition(data.position);
      setState("done");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: "12px 20px", borderRadius: 10,
        background: "rgba(61,168,106,0.12)", border: "1px solid rgba(61,168,106,0.3)",
      }}>
        <span style={{ fontSize: "1.2rem" }}>✓</span>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, color: "var(--success)" }}>
            You&apos;re #{position} on the list!
          </p>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>Check your email for confirmation.</p>
        </div>
      </div>
    );
  }

  if (state === "already") {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: "12px 20px", borderRadius: 10,
        background: "rgba(61,168,106,0.08)", border: "1px solid rgba(61,168,106,0.2)",
      }}>
        <span style={{ fontSize: "1.2rem" }}>✓</span>
        <p style={{ fontSize: 14, color: "var(--success)" }}>You&apos;re already on the list.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={state === "loading"}
        style={{
          padding: "11px 16px",
          borderRadius: 6,
          border: state === "error" ? "1px solid var(--danger)" : "1px solid var(--border-2)",
          background: "rgba(255,255,255,0.05)",
          color: "var(--text)",
          fontSize: 14,
          outline: "none",
          minWidth: 220,
          fontFamily: "inherit",
        }}
      />
      <button
        type="submit"
        disabled={state === "loading" || !email.trim()}
        className="btn-primary"
        style={{ padding: "11px 24px", fontSize: 14, opacity: state === "loading" ? 0.7 : 1 }}
      >
        {state === "loading" ? "Joining..." : "Join Waitlist →"}
      </button>
      {state === "error" && (
        <p style={{ width: "100%", textAlign: "center", fontSize: 12, color: "var(--danger)", marginTop: 4 }}>
          {errorMsg}
        </p>
      )}
    </form>
  );
}
