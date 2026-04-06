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
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Last updated: April 5, 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>1. What Tag Hunter Is</h2>
            <p>Tag Hunter is a free hunting strategy planning tool. It provides AI-generated recommendations, estimated draw odds, estimated application deadlines, and general information about western big game hunting. Tag Hunter is built and operated by Factor21 (f21.ai).</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>2. Data Accuracy Disclaimer</h2>
            <p>All fees, draw odds, deadlines, and unit data displayed on Tag Hunter are <strong style={{ color: "var(--warning)" }}>estimates only</strong>. This data is sourced from publicly available state agency reports and historical records, and may not reflect current-year regulations, exact deadlines, or current tag fees.</p>
            <p style={{ marginTop: 10 }}>You are solely responsible for verifying all information at your state&apos;s official wildlife agency website before submitting any hunting application, paying any fees, or making any purchasing decisions based on information from Tag Hunter.</p>
            <p style={{ marginTop: 10 }}>Tag Hunter is not responsible for missed deadlines, incorrect fee payments, or failed applications caused by reliance on estimates shown in this app.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>3. AI-Generated Content</h2>
            <p>Tag Hunter uses AI (Claude by Anthropic) to generate hunt recommendations and strategy plans. AI-generated content may contain errors, outdated information, or hallucinated facts. Always treat AI output as a starting point for your own research, not as definitive advice.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>4. No Warranties</h2>
            <p>Tag Hunter is provided &quot;as is&quot; without warranties of any kind. We make no guarantees about the accuracy, completeness, or timeliness of any information. Use this app at your own risk.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>5. Acceptable Use</h2>
            <p>You may not use Tag Hunter to scrape data, abuse the AI endpoints, attempt to circumvent rate limits, or interfere with the service for other users. We reserve the right to block access to users who abuse the service.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>6. Third-Party Links</h2>
            <p>Tag Hunter links to official state wildlife agency portals and third-party tools (onX, GoHunt, SpartanForge). We are not affiliated with or endorsed by any of these organizations. Use their services under their own terms.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>7. Changes to These Terms</h2>
            <p>We may update these terms at any time. Continued use of Tag Hunter after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>8. Contact</h2>
            <p>Questions? Email <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a></p>
          </section>

        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <Link href="/privacy" style={{ fontSize: 13, color: "var(--text-3)", marginRight: 24 }}>Privacy Policy</Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-3)" }}>← Back to Tag Hunter</Link>
        </div>
      </div>
    </div>
  );
}
