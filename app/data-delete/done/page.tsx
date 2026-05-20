import Link from "next/link";
import AppNav from "@/components/AppNav";

const SOIL = "#0F0D0A";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

export const metadata = { title: "Data deleted — Tag Hunter" };

export default function DataDeleteDonePage() {
  return (
    <div style={{ background: SOIL, color: BONE, minHeight: "100vh", fontFamily: "var(--font-dm-mono), monospace" }}>
      <AppNav />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px 96px" }}>
        <p style={{ color: AMBER, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>
          Done
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
          Your data has been deleted.
        </h1>
        <p style={{ color: DUST, fontSize: 15, lineHeight: 1.6, marginBottom: 32, maxWidth: 520 }}>
          Every server-side row tied to your email has been permanently removed from our database. Don&apos;t forget to clear browser storage for taghunter.us if you used any locally-saved features.
        </p>
        <Link
          href="/"
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
          Back to Tag Hunter →
        </Link>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${FENCE}`, fontSize: 13, color: DUST }}>
          <Link href="/privacy" style={{ color: AMBER }}>Privacy Policy</Link>
        </div>
      </main>
    </div>
  );
}
