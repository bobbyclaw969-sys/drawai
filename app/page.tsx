"use client";
import Link from "next/link";
import { SPECIES_EMOJI, SPECIES_LABELS } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";

const FEATURED_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison",
];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-20 text-center">
        <div className="mb-4 text-5xl">🎯</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight" style={{ color: "#f59e0b" }}>
          Stop guessing.<br />Start hunting.
        </h1>
        <p className="text-lg sm:text-xl max-w-xl mx-auto mb-3" style={{ color: "#c8d8c8" }}>
          Free AI strategy for every western draw — elk, deer, pronghorn, sheep, and more.
          Build your personalized 10-year hunt plan in 3 minutes.
        </p>
        <p className="text-sm mb-10" style={{ color: "#8a9e8a" }}>
          No signup. No paywall. Built for hunters.
        </p>
        <Link
          href="/plan"
          className="inline-block px-10 py-4 rounded-lg text-lg font-bold transition-colors"
          style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#d97706")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#f59e0b")}
        >
          Build My Hunt Plan →
        </Link>
      </section>

      {/* Species grid */}
      <section className="px-4 pb-16 max-w-2xl mx-auto w-full">
        <p className="text-center text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: "#8a9e8a" }}>
          All Big Game Covered
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {FEATURED_SPECIES.map(s => (
            <div
              key={s}
              className="flex flex-col items-center p-3 rounded-lg text-center"
              style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}
            >
              <span className="text-2xl mb-1">{SPECIES_EMOJI[s]}</span>
              <span className="text-xs font-medium" style={{ color: "#c8d8c8" }}>
                {SPECIES_LABELS[s]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-20 max-w-2xl mx-auto w-full">
        <p className="text-center text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: "#8a9e8a" }}>
          How It Works
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { n: "1", title: "Tell us your goals", body: "Species, hunt type, budget, and what kind of hunter you are." },
            { n: "2", title: "Enter your points", body: "Preference and bonus points you've built in each state." },
            { n: "3", title: "Get your strategy", body: "A personalized year-by-year plan with specific states, fees, and deadlines." },
          ].map(step => (
            <div key={step.n} className="p-4 rounded-lg" style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
              <div className="text-2xl font-bold mb-2" style={{ color: "#f59e0b" }}>{step.n}</div>
              <div className="font-semibold mb-1">{step.title}</div>
              <div className="text-sm" style={{ color: "#8a9e8a" }}>{step.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="text-center pb-20 px-4">
        <Link
          href="/plan"
          className="inline-block px-10 py-4 rounded-lg text-lg font-bold transition-colors"
          style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#d97706")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#f59e0b")}
        >
          Build My Hunt Plan — Free →
        </Link>
      </section>

      <footer className="text-center text-xs py-6 px-4" style={{ color: "#8a9e8a", borderTop: "1px solid #2a3a2a" }}>
        DrawAI is free. Built by{" "}
        <a href="https://f21.ai" style={{ color: "#f59e0b" }}>Factor21</a>.
        Not affiliated with any state agency.
        Always verify deadlines at your state&apos;s official wildlife agency website.
      </footer>
    </main>
  );
}
