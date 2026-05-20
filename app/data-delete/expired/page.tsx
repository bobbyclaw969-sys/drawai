import Link from "next/link";
import AppNav from "@/components/AppNav";

const SOIL = "#0F0D0A";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

export const metadata = { title: "Link expired — Tag Hunter" };

export default function DataDeleteExpiredPage() {
  return (
    <div style={{ background: SOIL, color: BONE, minHeight: "100vh", fontFamily: "var(--font-dm-mono), monospace" }}>
      <AppNav />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px 96px" }}>
        <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>
          Link expired
        </p>
        <h1 style={{
          fontFamily: "var(--font-display), serif",
          fontWeight: 900,
          fontSize: "clamp(32px, 4.5vw, 48px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: BONE,
          marginBottom: 16,
        }}>
          That link didn&apos;t work.
        </h1>
        <p style={{ color: DUST, fontSize: 15, lineHeight: 1.6, marginBottom: 32, maxWidth: 520 }}>
          Either the link expired (links are valid for 24 hours), or it was already used. No data was deleted. Request a new one below.
        </p>
        <Link
          href="/data-delete"
          style={{
            display: "inline-block",
            background: AMBER,
            color: SOIL,
            padding: "14px 28px",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          Request a new link →
        </Link>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${FENCE}`, fontSize: 13, color: DUST }}>
          <Link href="/privacy" style={{ color: AMBER }}>Privacy Policy</Link>
          <span style={{ margin: "0 12px" }}>·</span>
          <Link href="/" style={{ color: DUST }}>← Back to Tag Hunter</Link>
        </div>
      </main>
    </div>
  );
}
