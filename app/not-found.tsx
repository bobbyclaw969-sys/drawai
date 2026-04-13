import Link from "next/link";
import AppNav from "@/components/AppNav";

const SOIL = "#0F0D0A";
const AMBER = "#D4852A";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";
const DISPLAY = "var(--font-display), Georgia, serif";
const MONO = "var(--font-dm-mono), monospace";

export const metadata = { title: "404 — Tag Hunter" };

export default function NotFound() {
  return (
    <div style={{ background: SOIL, color: BONE, minHeight: "100vh", fontFamily: MONO }}>
      <AppNav />
      <main style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "128px 24px 80px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: MONO,
          fontSize: 11,
          color: AMBER,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
        }}>
          404 · Page Not Found
        </p>

        <h1 style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(40px, 7vw, 52px)",
          fontWeight: 700,
          color: BONE,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          marginTop: 16,
        }}>
          Wrong unit.
        </h1>

        <p style={{
          fontFamily: MONO,
          fontSize: 16,
          color: DUST,
          maxWidth: 380,
          margin: "16px auto 0",
          lineHeight: 1.6,
        }}>
          This page doesn&apos;t exist — but your next tag might. Head back and build your hunt plan.
        </p>

        <div style={{ marginTop: 32 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: AMBER,
              color: SOIL,
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 14,
              height: 48,
              padding: "0 32px",
              borderRadius: 0,
              letterSpacing: "0.02em",
            }}
          >
            Back to Tag Hunter →
          </Link>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link
            href="/chat"
            style={{
              fontFamily: MONO,
              fontSize: 14,
              color: DUST,
              textTransform: "none",
              borderBottom: "1px solid transparent",
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            Or try the AI Advisor →
          </Link>
        </div>
      </main>
    </div>
  );
}
