import AppNav from "@/components/AppNav";
import Link from "next/link";

export const metadata = {
  title: "About — Tag Hunter",
  description: "Tag Hunter is a free AI-powered hunting strategy platform built by Factor21.",
};

export default function AboutPage() {
  return (
    <div className="page">
      <AppNav />
      <div className="page-inner" style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8 }}>
            About Tag Hunter
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>The Problem</h2>
            <p>
              Western big game hunting is one of the most rewarding outdoor experiences in North America. It&apos;s also one of the most confusing to navigate.
            </p>
            <p style={{ marginTop: 12 }}>
              Every state runs its own draw system — preference points, bonus points, weighted lotteries, OTC tags, non-resident quotas. Fees vary by hundreds of dollars. Deadlines are scattered across the calendar. A single missed application or misunderstood point system can cost you a decade of progress.
            </p>
            <p style={{ marginTop: 12 }}>
              Hunters who can afford $300-500/year consultants get personalized strategies. Everyone else is left piecing it together from forum posts, YouTube videos, and state agency PDFs.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Our Solution</h2>
            <p>
              Tag Hunter uses AI to give every hunter the same quality of personalized, multi-state draw strategy that used to be reserved for those who could afford a professional consultant.
            </p>
            <p style={{ marginTop: 12 }}>
              Tell us your target species, budget, point balances, and goals. We&apos;ll build you a year-by-year strategy with specific units, realistic draw odds, application deadlines, and fee breakdowns — all for free.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>What We Believe</h2>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong style={{ color: "var(--text)" }}>Honesty over hype.</strong> If your draw odds are 2%, we say 2%. We don&apos;t sugarcoat to keep you engaged.</li>
              <li><strong style={{ color: "var(--text)" }}>Specificity over vagueness.</strong> &quot;Wyoming Unit 7 held 350-class bulls last fall&quot; beats &quot;Wyoming has good elk.&quot;</li>
              <li><strong style={{ color: "var(--text)" }}>Free access to information.</strong> Draw strategy shouldn&apos;t cost $500/year. The data is public — the strategy layer should be too.</li>
              <li><strong style={{ color: "var(--text)" }}>Privacy by default.</strong> Your hunter profile stays on your device. We don&apos;t track, sell, or share your data.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Built by Factor21</h2>
            <p>
              Tag Hunter is built and maintained by <a href="https://f21.ai" style={{ color: "var(--amber)" }}>Factor21</a> (f21.ai), an AI technology company based in Santa Cruz, California. We build tools that close information gaps — Tag Hunter is our answer to the $500/year consultant problem in western big game hunting.
            </p>
            <p style={{ marginTop: 12 }}>
              Tag Hunter is actively maintained. Deadline data is manually verified each season against official state agency sources. If you find an error, use the <a href="/feedback" style={{ color: "var(--amber)" }}>Feedback</a> link — we fix data issues within 24 hours.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Important Disclaimers</h2>
            <p>
              Tag Hunter is a planning tool, not an official state resource. All draw odds, fees, and deadlines are estimates sourced from public data. Always verify information at your state&apos;s official wildlife agency before submitting applications or paying fees.
            </p>
            <p style={{ marginTop: 12 }}>
              AI-generated recommendations may contain errors. Use Tag Hunter as a starting point for your own research — not as the final word.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Contact</h2>
            <p>
              Questions, feedback, or partnership inquiries:{" "}
              <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a>
            </p>
          </section>

        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", gap: 24, flexWrap: "wrap" }}>
          <Link href="/faq" style={{ fontSize: 13, color: "var(--text-3)" }}>FAQ</Link>
          <Link href="/terms" style={{ fontSize: 13, color: "var(--text-3)" }}>Terms</Link>
          <Link href="/privacy" style={{ fontSize: 13, color: "var(--text-3)" }}>Privacy</Link>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-3)" }}>&larr; Back to Tag Hunter</Link>
        </div>
      </div>
    </div>
  );
}
