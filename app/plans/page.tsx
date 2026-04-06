"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import { SavedPlan, loadPlans, deletePlan } from "@/lib/savedPlans";

function renderMarkdownPlain(text: string): string {
  return text
    .replace(/^##+ .+$/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^[-*] /gm, '• ')
    .trim();
}

export default function PlansPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { setPlans(loadPlans()); }, []);

  const handleDelete = (id: string) => {
    deletePlan(id);
    setPlans(loadPlans());
    setConfirmDelete(null);
  };

  const shareUrl = (plan: SavedPlan) => {
    const encoded = btoa(JSON.stringify(plan.profile));
    return `${window.location.origin}/strategy?p=${encoded}`;
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold" style={{ color: "#f59e0b" }}>🎯 Tag Hunter</Link>
          <span style={{ color: "#2a3a2a" }}>|</span>
          <span className="text-base font-semibold">Saved Plans</span>
        </div>
        <div className="flex gap-2">
          <Link href="/tracker" className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a", color: "#c8d8c8" }}>
            Applications
          </Link>
          <Link href="/plan" className="px-4 py-1.5 rounded-lg text-sm font-bold"
            style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}>
            + New Plan
          </Link>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-xl p-12 text-center"
          style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
          <div className="text-4xl mb-4">📌</div>
          <p className="font-semibold mb-2">No saved plans yet</p>
          <p className="text-sm mb-6" style={{ color: "#8a9e8a" }}>
            After generating a strategy, click "Save Plan" to store it here.
          </p>
          <Link href="/plan" className="px-6 py-2.5 rounded-lg font-bold text-sm inline-block"
            style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}>
            Build a Plan
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => {
            const isOpen = expanded === plan.id;
            const species = plan.profile.species.map(s => SPECIES_LABELS[s as SpeciesKey]).join(", ");
            const residency = STATE_NAMES[plan.profile.residency] ?? plan.profile.residency;
            const created = new Date(plan.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

            return (
              <div key={plan.id} className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "#162016", border: "1px solid #2a3a2a" }}>
                {/* Header */}
                <button className="w-full text-left p-5"
                  onClick={() => setExpanded(isOpen ? null : plan.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold" style={{ color: "#f59e0b" }}>
                        {plan.name || `${species} Strategy`}
                      </div>
                      <div className="text-sm mt-1" style={{ color: "#8a9e8a" }}>
                        {residency} · {species} · {plan.profile.huntType} · ${plan.profile.budget.toLocaleString()}/yr · {plan.profile.planningYears}yr plan
                      </div>
                      <div className="text-xs mt-1" style={{ color: "#4a5a4a" }}>Saved {created}</div>
                    </div>
                    <span style={{ color: "#8a9e8a" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t px-5 pb-5" style={{ borderColor: "#2a3a2a" }}>
                    <div className="py-4 text-sm strategy-output max-h-96 overflow-y-auto"
                      style={{ color: "#c8d8c8", lineHeight: "1.7" }}>
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {renderMarkdownPlain(plan.strategy)}
                      </pre>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Link
                        href={`/strategy?p=${btoa(JSON.stringify(plan.profile))}`}
                        className="px-4 py-2 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: "#f59e0b", color: "#0f1a0f" }}
                      >
                        Regenerate Strategy
                      </Link>
                      <button
                        onClick={() => navigator.clipboard.writeText(shareUrl(plan))}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: "#1a2a1a", border: "1px solid #2a3a2a", color: "#c8d8c8" }}
                      >
                        Copy Share Link
                      </button>
                      {confirmDelete === plan.id ? (
                        <>
                          <button onClick={() => handleDelete(plan.id)}
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{ backgroundColor: "#5a1010", color: "#f87171" }}>
                            Confirm Delete
                          </button>
                          <button onClick={() => setConfirmDelete(null)}
                            className="px-3 py-2 text-sm" style={{ color: "#8a9e8a" }}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setConfirmDelete(plan.id)}
                          className="px-4 py-2 text-sm" style={{ color: "#4a5a4a" }}>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
