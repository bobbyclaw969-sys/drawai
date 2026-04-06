"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
      </div>
    </>
  );
}
