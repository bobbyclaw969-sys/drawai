import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const SOIL = "#0F0D0A";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

const HERO_ALT =
  "Bowhunter's shadow on a dirt trail in western pine forest, compound bow on shoulder";

export const metadata: Metadata = {
  title: "About — Taghunter",
  description:
    "Taghunter is an independent draw strategy tool built by a bowhunter and software engineer. No magazine upsell. No content paywall. Just the math.",
  openGraph: {
    title: "About — Taghunter",
    description:
      "Taghunter is an independent draw strategy tool built by a bowhunter and software engineer. No magazine upsell. No content paywall. Just the math.",
    url: "https://taghunter.us/about",
    siteName: "Taghunter",
    type: "website",
    images: [
      {
        url: "https://taghunter.us/about/founder-shadow-og.jpg",
        width: 1200,
        height: 630,
        alt: "Bowhunter's shadow on a dirt trail in western pine forest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Taghunter",
    description:
      "Taghunter is an independent draw strategy tool built by a bowhunter and software engineer.",
    images: ["https://taghunter.us/about/founder-shadow-og.jpg"],
  },
};

const display: React.CSSProperties = { fontFamily: "var(--font-display), Georgia, serif" };
const mono: React.CSSProperties = { fontFamily: "var(--font-dm-mono), monospace" };

export default function AboutPage() {
  return (
    <div style={{ background: SOIL, color: BONE, minHeight: "100vh", ...mono }}>
      <AppNav />

      <article>
        {/* ── Hero photo — full-width container, vertical aspect preserved ── */}
        <header style={{ padding: "0 24px", marginTop: 24, marginBottom: 40 }}>
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              position: "relative",
              aspectRatio: "3 / 4",
              background: "#000",
              overflow: "hidden",
            }}
          >
            <Image
              src="/about/founder-shadow.jpg"
              alt={HERO_ALT}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 720px"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <p
            style={{
              ...mono,
              maxWidth: 720,
              margin: "12px auto 0",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: DUST,
              textAlign: "center",
            }}
          >
            End of a glassing day. Western U.S., 2025.
          </p>
        </header>

        {/* ── Body — magazine reading column ────────────────────────────── */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 96px" }}>
          <h1
            style={{
              ...display,
              fontWeight: 900,
              fontSize: "clamp(40px, 5.5vw, 64px)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: BONE,
              marginTop: 24,
              marginBottom: 36,
            }}
          >
            Why Taghunter exists
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              fontSize: 17,
              lineHeight: 1.7,
              color: BONE,
            }}
          >
            <p>
              I picked up a bow five years ago and spent my first elk seasons in Idaho when nonresident OTC was still easy — show up, buy a tag, go hunt. That window closed fast. By the time I wanted to hunt elk every year, I was deep in the draw game across half a dozen western states, and I quickly realized the system was designed to keep casual hunters confused. Different deadlines, different point structures, different odds tables buried in PDFs the state agencies seem to update at random. I&apos;d spend the off-season with a spreadsheet, a stack of regulation packets, and too much coffee, trying to figure out where my points actually went the furthest. The existing tools either cost more than my tag budget or buried the math behind a content paywall — articles about strategy when what I needed was the numbers.
            </p>
            <p>
              So I built Taghunter. First for me, then for a couple of hunting buddies, then for anyone who&apos;s sat at the kitchen table in February staring at a deadline and wondering whether this is the year to burn points or save them. I&apos;m a software engineer who hunts elk across the West — not a celebrity, not a YouTuber, not selling hats. The site stays anonymous on purpose. Partly because I want the product to be the thing you trust, not the personality behind it. Partly because the western draw game is competitive enough without putting my hunting spots one Google search away. If you&apos;ve ever wanted a draw strategy tool built by someone who&apos;s actually drawing tags every year — and has to live with their own bad point strategy when it goes sideways — you&apos;re in the right place.
            </p>
          </div>

          {/* Subtle section break — matches sitewide editorial style */}
          <div style={{ marginTop: 56, marginBottom: 40, borderTop: `1px solid ${FENCE}` }} />

          <h2
            style={{
              ...display,
              fontWeight: 900,
              fontSize: "clamp(28px, 3.5vw, 36px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: BONE,
              marginBottom: 24,
            }}
          >
            What you&apos;ll find here
          </h2>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              fontSize: 16,
              lineHeight: 1.6,
              color: BONE,
            }}
          >
            {[
              "Draw odds and point projections for every western state",
              "The Optimizer: budget-aware tag strategy across multi-year point arcs",
              "No magazine upsell, no content paywall — just the math",
            ].map(item => (
              <li
                key={item}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                }}
              >
                <span style={{ color: AMBER, ...mono, fontSize: 13, flexShrink: 0 }}>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 48 }}>
            <Link
              href="/optimizer"
              className="hover:bg-[#F0A040] focus-visible:bg-[#F0A040] transition-colors duration-150"
              style={{
                background: AMBER,
                color: SOIL,
                ...mono,
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: "0.04em",
                padding: "0 28px",
                height: 48,
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              Run the Optimizer →
            </Link>
          </div>

          <div
            style={{
              marginTop: 64,
              paddingTop: 24,
              borderTop: `1px solid ${FENCE}`,
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              fontSize: 13,
              color: DUST,
            }}
          >
            <Link href="/faq" style={{ color: DUST }}>FAQ</Link>
            <Link href="/terms" style={{ color: DUST }}>Terms</Link>
            <Link href="/privacy" style={{ color: DUST }}>Privacy</Link>
            <Link href="/" style={{ color: DUST }}>← Back to Taghunter</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
