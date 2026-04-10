"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlanTimeline from "@/components/PlanTimeline";
import WaitlistForm from "@/components/WaitlistForm";

// ── Constants ──────────────────────────────────────────────────────────────
const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW = "#F0A040";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

const NAV_LINKS = [
  { href: "/find", label: "Find My Hunt" },
  { href: "/chat", label: "AI Advisor" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan", label: "Build Plan" },
];

// ── Species SVGs ───────────────────────────────────────────────────────────
const SpeciesSVG = ({ species }: { species: string }) => {
  const props = {
    viewBox: "0 0 40 40",
    fill: "currentColor",
    width: 28,
    height: 28,
  };
  switch (species) {
    case "elk":
      return (
        <svg {...props}>
          <path d="M20 6c-.7 0-1.3.3-1.7.8l-1 1.7-3.2-.8c-.6-.1-1.2.3-1.3.9l-.4 3.3-3 1.1c-.6.2-.9.9-.6 1.5l1.4 2.8-2 2.8c-.4.5-.2 1.2.3 1.5l2.9 1.3.3 3.3c.1.6.6 1.1 1.3 1l3.2-.8 2.1 2.6c.4.5 1.1.5 1.5 0l2.1-2.6 3.2.8c.6.2 1.2-.3 1.3-1l.3-3.3 2.9-1.3c.5-.3.7-1 .3-1.5l-2-2.8 1.4-2.8c.3-.6 0-1.3-.6-1.5l-3-1.1-.4-3.3c-.1-.6-.7-1-1.3-.9l-3.2.8-1-1.7C21.3 6.3 20.7 6 20 6z" />
          <path d="M13 8 L11 4 M11 4 L9 2 M11 4 L13 3" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M27 8 L29 4 M29 4 L31 2 M29 4 L27 3" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "mule_deer":
      return (
        <svg {...props}>
          <path d="M20 9c-1 0-1.8.5-2.3 1.2L16 13l-3-.7c-.7-.2-1.4.3-1.5 1l-.3 3-2.8 1c-.7.3-1 1-.7 1.7l1.2 2.5-1.5 2.4c-.4.6-.2 1.3.5 1.6l2.8 1 .3 3c.1.7.8 1.2 1.5 1l3-.7 2 2.3c.5.5 1.3.5 1.7 0l2-2.3 3 .7c.7.2 1.4-.3 1.5-1l.3-3 2.8-1c.7-.3.9-1 .5-1.6L30 22.5l1.2-2.5c.3-.7 0-1.4-.7-1.7l-2.8-1-.3-3c-.1-.7-.8-1.2-1.5-1L23 13l-1.7-2.8C20.8 9.5 20.5 9 20 9z" />
          <path d="M14 10 L11 6 M11 6 L9 3 M13 7 L11 6" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M26 10 L29 6 M29 6 L31 3 M27 7 L29 6" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "whitetail":
      return (
        <svg {...props}>
          <path d="M20 10c-.9 0-1.7.4-2.1 1.1L16.5 14l-2.7-.7c-.6-.1-1.3.3-1.4.9l-.3 2.8-2.6.9c-.6.3-.9.9-.6 1.5l1.1 2.2-1.4 2.2c-.4.6-.2 1.2.4 1.5l2.5.9.3 2.8c.1.7.8 1.1 1.4 1l2.7-.6 1.8 2.1c.4.5 1.2.5 1.6 0l1.8-2.1 2.7.6c.6.1 1.3-.3 1.4-1l.3-2.8 2.5-.9c.6-.3.8-1 .4-1.5l-1.4-2.2 1.1-2.2c.3-.6 0-1.2-.6-1.5l-2.6-.9-.3-2.8c-.1-.6-.8-1-1.4-.9L23.5 14l-1.4-2.9C21.7 10.4 20.9 10 20 10z" />
          <path d="M15 11 L13 7 M13 7 L12 4 M13 7 L15 6" stroke="currentColor" fill="none" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M25 11 L27 7 M27 7 L28 4 M27 7 L25 6" stroke="currentColor" fill="none" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "pronghorn":
      return (
        <svg {...props}>
          <path d="M20 12c-1.1 0-2 .6-2.5 1.4L16 16h-3c-.8 0-1.5.7-1.5 1.5v1.2c0 .6.4 1.1 1 1.3L11 22c-.5.7-.2 1.6.5 2 .3.2.7.2 1 .1l2-.6v2.5c0 1.1.9 2 2 2h.8l.7 4h8l.7-4H27c1.1 0 2-.9 2-2v-2.5l2 .6c.3.1.7 0 1-.1.7-.4 1-1.3.5-2l-1.5-2c.6-.2 1-.7 1-1.3v-1.2c0-.8-.7-1.5-1.5-1.5H27l-1.5-2.6c-.5-.8-1.4-1.4-2.5-1.4h-3z" />
          <path d="M17 12 L15 7 M15 7 L14 4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M23 12 L25 7 M25 7 L26 4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "bighorn_sheep":
      return (
        <svg {...props}>
          <path d="M20 11c-1.2 0-2.2.6-2.8 1.5L16 15l-2.8-.5c-.7-.1-1.3.4-1.4 1.1l-.2 2.9-2.7.8c-.6.2-1 .9-.7 1.5l1 2.3L8 25.5c-.4.6-.2 1.3.4 1.6l2.6.8.2 2.9c.1.7.7 1.1 1.4 1l2.8-.5 1.7 2.2c.4.5 1.1.6 1.6.2l.3-.2 1.7 2.2c.4.5 1.2.5 1.6 0l1.7-2.2 2.8.5c.7.1 1.3-.3 1.4-1l.2-2.9 2.6-.8c.6-.3.8-1 .4-1.6l-1.2-2.4 1-2.3c.3-.6-.1-1.3-.7-1.5l-2.7-.8-.2-2.9c-.1-.7-.7-1.2-1.4-1.1L24 15l-1.2-2.5C22.2 11.6 21.2 11 20 11z" />
          <path d="M14 12 Q8 10 7 15 Q6 20 11 19" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "mountain_goat":
      return (
        <svg {...props}>
          <path d="M20 13c-1 0-1.8.5-2.3 1.2L16.5 17l-2.5-.4c-.7-.1-1.3.4-1.3 1.1l-.2 2.5-2.4.7c-.6.2-.9.8-.7 1.4l.9 2-1 2.1c-.3.6 0 1.2.6 1.5l2.4.7.2 2.5c.1.6.7 1 1.3 1l2.5-.4 1.5 1.9c.4.5 1.1.5 1.5 0l1.5-1.9 2.5.4c.6.1 1.3-.3 1.3-1l.2-2.5 2.4-.7c.6-.3.9-.9.6-1.5l-1-2.1.9-2c.2-.6-.1-1.2-.7-1.4l-2.4-.7-.2-2.5c-.1-.7-.7-1.2-1.3-1.1L23.5 17l-1.2-2.8C21.8 13.5 20.9 13 20 13z" />
          <path d="M17 13 L16 10 M16 10 L15 8" stroke="currentColor" fill="none" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M23 13 L24 10 M24 10 L25 8" stroke="currentColor" fill="none" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "moose":
      return (
        <svg {...props}>
          <path d="M20 14c-.9 0-1.6.4-2 1.1L16.7 18l-2.4-.4c-.6-.1-1.2.3-1.3 1l-.2 2.2-2.1.6c-.5.2-.8.8-.6 1.3l.8 1.8-.9 1.9c-.3.6 0 1.2.6 1.4l2.1.6.2 2.2c.1.6.7 1 1.3.9l2.4-.4 1.3 1.7c.4.4 1 .4 1.4 0l1.3-1.7 2.4.4c.6.1 1.2-.3 1.3-.9l.2-2.2 2.1-.6c.6-.2.9-.8.6-1.4l-.9-1.9.8-1.8c.2-.5-.1-1.1-.6-1.3l-2.1-.6-.2-2.2c-.1-.6-.7-1-1.3-1L23.3 18l-1.3-2.9C21.6 14.4 20.9 14 20 14z" />
          <path d="M13 15 L9 11 M9 11 L7 8 M9 11 L8 14 M9 11 L11 13" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M27 15 L31 11 M31 11 L33 8 M31 11 L32 14 M31 11 L29 13" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "black_bear":
      return (
        <svg {...props}>
          <path d="M20 10c-2.2 0-4 1.5-4.5 3.5H15c-.8 0-1.5.5-1.8 1.3L12 18l-2.5 .8c-.6.2-.9.8-.7 1.4l.8 2.2-1 2c-.3.7 0 1.4.7 1.7l2.5.7.2 2.3c.1.6.6 1.1 1.2 1l2.3-.4 1.5 2c.4.5 1.1.5 1.5 0l1.5-2 2.3.4c.6.1 1.2-.3 1.2-1l.2-2.3 2.5-.7c.7-.3 1-1 .7-1.7l-1-2 .8-2.2c.2-.6-.1-1.2-.7-1.4L25 18l-1.2-3.2c-.3-.8-1-1.3-1.8-1.3h-.5C21 11.5 20 10 19 10h1z" />
          <circle cx="15" cy="11" r="2" />
          <circle cx="25" cy="11" r="2" />
        </svg>
      );
    case "bison":
      return (
        <svg {...props}>
          <path d="M20 13c-1.5 0-2.8.8-3.5 2l-1 1.8-2.2-.3c-.7-.1-1.3.4-1.4 1.1l-.1 2-2.3.5c-.6.1-1 .7-.9 1.4l.5 2-1.2 1.9c-.4.6-.2 1.3.5 1.6l2.3.5 .1 2c.1.6.7 1.1 1.4 1l2.2-.3 1.4 1.7c.4.5 1.1.5 1.5.1l.2-.1.2.1c.4.4 1.1.4 1.5-.1l1.4-1.7 2.2.3c.7.1 1.3-.3 1.4-1l.1-2 2.3-.5c.7-.3.9-1 .5-1.6l-1.2-1.9.5-2c.1-.6-.3-1.3-.9-1.4l-2.3-.5-.1-2c-.1-.6-.7-1.2-1.4-1.1l-2.2.3-1-1.8C22.8 13.8 21.5 13 20 13z" />
          <path d="M13 16 Q12 12 16 11 Q20 10 20 13" fill="currentColor" opacity="0.7" />
          <path d="M15 14 L13 11 M25 14 L27 11" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

const SPECIES_GRID = [
  { slug: "elk", name: "Elk" },
  { slug: "mule_deer", name: "Mule Deer" },
  { slug: "whitetail", name: "Whitetail" },
  { slug: "pronghorn", name: "Pronghorn" },
  { slug: "bighorn_sheep", name: "Bighorn Sheep" },
  { slug: "mountain_goat", name: "Mountain Goat" },
  { slug: "moose", name: "Moose" },
  { slug: "black_bear", name: "Black Bear" },
  { slug: "bison", name: "Bison" },
];

// ── CSS Tool Icons ─────────────────────────────────────────────────────────
const ToolIcon = ({ kind }: { kind: string }) => {
  const base = { width: 24, height: 24, color: AMBER };
  switch (kind) {
    case "crosshair":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-4a8 8 0 0 1 16-7z" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "tag":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <path d="M3 12V3h9l9 9-9 9z" />
          <circle cx="7" cy="7" r="1" fill="currentColor" />
        </svg>
      );
    case "bars":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="12" y1="20" x2="12" y2="9" />
          <line x1="18" y1="20" x2="18" y2="4" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="12" x2="12" y2="6" />
        </svg>
      );
    case "list":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      );
  }
  return null;
};

const TOOLS = [
  { icon: "crosshair", title: "Find My Hunt", desc: "AI matches you to specific units in seconds.", href: "/find" },
  { icon: "chat", title: "AI Advisor", desc: "Ask anything about western hunting in plain English.", href: "/chat" },
  { icon: "grid", title: "Application Center", desc: "Step-by-step guides for every state portal.", href: "/dashboard" },
  { icon: "tag", title: "OTC Tag Finder", desc: "Hunt this year — no draw needed.", href: "/otc" },
  { icon: "bars", title: "Draw Odds Calculator", desc: "When will you finally draw that tag?", href: "/odds" },
  { icon: "clock", title: "Application Deadlines", desc: "Never miss another window.", href: "/dashboard?tab=deadlines" },
  { icon: "list", title: "My Applications", desc: "Track points, draws, and licenses.", href: "/dashboard?tab=tracker" },
];

const TESTIMONIALS = [
  {
    species: "elk",
    quote: "Burned my 8 Colorado elk points in Year 9 just like the plan said. Drew Unit 54. Best hunt of my life.",
    name: "Jake T.",
    tag: "Non-resident · Colorado Elk",
  },
  {
    species: "pronghorn",
    quote: "Built a 5-state antelope/deer portfolio for under $1,100/year. Never would have figured that out on my own.",
    name: "Maria S.",
    tag: "Texas resident · Multi-state",
  },
  {
    species: "mule_deer",
    quote: "Found an OTC Idaho elk hunt for $650 I can do this fall while my Colorado points keep building.",
    name: "Chris W.",
    tag: "First-time western hunter",
  },
];

const COMPARISON = [
  ["AI-powered personalized strategy", true, false],
  ["Natural language hunt search", true, false],
  ["AI chat advisor (ask anything)", true, false],
  ["Unit-level draw odds data", true, true],
  ["Application deadline tracker", true, true],
  ["Points & license tracker", true, true],
  ["Hunt logbook", true, "Limited"],
  ["Data sources", "State CSVs + AI", "State CSVs"],
];

const PARTNERS = [
  { name: "onX Hunt", role: "Mapping Layer" },
  { name: "GoHunt", role: "Unit Research" },
  { name: "SpartanForge", role: "Field Prep" },
];

// ── Animation variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ── Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.add("editorial");
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.body.classList.remove("editorial");
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div style={{ background: SOIL, color: BONE, fontFamily: "var(--font-dm-mono), monospace", position: "relative" }}>
      <div id="main-content" />

      {/* ── NAV ────────────────────────────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main"
        className="sticky top-0 z-50"
        style={{
          background: SOIL,
          borderBottom: "none",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.5)" : "none",
          transition: "box-shadow 0.2s",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
          <Link href="/" className="flex items-center gap-2" style={{ color: AMBER, fontFamily: "var(--font-display), serif", fontWeight: 700, fontSize: 22, letterSpacing: "-0.01em" }}>
            ◎ TAG HUNTER
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="uppercase transition-colors hover:text-amber-brand"
                style={{ color: BONE, fontFamily: "var(--font-dm-mono), monospace", fontSize: 13, letterSpacing: "0.1em" }}
                onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = BONE)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/plan"
              style={{
                background: AMBER,
                color: SOIL,
                fontFamily: "var(--font-dm-mono), monospace",
                fontWeight: 500,
                fontSize: 13,
                height: 44,
                padding: "0 24px",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 0,
              }}
            >
              Build Free Plan →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setNavOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={navOpen}
            style={{ color: BONE, background: "none", border: "none", fontSize: 24, cursor: "pointer" }}
          >
            {navOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile overlay */}
        {navOpen && (
          <div
            role="menu"
            className="md:hidden flex flex-col gap-4 px-6 pb-6"
            style={{ background: SOIL }}
          >
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setNavOpen(false)}
                className="uppercase"
                style={{ color: BONE, fontFamily: "var(--font-dm-mono), monospace", fontSize: 14, letterSpacing: "0.1em", padding: "8px 0" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/plan"
              onClick={() => setNavOpen(false)}
              style={{
                background: AMBER,
                color: SOIL,
                fontFamily: "var(--font-dm-mono), monospace",
                fontWeight: 500,
                fontSize: 13,
                height: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              Build Free Plan →
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO with video ────────────────────────────────────────────── */}
      <section className="relative" style={{ height: "100vh", minHeight: 640, overflow: "hidden" }}>
        {/* Video background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ background: BARK }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src="https://cdn.coverr.co/videos/coverr-a-massive-bull-elk-walks-through-the-trees-bugling/1080p.mp4" type="video/mp4" />
            <source src="https://cdn.coverr.co/videos/coverr-a-massive-bull-elk-walks-through-the-trees-bugling/360p.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(15,13,10,0.15) 0%, rgba(15,13,10,0.65) 60%, rgba(15,13,10,0.95) 100%)",
            }}
          />
          {/* Amber tint */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(212, 133, 42, 0.08)", mixBlendMode: "overlay" }}
          />
        </div>

        {/* Hero content */}
        <div className="relative h-full flex items-end pb-16 md:pb-24">
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="max-w-5xl w-full px-8 md:px-16"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                color: AMBER,
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Free · No Signup · Built for Hunters
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-display), serif",
                fontWeight: 900,
                color: BONE,
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                fontSize: "clamp(52px, 8vw, 88px)",
                margin: 0,
              }}
            >
              Stop guessing.<br />
              Start drawing.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                color: DUST,
                fontSize: 18,
                lineHeight: 1.6,
                maxWidth: 500,
                marginTop: 24,
              }}
            >
              AI-powered draw strategy for every western big game species. Build your personalized 10-year hunt plan in 3 minutes — free.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap gap-4 items-center"
              style={{ marginTop: 32 }}
            >
              <Link
                href="/plan"
                className="cta-pulse"
                style={{
                  background: AMBER,
                  color: SOIL,
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontWeight: 500,
                  fontSize: 16,
                  height: 56,
                  padding: "0 32px",
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = GLOW)}
                onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
              >
                Build My Free Hunt Plan →
              </Link>
              <a
                href="#sample-plan"
                style={{
                  color: AMBER,
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 14,
                  textDecoration: "none",
                  borderBottom: "1px solid transparent",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderBottomColor = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.borderBottomColor = "transparent")}
              >
                See a sample plan ↓
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap gap-3"
              style={{ marginTop: 24 }}
            >
              {["25+ States", "9 Species", "Always Free", "AI-Personalized"].map(p => (
                <span
                  key={p}
                  style={{
                    border: `1px solid ${FENCE}`,
                    background: "rgba(26, 23, 18, 0.5)",
                    backdropFilter: "blur(4px)",
                    color: BONE,
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 12,
                    padding: "6px 14px",
                  }}
                >
                  {p}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 3: From the Field ──────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: AMBER, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
            Hunter Stories
          </p>
          <h2 style={{ fontFamily: "var(--font-display), serif", fontWeight: 700, color: BONE, fontSize: 42, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            From the Field
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{
                background: BARK,
                borderLeft: `4px solid ${AMBER}`,
                padding: 28,
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: 16, right: 16, color: AMBER, opacity: 0.6 }}>
                <SpeciesSVG species={t.species} />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 15,
                  fontStyle: "italic",
                  color: "rgba(232, 223, 200, 0.9)",
                  lineHeight: 1.6,
                  marginBottom: 20,
                  paddingRight: 30,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ fontFamily: "var(--font-dm-mono), monospace", color: AMBER, fontSize: 13, fontWeight: 500, marginTop: 16 }}>
                {t.name}
              </div>
              <div style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 12, marginTop: 4 }}>
                {t.tag}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: How It Works ────────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: 42,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 80,
          }}
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Dashed connector — desktop only */}
          <div
            className="hidden md:block absolute left-0 right-0"
            style={{
              top: 60,
              borderTop: `2px dashed ${AMBER}`,
              opacity: 0.4,
              left: "16%",
              right: "16%",
            }}
          />

          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
            {[
              { n: "1", title: "Set Your Goals", body: "Species, hunt type, resident status, and budget." },
              { n: "2", title: "Enter Your Points", body: "Preference and bonus points per state, per species." },
              { n: "3", title: "Get Your Strategy", body: "Year-by-year plan with states, fees, and draw odds." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center md:text-left"
                style={{ minHeight: 200 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontWeight: 900,
                    fontSize: 120,
                    color: AMBER,
                    opacity: 0.15,
                    position: "absolute",
                    top: -30,
                    left: 0,
                    lineHeight: 1,
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                >
                  {step.n}
                </div>
                <div style={{ position: "relative", zIndex: 1, paddingTop: 60 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontWeight: 700,
                      fontSize: 28,
                      color: BONE,
                      marginBottom: 12,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: 15,
                      color: DUST,
                      lineHeight: 1.6,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Sample Plan Timeline ────────────────────────────── */}
      <section id="sample-plan" style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: AMBER, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
            Sample Plan Output
          </p>
          <h2 style={{ fontFamily: "var(--font-display), serif", fontWeight: 700, color: BONE, fontSize: 42, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            See It In Action
          </h2>
          <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 16, marginTop: 8 }}>
            Colorado Elk · 8 Preference Points
          </p>
        </motion.div>

        <PlanTimeline />

        <div className="mt-16 text-center">
          <Link
            href="/plan"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              border: `2px solid ${AMBER}`,
              color: AMBER,
              fontFamily: "var(--font-dm-mono), monospace",
              fontWeight: 500,
              fontSize: 14,
              background: "transparent",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = AMBER;
              e.currentTarget.style.color = SOIL;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = AMBER;
            }}
          >
            Build Your Plan →
          </Link>
        </div>
      </section>

      {/* ── SECTION 6: Species Grid ────────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: 42,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 60,
          }}
        >
          All Big Game Covered
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SPECIES_GRID.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/plan?species=${s.slug}`}
                className="block group"
                style={{
                  background: BARK,
                  border: `1px solid ${FENCE}`,
                  padding: 24,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = AMBER;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = FENCE;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ color: AMBER }}>
                  <SpeciesSVG species={s.slug} />
                </div>
                <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontWeight: 500, color: BONE, fontSize: 14 }}>
                  {s.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: Free Tools ──────────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: 42,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 60,
          }}
        >
          Your Full Hunting Toolkit
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: (i % 2) * 0.1 }}
            >
              <Link
                href={tool.href}
                className="block group"
                style={{
                  background: BARK,
                  border: `1px solid ${FENCE}`,
                  padding: 28,
                  display: "block",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = FENCE)}
              >
                <ToolIcon kind={tool.icon} />
                <div
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontWeight: 500,
                    color: BONE,
                    fontSize: 15,
                    marginTop: 16,
                  }}
                >
                  {tool.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    color: DUST,
                    fontSize: 13,
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {tool.desc}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    color: AMBER,
                    fontSize: 13,
                    marginTop: 16,
                  }}
                >
                  Explore →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 8: Comparison Table ────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: 42,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 48,
          }}
        >
          Why Hunters Choose Tag Hunter
        </motion.h2>

        <div style={{ background: BARK, border: `1px solid ${FENCE}`, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "20px 24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 12, color: DUST, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${FENCE}`, fontWeight: 500 }}>
                  Feature
                </th>
                <th style={{ textAlign: "center", padding: "20px 24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 12, color: AMBER, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${FENCE}`, fontWeight: 500 }}>
                  Tag Hunter
                </th>
                <th style={{ textAlign: "center", padding: "20px 24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 12, color: DUST, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${FENCE}`, fontWeight: 500 }}>
                  Paid Service
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => {
                const [feat, ours, theirs] = row;
                const renderCell = (val: string | boolean) => {
                  if (val === true) return <span style={{ color: AMBER, fontSize: 18 }}>✦</span>;
                  if (val === false) return <span style={{ color: DUST }}>✗</span>;
                  return <span style={{ color: BONE, fontSize: 13 }}>{val as string}</span>;
                };
                return (
                  <tr key={feat as string} style={{ background: i % 2 === 0 ? BARK : "rgba(26, 23, 18, 0.6)" }}>
                    <td style={{ padding: "16px 24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 14, color: BONE, borderBottom: `1px solid ${FENCE}` }}>
                      {feat as string}
                    </td>
                    <td style={{ textAlign: "center", padding: "16px 24px", borderBottom: `1px solid ${FENCE}` }}>
                      {renderCell(ours)}
                    </td>
                    <td style={{ textAlign: "center", padding: "16px 24px", borderBottom: `1px solid ${FENCE}` }}>
                      {renderCell(theirs)}
                    </td>
                  </tr>
                );
              })}
              {/* Price row */}
              <tr style={{ background: BARK }}>
                <td style={{ padding: "24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 14, color: BONE, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Price
                </td>
                <td style={{ textAlign: "center", padding: "24px", fontFamily: "var(--font-display), serif", fontSize: 28, color: AMBER, fontWeight: 700 }}>
                  Free
                </td>
                <td style={{ textAlign: "center", padding: "24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 13, color: DUST }}>
                  $150–300/yr
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── SECTION 9: Ecosystem ───────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 32 }}>
          Works Alongside Your Favorite Tools
        </p>
        <div className="flex flex-wrap items-start justify-center gap-12 md:gap-20">
          {PARTNERS.map(p => (
            <div key={p.name} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display), serif", fontSize: 22, color: BONE, opacity: 0.6, fontWeight: 700 }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 12, marginTop: 4 }}>
                {p.role}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 11, marginTop: 32 }}>
          Not affiliated with or officially endorsed by any listed company.
        </p>
      </section>

      {/* ── SECTION 10: Email Capture ──────────────────────────────────── */}
      <section
        style={{
          padding: "120px 24px",
          background: "linear-gradient(180deg, #1A1712 0%, #221A0F 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 700,
              color: BONE,
              fontSize: 38,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Stay Ahead of Every Draw Window
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              color: DUST,
              fontSize: 16,
              marginTop: 12,
              lineHeight: 1.6,
            }}
          >
            Draw odds from state CSVs, deadline push notifications, and more.
          </p>
          <div style={{ marginTop: 32 }}>
            <WaitlistForm source="homepage-redesign" />
          </div>
          <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 12, marginTop: 12 }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer style={{ background: SOIL, borderTop: `1px solid ${FENCE}`, padding: "48px 24px" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div style={{ fontFamily: "var(--font-display), serif", color: AMBER, fontSize: 18, fontWeight: 700 }}>
              ◎ TAG HUNTER
            </div>
            <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 13, marginTop: 8 }}>
              Free western draw strategy. Built by hunters.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 md:justify-center" style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 13 }}>
            <Link href="/about" style={{ color: DUST }}>About</Link>
            <span>·</span>
            <Link href="/faq" style={{ color: DUST }}>FAQ</Link>
            <span>·</span>
            <Link href="/feedback" style={{ color: DUST }}>Feedback</Link>
            <span>·</span>
            <Link href="/terms" style={{ color: DUST }}>Terms</Link>
            <span>·</span>
            <Link href="/privacy" style={{ color: DUST }}>Privacy</Link>
          </div>

          <div className="md:text-right" style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 13 }}>
            Built by{" "}
            <a
              href="https://f21.ai"
              style={{ color: DUST, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
              onMouseLeave={e => (e.currentTarget.style.color = DUST)}
            >
              Factor21
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
