import AppNav from "@/components/AppNav";
import Link from "next/link";

export const metadata = { title: "Privacy Policy — Tag Hunter" };

export default function PrivacyPage() {
  return (
    <div className="page">
      <AppNav />
      <div className="page-inner" style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Last updated: April 5, 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>

          <section>
            <div style={{
              padding: "14px 18px", borderRadius: 10, marginBottom: 20,
              background: "rgba(61,168,106,0.08)", border: "1px solid rgba(61,168,106,0.25)",
            }}>
              <p style={{ fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>🔒 The short version</p>
              <p style={{ fontSize: 13 }}>Your personal data stays on your device. We collect anonymous usage counts only. No accounts, no tracking pixels, no selling data.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>What We Store on Your Device</h2>
            <p>Tag Hunter stores the following data in your browser&apos;s <code style={{ background: "var(--bg-elevated)", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>localStorage</code> only — it never leaves your device:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li><strong style={{ color: "var(--text)" }}>Hunter Profile</strong> — name, address, DOB, hunter ed cert, state license numbers (stored under <code style={{ fontSize: 12 }}>taghunter_hunter_profile</code>)</li>
              <li><strong style={{ color: "var(--text)" }}>Application Tracker</strong> — your points, draw history, licenses (stored under <code style={{ fontSize: 12 }}>taghunter_tracker</code>)</li>
              <li><strong style={{ color: "var(--text)" }}>Saved Plans</strong> — your hunt strategies (stored under <code style={{ fontSize: 12 }}>taghunter_plans</code>)</li>
              <li><strong style={{ color: "var(--text)" }}>Chat History</strong> — your AI advisor conversations (stored under <code style={{ fontSize: 12 }}>taghunter_chat</code>)</li>
              <li><strong style={{ color: "var(--text)" }}>Deadline Reminders</strong> — application windows you&apos;ve bookmarked</li>
            </ul>
            <p style={{ marginTop: 12 }}>To delete all stored data: open your browser settings → clear site data for this domain.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>What We Collect Server-Side</h2>
            <p>When you use the AI features (Find My Hunt, AI Advisor, Build Plan), we log the following to our analytics database:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li>Which AI feature was used (strategy, find, or chat)</li>
              <li>Which species and states were in the request</li>
              <li>A <strong style={{ color: "var(--text)" }}>hashed, anonymized identifier</strong> derived from your IP address — we cannot reverse this back to your real IP. It resets daily.</li>
              <li>Timestamp of the request</li>
            </ul>
            <p style={{ marginTop: 12 }}>We do <strong style={{ color: "var(--text)" }}>not</strong> log your name, email, address, hunter education number, license numbers, SSN digits, or any personally identifying information.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>AI Requests</h2>
            <p>When you submit a prompt to the AI Advisor or generate a strategy, the content of your request is sent to Anthropic&apos;s API to generate a response. This is subject to <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>Anthropic&apos;s Privacy Policy</a>. We recommend not including sensitive personal information in chat messages.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Waitlist Email</h2>
            <p>If you join our waitlist, we store your email address in our database (Supabase) and send a confirmation via Resend. We use your email only to notify you about Tag Hunter access and major updates. We do not share or sell email addresses. You can request deletion at any time by emailing <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Cookies</h2>
            <p>Tag Hunter does not use tracking cookies or third-party analytics scripts. We use Vercel Analytics (anonymized, privacy-first) for aggregate page view counts only.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Contact</h2>
            <p>Questions about your data: <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a></p>
          </section>

        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <Link href="/terms" style={{ fontSize: 13, color: "var(--text-3)", marginRight: 24 }}>Terms of Service</Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-3)" }}>← Back to Tag Hunter</Link>
        </div>
      </div>
    </div>
  );
}
