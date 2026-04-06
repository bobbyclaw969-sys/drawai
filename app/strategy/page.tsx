"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { HunterProfile, SpeciesKey } from "@/lib/types";
import { SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import StrategyOutput from "@/components/StrategyOutput";
import SavePlanButton from "@/components/SavePlanButton";
import ForumShare from "@/components/ForumShare";
import AiDisclaimer from "@/components/AiDisclaimer";
import DataDisclaimer from "@/components/DataDisclaimer";

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
    let receivedBytes = 0;
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
        receivedBytes += value?.length ?? 0;
        setStrategy(prev => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      // If we already received partial content, show a softer "interrupted" notice
      // rather than replacing everything with a hard error.
      if (receivedBytes > 0) {
        setError("__interrupted__");
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      }
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
    <div className="page">
      <AppNav />
      <div className="page-inner" style={{ maxWidth: 760 }}>
        {/* Back link */}
        <div style={{ marginBottom: 24 }}>
          <Link href="/plan" style={{ fontSize: 13, color: "var(--text-3)" }}>
            ← Back to plan builder
          </Link>
        </div>

        <AiDisclaimer />
        <DataDisclaimer />

        {/* Profile summary */}
        {profile && (
          <div className="card" style={{ padding: 16, marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[
              { label: "Species", value: profile.species.map(s => SPECIES_LABELS[s as SpeciesKey]).join(", ") },
              { label: "Method", value: profile.huntType },
              { label: "Residency", value: STATE_NAMES[profile.residency] ?? profile.residency },
              { label: "Budget", value: `$${profile.budget.toLocaleString()}/yr` },
              { label: "Horizon", value: `${profile.planningYears} years` },
            ].map(item => (
              <div key={item.label} style={{ fontSize: 13 }}>
                <span style={{ color: "var(--text-3)" }}>{item.label}: </span>
                <span style={{ fontWeight: 600, textTransform: item.label === "Method" ? "capitalize" : undefined }}>{item.value}</span>
              </div>
            ))}
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
        {error && error !== "__interrupted__" && (
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
        {error === "__interrupted__" && (
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "#1a1a0a", border: "1px solid #4a3a00", marginTop: 8 }}
          >
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚠️</span>
            <div>
              <p className="text-sm font-medium" style={{ color: "#f59e0b", marginBottom: 4 }}>
                Plan may be incomplete — connection was interrupted
              </p>
              <p className="text-xs" style={{ color: "#8a7a50" }}>
                Scroll up to review what was generated. You can save it or regenerate for the full plan.
              </p>
            </div>
            <button
              onClick={() => { fetchedRef.current = false; if (profile) generateStrategy(profile); }}
              className="ml-auto px-4 py-1.5 rounded-lg text-xs font-medium flex-shrink-0"
              style={{ backgroundColor: "#2a2000", border: "1px solid #4a3a00", color: "#f59e0b" }}
            >
              Regenerate
            </button>
          </div>
        )}

        {/* Actions — show when done */}
        {!loading && strategy && profile && (
          <div className="mt-6 space-y-3 no-print">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyShare}
                className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: copied ? "#1a3a1a" : "#162016",
                  border: copied ? "1px solid #4ade80" : "1px solid #2a3a2a",
                  color: copied ? "#4ade80" : "#e8f0e8",
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy Link"}
              </button>
              <SavePlanButton profile={profile} strategy={strategy} />
              <button
                onClick={handlePrint}
                className="flex-1 py-3 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#e8f0e8" }}
              >
                🖨️ Print
              </button>
              <Link
                href="/plan"
                className="flex-1 py-3 rounded-lg text-sm font-medium text-center"
                style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}
              >
                New Plan
              </Link>
            </div>
            <ForumShare profile={profile} strategy={strategy} />
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 32 }}>
          Tag Hunter is free. Built by{" "}
          <a href="https://f21.ai" style={{ color: "var(--amber)" }}>Factor21</a>.
          Not affiliated with any state agency.
          Always verify deadlines at your state&apos;s official wildlife agency website.
        </p>
      </div>
    </div>
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
