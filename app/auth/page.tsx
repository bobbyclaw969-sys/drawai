"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import AppNav from "@/components/AppNav";
import { createClient } from "@/lib/supabase/client";

function AuthPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  // If already logged in, redirect home
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/");
    });
  }, []);

  const hasError = searchParams.get("error");

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setState("error");
    } else {
      setState("sent");
    }
  };

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner" style={{ maxWidth: 400, paddingTop: 64 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", marginBottom: 8 }}>
            Sign in to Tag Hunter
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.5 }}>
            Save your plans across devices, get deadline reminders,
            and never lose your strategy.
          </p>
        </div>

        {state === "sent" ? (
          <div style={{
            padding: "28px 24px", borderRadius: 12, textAlign: "center",
            background: "rgba(61,168,106,0.08)", border: "1px solid rgba(61,168,106,0.25)",
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
            <p style={{ fontWeight: 700, color: "var(--success)", marginBottom: 8 }}>Check your email</p>
            <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6 }}>
              We sent a sign-in link to <strong style={{ color: "var(--text)" }}>{email}</strong>.
              Click it to finish signing in — no password needed.
            </p>
            <button
              onClick={() => setState("idle")}
              style={{ marginTop: 20, fontSize: 12, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            {hasError && (
              <div style={{
                padding: "12px 16px", borderRadius: 8, marginBottom: 20,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                fontSize: 13, color: "var(--danger)", textAlign: "center",
              }}>
                Sign-in link expired or invalid. Please try again.
              </div>
            )}

            {/* Magic link form */}
            <form onSubmit={sendMagicLink}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={state === "loading"}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 8, marginBottom: 12,
                  border: state === "error" ? "1px solid var(--danger)" : "1px solid var(--border-2)",
                  background: "rgba(255,255,255,0.05)", color: "var(--text)",
                  fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
              {state === "error" && (
                <p style={{ fontSize: 12, color: "var(--danger)", marginBottom: 10, marginTop: -4 }}>
                  {errorMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={state === "loading" || !email.trim()}
                className="btn-primary"
                style={{ width: "100%", padding: "12px", fontSize: 14, opacity: state === "loading" ? 0.7 : 1 }}
              >
                {state === "loading" ? "Sending..." : "Send Magic Link →"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 24, lineHeight: 1.6 }}>
              No password. No spam. We&apos;ll only email you sign-in links
              and (optional) deadline reminders.
            </p>
          </>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 32 }}>
          Don&apos;t want an account?{" "}
          <a href="/" style={{ color: "var(--amber)" }}>
            Use Tag Hunter without signing in →
          </a>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <AuthPageInner />
    </Suspense>
  );
}
