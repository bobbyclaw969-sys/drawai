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
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Last updated: May 20, 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>

          <section>
            <div style={{
              padding: "14px 18px", borderRadius: 10, marginBottom: 20,
              background: "rgba(61,168,106,0.08)", border: "1px solid rgba(61,168,106,0.25)",
            }}>
              <p style={{ fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>🔒 The short version</p>
              <p style={{ fontSize: 13 }}>
                Most personal data stays on your device. We collect anonymous usage analytics
                (PostHog) and the email address you optionally give us for the waitlist. No ad
                pixels, no third-party trackers, no selling data. EU/EEA visitors are asked for
                analytics consent before any cookies fire. <Link href="/data-export" style={{ color: "var(--amber)" }}>Export</Link> or <Link href="/data-delete" style={{ color: "var(--amber)" }}>delete</Link> your data anytime.
              </p>
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
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Cookies & Analytics</h2>
            <p>Tag Hunter sets a small number of first-party cookies and uses one analytics product — PostHog — to understand aggregate usage:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li><strong style={{ color: "var(--text)" }}>th_anon_id</strong> — a randomly generated UUID stored in a cookie + localStorage. Lets us count unique visitors without identifying you. 2-year lifetime.</li>
              <li><strong style={{ color: "var(--text)" }}>th_consent_analytics</strong> — records whether you accepted or declined analytics. 1-year lifetime.</li>
              <li><strong style={{ color: "var(--text)" }}>PostHog cookies</strong> — session ID + distinct ID. PostHog is configured in <em>identified_only</em> mode, so anonymous visitors don&apos;t generate identified profiles. No session recording, no autocapture replays.</li>
            </ul>
            <p style={{ marginTop: 12 }}>EU/EEA visitors are asked for consent before any analytics cookies fire. Visitors elsewhere can opt out anytime by <Link href="/data-delete" style={{ color: "var(--amber)" }}>deleting their data</Link> — or by blocking cookies in their browser settings. We do not use Google Analytics, Meta Pixel, advertising trackers, or any third-party scripts not listed here.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Sub-Processors</h2>
            <p>We use the following vendors to deliver Tag Hunter. Each receives only the minimum data needed for its function:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li><strong style={{ color: "var(--text)" }}>Anthropic</strong> — AI inference (Claude). Receives the text of your AI Advisor / Find / Strategy prompts. <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>Anthropic Privacy Policy</a></li>
              <li><strong style={{ color: "var(--text)" }}>Supabase</strong> — database for waitlist, feedback, and anonymous usage events. Hosted in the US. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>Supabase Privacy</a></li>
              <li><strong style={{ color: "var(--text)" }}>Resend</strong> — sends transactional emails (waitlist confirmation, data-export, deletion-confirmation). Receives your email address only. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>Resend Privacy</a></li>
              <li><strong style={{ color: "var(--text)" }}>PostHog</strong> — anonymous product analytics. Hosted on PostHog Cloud (US). <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>PostHog Privacy</a></li>
              <li><strong style={{ color: "var(--text)" }}>Vercel</strong> — application hosting + CDN. Receives standard HTTP request data (IP, user-agent, URL) which is purged from logs within 30 days. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>Vercel Privacy</a></li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>AI Requests</h2>
            <p>When you submit a prompt to the AI Advisor or generate a strategy, the content of your request is sent to Anthropic&apos;s API to generate a response. This is subject to <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>Anthropic&apos;s Privacy Policy</a>. We recommend not including sensitive personal information in chat messages.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Waitlist & Feedback Email</h2>
            <p>If you join our waitlist or submit feedback with an email, we store that address in our Supabase database and may send confirmations via Resend. We use the address only to follow up on your specific request or to notify you about Tag Hunter access. We do not share or sell email addresses.</p>
            <p style={{ marginTop: 10 }}>Retention: waitlist entries persist until you request deletion, or until Tag Hunter shuts down. Feedback rows persist for up to 2 years for product-improvement purposes, then are deleted automatically.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Your Data Rights</h2>
            <p>Wherever you are, you have these rights — exercising them takes one click each:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li><strong style={{ color: "var(--text)" }}>Export</strong> — get a JSON of every row tied to your email. <Link href="/data-export" style={{ color: "var(--amber)" }}>→ /data-export</Link></li>
              <li><strong style={{ color: "var(--text)" }}>Delete</strong> — permanently wipe every server-side row tied to your email. <Link href="/data-delete" style={{ color: "var(--amber)" }}>→ /data-delete</Link></li>
              <li><strong style={{ color: "var(--text)" }}>Correct</strong> — email <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a> if any record is inaccurate</li>
              <li><strong style={{ color: "var(--text)" }}>Object / restrict processing</strong> — email <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a></li>
            </ul>
            <p style={{ marginTop: 12 }}>We respond to data requests within 30 days. There is no fee. We do not discriminate against users who exercise these rights.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>GDPR / EEA Visitors</h2>
            <p>If you are located in the European Economic Area, our lawful bases are:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li><strong style={{ color: "var(--text)" }}>Consent</strong> — for analytics cookies (you opt in via the banner) and for waitlist emails (you submit the form)</li>
              <li><strong style={{ color: "var(--text)" }}>Legitimate interest</strong> — for hashed-IP rate limiting and anonymous usage counts, which are necessary to keep the service running and to detect abuse</li>
            </ul>
            <p style={{ marginTop: 12 }}>You can lodge a complaint with your national data-protection authority at any time. We do not transfer data outside the US for EEA-located visitors except via our sub-processors above; each one publishes a current EU-US data-transfer mechanism.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>California Privacy Rights (CCPA / CPRA)</h2>
            <p>If you are a California resident:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li><strong style={{ color: "var(--text)" }}>Right to know</strong> — see what personal information we have collected (use <Link href="/data-export" style={{ color: "var(--amber)" }}>/data-export</Link>)</li>
              <li><strong style={{ color: "var(--text)" }}>Right to delete</strong> — request deletion (use <Link href="/data-delete" style={{ color: "var(--amber)" }}>/data-delete</Link>)</li>
              <li><strong style={{ color: "var(--text)" }}>Right to opt out of sale or sharing</strong> — we do <strong>not</strong> sell or share personal information for cross-context behavioral advertising</li>
              <li><strong style={{ color: "var(--text)" }}>Right to non-discrimination</strong> — we will not change your service or price for exercising any right</li>
            </ul>
            <p style={{ marginTop: 12 }}>In the prior 12 months we have collected: email addresses (waitlist + feedback only) and anonymous behavioral data (analytics). We have not sold personal information.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Business Transfers</h2>
            <p>If Factor21 or Tag Hunter is sold, merged, or acquired, your data may be transferred to the acquiring entity as part of that transaction. We will give you advance notice via the email you provided (or via a banner on this site), and the acquiring entity will be bound by the same protections in this Privacy Policy or by a policy at least as protective. You will retain the right to delete your data before the transfer completes.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Children</h2>
            <p>Tag Hunter is intended for adult hunters. We do not knowingly collect personal information from anyone under 16. If you believe a child has provided us with personal information, email <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a> and we will delete it.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Changes to This Policy</h2>
            <p>We may update this policy from time to time. Material changes will be announced on this page with a new &quot;Last updated&quot; date. Continued use of Tag Hunter after the update constitutes acceptance.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Contact</h2>
            <p>Data controller: Factor21, Santa Cruz, CA.</p>
            <p style={{ marginTop: 4 }}>Questions about your data: <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a></p>
          </section>

        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <Link href="/terms" style={{ fontSize: 13, color: "var(--text-3)", marginRight: 24 }}>Terms of Service</Link>
          <Link href="/data-export" style={{ fontSize: 13, color: "var(--text-3)", marginRight: 24 }}>Export My Data</Link>
          <Link href="/data-delete" style={{ fontSize: 13, color: "var(--text-3)", marginRight: 24 }}>Delete My Data</Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-3)" }}>← Back to Tag Hunter</Link>
        </div>
      </div>
    </div>
  );
}
