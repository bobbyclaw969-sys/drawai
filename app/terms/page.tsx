import AppNav from "@/components/AppNav";
import Link from "next/link";

export const metadata = { title: "Terms of Service — Tag Hunter" };

export default function TermsPage() {
  return (
    <div className="page">
      <AppNav />
      <div className="page-inner" style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Last updated: May 20, 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>1. What Tag Hunter Is</h2>
            <p>Tag Hunter is a free hunting strategy planning tool. It provides AI-generated recommendations, estimated draw odds, estimated application deadlines, and general information about western big game hunting. Tag Hunter is built and operated by Factor21 (f21.ai), Santa Cruz, CA.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>2. Data Accuracy Disclaimer</h2>
            <p>All fees, draw odds, deadlines, and unit data displayed on Tag Hunter are <strong style={{ color: "var(--warning)" }}>estimates</strong>. Where a row is marked &quot;verified&quot; with a source link, it has been cross-checked by our team against an official state-agency document — but no guarantee is made that the data has not changed since verification.</p>
            <p style={{ marginTop: 10 }}>You are solely responsible for verifying all information at your state&apos;s official wildlife agency website before submitting any hunting application, paying any fees, or making any purchasing decisions based on information from Tag Hunter.</p>
            <p style={{ marginTop: 10 }}>Tag Hunter is not responsible for missed deadlines, incorrect fee payments, or failed applications caused by reliance on information shown in this app.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>3. AI-Generated Content</h2>
            <p>Tag Hunter uses AI (Claude by Anthropic) to generate hunt recommendations and strategy plans. AI-generated content may contain errors, outdated information, or hallucinated facts. Always treat AI output as a starting point for your own research, not as definitive advice.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>4. No Warranties</h2>
            <p>Tag Hunter is provided &quot;as is&quot; without warranties of any kind, express or implied. We make no guarantees about the accuracy, completeness, timeliness, or fitness for any particular purpose of any information provided. Use this app at your own risk.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>5. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Factor21 and Tag Hunter shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to missed hunts, forfeited application fees, lost points, or lost wages — arising out of or relating to your use of Tag Hunter.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>6. Acceptable Use</h2>
            <p>You may not use Tag Hunter to scrape data, abuse the AI endpoints, attempt to circumvent rate limits, attempt to inject prompts that bypass safety rules, or interfere with the service for other users. We reserve the right to block access to users who abuse the service.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>7. Your Data Rights</h2>
            <p>You can export or delete your data at any time:</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li><Link href="/data-export" style={{ color: "var(--amber)" }}>/data-export</Link> — JSON export of every server-side row tied to your email</li>
              <li><Link href="/data-delete" style={{ color: "var(--amber)" }}>/data-delete</Link> — one-click confirmation flow to permanently delete your data</li>
            </ul>
            <p style={{ marginTop: 12 }}>For full details on what we collect and why, see the <Link href="/privacy" style={{ color: "var(--amber)" }}>Privacy Policy</Link>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>8. Third-Party Links</h2>
            <p>Tag Hunter links to official state wildlife agency portals and third-party tools (onX, GoHunt, SpartanForge). We are not affiliated with or endorsed by any of these organizations. Use their services under their own terms.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>9. Business Transfers</h2>
            <p>In the event of a merger, acquisition, sale of all or substantially all of Factor21&apos;s or Tag Hunter&apos;s assets, financing, or similar corporate transaction, the data and accounts associated with Tag Hunter may be transferred to the acquiring or surviving entity. The acquiring entity will be required to honor commitments made in the Privacy Policy in effect at the time of transfer, or to give you advance notice and an opportunity to delete your data before any change in protections.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>10. Termination</h2>
            <p>We may suspend or terminate your access to Tag Hunter at any time, for any reason, including violation of these terms. Sections that by their nature should survive termination (e.g. limitation of liability, governing law) will survive.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>11. Governing Law</h2>
            <p>These terms are governed by the laws of the State of California, without regard to its conflict-of-laws principles. Any dispute will be resolved exclusively in the state or federal courts located in Santa Cruz County, California.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>12. Changes to These Terms</h2>
            <p>We may update these terms at any time. Material changes will be announced on this page with a new &quot;Last updated&quot; date. Continued use of Tag Hunter after the update constitutes acceptance.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>13. Contact</h2>
            <p>Questions? Email <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a></p>
          </section>

        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <Link href="/privacy" style={{ fontSize: 13, color: "var(--text-3)", marginRight: 24 }}>Privacy Policy</Link>
          <Link href="/data-export" style={{ fontSize: 13, color: "var(--text-3)", marginRight: 24 }}>Export My Data</Link>
          <Link href="/data-delete" style={{ fontSize: 13, color: "var(--text-3)", marginRight: 24 }}>Delete My Data</Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-3)" }}>← Back to Tag Hunter</Link>
        </div>
      </div>
    </div>
  );
}
