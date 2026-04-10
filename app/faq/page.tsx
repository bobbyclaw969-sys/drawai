import AppNav from "@/components/AppNav";
import Link from "next/link";

export const metadata = { title: "FAQ — Tag Hunter" };

const FAQS = [
  {
    q: "Is Tag Hunter really free?",
    a: "Yes. Tag Hunter is 100% free — no credit card, no hidden fees, no premium tier. We built it because we believe every hunter deserves access to the same strategy information that consultants charge $500/year for.",
  },
  {
    q: "How accurate is the data?",
    a: "All draw odds, fees, and deadlines are manually researched from official state wildlife agency sources and verified each season. However, regulations and fees change annually — always confirm the exact deadline and fee at your state's official wildlife agency website before submitting any application. Each deadline row shows a verified stamp and direct source link when confirmed.",
  },
  {
    q: "Does the AI make mistakes?",
    a: "Yes, it can. Tag Hunter uses Claude (by Anthropic) to generate personalized hunt strategies. AI-generated content may occasionally contain errors or outdated information. Treat recommendations as a well-informed starting point, not as gospel. When in doubt, cross-reference with official state resources.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. All core features work without an account. You can optionally sign in via Google or magic link to sync your data across devices, but it's not required. Your hunter profile, tracked applications, and chat history are stored locally in your browser by default.",
  },
  {
    q: "What states does Tag Hunter cover?",
    a: "We cover 25+ states with a focus on the major western big game states: Wyoming, Colorado, Montana, Idaho, Utah, Arizona, New Mexico, Nevada, Oregon, and Washington. Midwest and eastern states are included with more limited data.",
  },
  {
    q: "What species are supported?",
    a: "Elk, mule deer, whitetail deer, pronghorn, bighorn sheep, mountain goat, moose, black bear, and bison. We cover both rifle and archery seasons where applicable.",
  },
  {
    q: "Where is my data stored?",
    a: "Your personal data (hunter profile, applications, chat history) is stored in your browser's localStorage — it never leaves your device. If you join the waitlist, your email is stored in our database (Supabase). We collect only anonymous, aggregated usage analytics.",
  },
  {
    q: "Can I use Tag Hunter on my phone?",
    a: "Yes. Tag Hunter is a responsive web app that works on any modern browser. You can also add it to your home screen as a Progressive Web App (PWA) for an app-like experience.",
  },
  {
    q: "How is this different from GoHunt or onX?",
    a: "Tag Hunter is a strategy layer, not a mapping or data-lookup tool. We use AI to build personalized multi-year hunt plans based on your points, budget, and goals. GoHunt and onX are excellent for unit research and in-field navigation — we recommend using them alongside Tag Hunter.",
  },
  {
    q: "Who built Tag Hunter?",
    a: "Tag Hunter is built by Factor21, a small team of hunters and technologists. We got tired of the information gap between hunters who can afford $500/year consultants and those who can't.",
  },
  {
    q: "Will my data be sold or shared?",
    a: "No. We don't sell data, run third-party tracking pixels, or share information with advertisers. Our analytics are anonymized and privacy-first. See our Privacy Policy for full details.",
  },
  {
    q: "How do I delete my data?",
    a: "For browser data: clear your site data in browser settings. For waitlist email: send a deletion request to team@f21.ai and we'll remove it within 48 hours.",
  },
];

export default function FAQPage() {
  return (
    <div className="page">
      <AppNav />
      <div className="page-inner" style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>
            Everything you need to know about Tag Hunter.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {FAQS.map((faq, i) => (
            <details
              key={i}
              style={{
                borderBottom: "1px solid var(--border)",
                padding: "0",
              }}
            >
              <summary
                style={{
                  padding: "18px 0",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text)",
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {faq.q}
                <span style={{ color: "var(--text-3)", fontSize: 18, flexShrink: 0 }}>+</span>
              </summary>
              <p style={{
                fontSize: 14,
                color: "var(--text-2)",
                lineHeight: 1.8,
                paddingBottom: 18,
                paddingRight: 24,
              }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 16 }}>
            Still have questions? Email us at{" "}
            <a href="mailto:team@f21.ai" style={{ color: "var(--amber)" }}>team@f21.ai</a>
          </p>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-3)" }}>
            &larr; Back to Tag Hunter
          </Link>
        </div>
      </div>
    </div>
  );
}
