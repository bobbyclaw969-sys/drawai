"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HunterProfile, SpeciesKey } from "@/lib/types";
import { SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import StrategyOutput from "@/components/StrategyOutput";

function StrategyPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [profile, setProfile] = useState<HunterProfile | null>(null);
  const [strategy, setStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchedRef = useRef(false);

  useEffect(() => {
    const p = searchParams.get("p");
    if (!p) { router.push("/plan"); return; }
    try {
      const decoded = JSON.parse(atob(p)) as HunterProfile;
      setProfile(decoded);
    } catch {
      router.push("/plan");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!profile || fetchedRef.current) return;
    fetchedRef.current = true;
    generateStrategy(profile);
  }, [profile]);

  const generateStrategy = async (p: HunterProfile) => {
    setLoading(true);
    setStrategy("");
    setError("");
    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: p }),
      });
      if (!res.ok) throw new Error(await res.text());
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setStrategy(prev => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopyShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => window.print();

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-xl font-bold" style={{ color: "#f59e0b" }}>
            🎯 DrawAI
          </Link>
          <Link href="/plan" className="text-sm" style={{ color: "#8a9e8a" }}>
            ← Start over
          </Link>
        </div>

        {/* Profile summary */}
        {profile && (
          <div
            className="rounded-xl p-4 mb-6 flex flex-wrap gap-3"
            style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}
          >
            <div className="text-sm">
              <span style={{ color: "#8a9e8a" }}>Species: </span>
              <span className="font-medium">
                {profile.species.map(s => SPECIES_LABELS[s as SpeciesKey]).join(", ")}
              </span>
            </div>
            <div className="text-sm">
              <span style={{ color: "#8a9e8a" }}>Method: </span>
              <span className="font-medium capitalize">{profile.huntType}</span>
            </div>
            <div className="text-sm">
              <span style={{ color: "#8a9e8a" }}>Residency: </span>
              <span className="font-medium">{STATE_NAMES[profile.residency] ?? profile.residency}</span>
            </div>
            <div className="text-sm">
              <span style={{ color: "#8a9e8a" }}>Budget: </span>
              <span className="font-medium">${profile.budget.toLocaleString()}/yr</span>
            </div>
            <div className="text-sm">
              <span style={{ color: "#8a9e8a" }}>Horizon: </span>
              <span className="font-medium">{profile.planningYears} years</span>
            </div>
          </div>
        )}

        {/* Status bar while streaming */}
        {loading && (
          <div
            className="rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2 text-sm"
            style={{ backgroundColor: "#1a2a1a", border: "1px solid #2a3a2a" }}
          >
            <div
              className="w-3 h-3 rounded-full border border-t-transparent animate-spin flex-shrink-0"
              style={{ borderColor: "#f59e0b", borderTopColor: "transparent" }}
            />
            <span style={{ color: "#8a9e8a" }}>
              {strategy ? "Streaming your strategy..." : "Contacting the AI advisor..."}
            </span>
          </div>
        )}

        {/* Strategy output */}
        <StrategyOutput text={strategy} loading={loading} />

        {/* Error */}
        {error && (
          <div
            className="rounded-xl p-6 text-center"
            style={{ backgroundColor: "#2a1010", border: "1px solid #5a1010" }}
          >
            <p className="text-sm mb-4" style={{ color: "#f87171" }}>{error}</p>
            <button
              onClick={() => { fetchedRef.current = false; if (profile) generateStrategy(profile); }}
              className="px-6 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Actions — show when done */}
        {!loading && strategy && (
          <div className="mt-6 flex flex-wrap gap-3 no-print">
            <button
              onClick={handleCopyShare}
              className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: copied ? "#1a3a1a" : "#162016",
                border: copied ? "1px solid #4ade80" : "1px solid #2a3a2a",
                color: copied ? "#4ade80" : "#e8f0e8",
              }}
            >
              {copied ? "✓ Copied!" : "📋 Copy Share Link"}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }}
            >
              🖨️ Print / Save PDF
            </button>
            <Link
              href="/plan"
              className="flex-1 py-3 rounded-lg text-sm font-medium text-center"
              style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}
            >
              Build Another Plan
            </Link>
          </div>
        )}

        <footer className="text-center text-xs mt-10 pb-6" style={{ color: "#8a9e8a" }}>
          DrawAI is free. Built by{" "}
          <a href="https://f21.ai" style={{ color: "#f59e0b" }}>Factor21</a>.
          Not affiliated with any state agency.
          Always verify deadlines at your state&apos;s official wildlife agency website.
        </footer>
      </div>
    </main>
  );
}

export default function StrategyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ color: "#8a9e8a" }}>
        Loading...
      </div>
    }>
      <StrategyPageInner />
    </Suspense>
  );
}
