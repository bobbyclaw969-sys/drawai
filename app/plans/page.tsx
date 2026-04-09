"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import { SavedPlan, loadPlans, deletePlan } from "@/lib/savedPlans";
import AppNav from "@/components/AppNav";

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
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadPlans().then(p => { setPlans(p); setLoading(false); });
  }, []);

  const handleDelete = async (id: string) => {
    await deletePlan(id);
    const updated = await loadPlans();
    setPlans(updated);
    setConfirmDelete(null);
  };

  return (
    <div className="page">
      <AppNav />
      <div className="page-inner">
        <div className="flex items-center justify-between mb-8">
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.03em" }}>
            Saved Plans
          </h1>
          <Link href="/plan" className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }}>
            + New Plan
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="card" style={{ padding: 24 }}>
                <div className="skeleton skeleton-line" style={{ width: "40%" }} />
                <div className="skeleton skeleton-line" style={{ width: "70%", marginTop: 8 }} />
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="card text-center" style={{ padding: 48 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>📌</div>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>No saved plans yet</p>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 24 }}>
              After generating a strategy, click &ldquo;Save Plan&rdquo; to store it here.
            </p>
            <Link href="/plan" className="btn-primary" style={{ padding: "10px 28px", fontSize: 14 }}>
              Build a Plan
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {plans.map(plan => {
              const isOpen = expanded === plan.id;
              const species = plan.profile.species.map(s => SPECIES_LABELS[s as SpeciesKey]).join(", ");
              const residency = STATE_NAMES[plan.profile.residency] ?? plan.profile.residency;
              const created = new Date(plan.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

              return (
                <div key={plan.id} className="card" style={{ overflow: "hidden" }}>
                  <button
                    className="w-full text-left"
                    style={{ padding: 24, background: "none", border: "none", color: "inherit", cursor: "pointer" }}
                    onClick={() => setExpanded(isOpen ? null : plan.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: "var(--amber)" }}>
                          {plan.name || `${species} Strategy`}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>
                          {residency} · {species} · {plan.profile.huntType} · ${plan.profile.budget.toLocaleString()}/yr · {plan.profile.planningYears}yr plan
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>Saved {created}</div>
                      </div>
                      <span style={{ color: "var(--text-3)", fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid var(--border)", padding: "0 24px 24px" }}>
                      <div className="strategy-output" style={{ maxHeight: 384, overflowY: "auto", padding: "16px 0" }}>
                        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 14 }}>
                          {renderMarkdownPlain(plan.strategy)}
                        </pre>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                        <Link
                          href={`/strategy?p=${btoa(JSON.stringify(plan.profile))}`}
                          className="btn-primary"
                          style={{ padding: "8px 18px", fontSize: 13 }}
                        >
                          Regenerate Strategy
                        </Link>
                        <button
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/strategy?p=${btoa(JSON.stringify(plan.profile))}`)}
                          className="btn-ghost"
                          style={{ padding: "8px 18px", fontSize: 13 }}
                        >
                          Copy Share Link
                        </button>
                        {confirmDelete === plan.id ? (
                          <>
                            <button onClick={() => handleDelete(plan.id)}
                              className="px-4 py-2 rounded-lg text-sm font-medium"
                              style={{ backgroundColor: "var(--danger-bg)", border: "1px solid var(--danger-border)", color: "var(--danger)" }}>
                              Confirm Delete
                            </button>
                            <button onClick={() => setConfirmDelete(null)}
                              style={{ padding: "8px 12px", fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button onClick={() => setConfirmDelete(plan.id)}
                            style={{ padding: "8px 12px", fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>
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
      </div>
    </div>
  );
}
