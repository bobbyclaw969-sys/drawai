"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";

const NAV_LINKS = [
  { href: "/find",      label: "Find My Hunt" },
  { href: "/chat",      label: "AI Advisor" },
  { href: "/apply",     label: "Apply" },
  { href: "/deadlines", label: "Deadlines" },
  { href: "/tracker",   label: "My Apps" },
];

export default function AppNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <nav className="app-nav no-print">
        <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
          🎯 Tag Hunter
        </Link>

        {/* Desktop */}
        <div className="nav-links nav-desktop-links">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link${isActive(l.href) ? " nav-link-active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/plan" className="btn-primary" style={{ padding: "7px 16px", fontSize: 13 }}>
            Build Plan
          </Link>
          {!loading && (
            user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link
                  href="/profile"
                  style={{
                    width: 30, height: 30, borderRadius: "50%", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 13,
                    background: "var(--amber-glow)", border: "1px solid rgba(232,150,15,0.4)",
                    color: "var(--amber)", fontWeight: 700, textDecoration: "none",
                  }}
                  title={user.email ?? "Profile"}
                >
                  {(user.email?.[0] ?? "U").toUpperCase()}
                </Link>
                <button
                  onClick={signOut}
                  style={{ fontSize: 12, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                style={{
                  padding: "7px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                  border: "1px solid var(--border-2)", color: "var(--text-2)",
                  background: "transparent", textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            )
          )}
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`mobile-menu${open ? " open" : ""}`}>
        {NAV_LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link${isActive(l.href) ? " nav-link-active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/plan" className="btn-primary" onClick={() => setOpen(false)}>
          Build Plan
        </Link>
        {!loading && (
          user ? (
            <button
              onClick={() => { signOut(); setOpen(false); }}
              style={{ fontSize: 14, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "8px 0" }}
            >
              Sign out ({user.email})
            </button>
          ) : (
            <Link href="/auth" className="nav-link" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          )
        )}
      </div>
    </>
  );
}
