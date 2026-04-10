"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/useAuth";

const NAV_LINKS = [
  { href: "/find",      label: "Find My Hunt" },
  { href: "/chat",      label: "AI Advisor" },
  { href: "/dashboard", label: "Dashboard" },
];

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

const SOIL = "#0F0D0A";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW = "#F0A040";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

export default function AppNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, loading } = useAuth();
  const isAdmin = useMemo(
    () => !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()),
    [user?.email],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile overlay is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main"
        className="no-print sticky top-0 z-50"
        style={{
          background: SOIL,
          borderBottom: "none",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.5)" : "none",
          transition: "box-shadow 0.2s",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            style={{
              color: AMBER,
              fontFamily: "var(--font-display), serif",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ◎ TAG HUNTER
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: isActive(l.href) ? AMBER : BONE,
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = isActive(l.href) ? AMBER : BONE)}
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/verify"
                style={{
                  color: DUST,
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = DUST)}
              >
                Admin
              </Link>
            )}
            <Link
              href="/plan"
              style={{
                background: AMBER,
                color: SOIL,
                fontFamily: "var(--font-dm-mono), monospace",
                fontWeight: 500,
                fontSize: 13,
                height: 44,
                padding: "0 20px",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = GLOW)}
              onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
            >
              Build Free Plan →
            </Link>
            {!loading && (
              user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    title={user.email ?? "Profile"}
                    style={{
                      width: 32,
                      height: 32,
                      background: "transparent",
                      border: `1px solid ${FENCE}`,
                      color: BONE,
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: 12,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                  >
                    {(user.email?.[0] ?? "U").toUpperCase()}
                  </Link>
                  <button
                    onClick={signOut}
                    style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: 12,
                      color: DUST,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
                    onMouseLeave={e => (e.currentTarget.style.color = DUST)}
                  >
                    SIGN OUT
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 12,
                    color: DUST,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
                  onMouseLeave={e => (e.currentTarget.style.color = DUST)}
                >
                  Sign In
                </Link>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            style={{
              color: BONE,
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

      </nav>

      {/* Mobile full-screen overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0"
          style={{
            background: SOIL,
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Header inside overlay — logo + close */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "none" }}
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              style={{
                color: AMBER,
                fontFamily: "var(--font-display), serif",
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: "-0.01em",
              }}
            >
              ◎ TAG HUNTER
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{
                color: DUST,
                background: "none",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
                padding: 8,
                minWidth: 48,
                minHeight: 48,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
              onMouseLeave={e => (e.currentTarget.style.color = DUST)}
            >
              ✕
            </button>
          </div>

          {/* Nav links */}
          <nav
            role="menu"
            aria-label="Mobile"
            className="flex flex-col gap-2 px-6 pt-8 flex-1"
          >
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  color: isActive(l.href) ? AMBER : BONE,
                  fontFamily: "var(--font-display), serif",
                  fontWeight: 700,
                  fontSize: 32,
                  letterSpacing: "-0.01em",
                  padding: "16px 0",
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {l.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin/verify"
                onClick={() => setOpen(false)}
                style={{
                  color: DUST,
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "12px 0",
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Admin
              </Link>
            )}

            {/* CTA */}
            <Link
              href="/plan"
              onClick={() => setOpen(false)}
              style={{
                background: AMBER,
                color: SOIL,
                fontFamily: "var(--font-dm-mono), monospace",
                fontWeight: 500,
                fontSize: 14,
                height: 56,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 24,
                borderRadius: 0,
                letterSpacing: "0.02em",
              }}
            >
              Build Free Plan →
            </Link>

            {/* Auth */}
            <div style={{ marginTop: 16 }}>
              {!loading && (
                user ? (
                  <button
                    onClick={() => { signOut(); setOpen(false); }}
                    style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: 13,
                      color: DUST,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "12px 0",
                      minHeight: 48,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    SIGN OUT ({user.email})
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: 13,
                      color: DUST,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      padding: "12px 0",
                      minHeight: 48,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Sign In
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
